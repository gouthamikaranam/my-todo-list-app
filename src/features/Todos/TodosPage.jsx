import { useState, useEffect } from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";

function TodosPage({ token }) {

  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
      setError("");
      setIsTodoListLoading(true);
      try {
        const params = new URLSearchParams({
          limit: 100,
        });
        const response = await fetch(`/api/tasks?${params}`, {
          headers: {
            "X-CSRF-TOKEN": token,
          },
          credentials: "include",
        });
        if (response.status === 401) {
          throw new Error("unauthorized");
        }
        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        setTodoList(data.tasks);
      } catch (error) {
        if (error.message === "unauthorized") {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(error.message);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token]);

  async function addTodo(todoTitle) {
    setError("");
    const newTodo = { id: Date.now(), title: todoTitle, isCompleted: false };

    setTodoList((prevTodoList) => [newTodo, ...prevTodoList]);

    const payload = {
      title: newTodo.title,
      isCompleted: newTodo.isCompleted,
    };

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to save todo");
      }
      const taskFromServer = await response.json();

      setTodoList((prevTodoList) =>
        prevTodoList.map((todo) => (todo.id === newTodo.id ? taskFromServer : todo))
      );
    } catch {
      setError(`Could not add "${newTodo.title}". Please try again.`);
      setTodoList((prevTodoList) =>
        prevTodoList.filter((todo) => todo.id !== newTodo.id)
      );
    }
  }

  async function completeTodo(id) {
    setError("");
    let originalTodo;

    setTodoList((prevTodoList) => {
      originalTodo = prevTodoList.find((todo) => todo.id === id);
      return prevTodoList.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      );
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({ isCompleted: true }),
      });
      if (!response.ok) {
        throw new Error("Failed to complete todo");
      }
    } catch {
      setError(`Could not complete "${originalTodo.title}". Please try again.`);
      setTodoList((prevTodoList) =>
        prevTodoList.map((todo) => (todo.id === id ? originalTodo : todo))
      );
    }
  }

  async function updateTodo(editedTodo) {
    setError("");
    let originalTodo;

    setTodoList((prevTodoList) => {
      originalTodo = prevTodoList.find((todo) => todo.id === editedTodo.id);
      return prevTodoList.map((todo) =>
        todo.id === editedTodo.id ? { ...editedTodo } : todo
      );
    });

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        credentials: "include",
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update todo");
      }
    } catch {
      setError(`Could not update "${originalTodo.title}". Please try again.`);
      setTodoList((prevTodoList) =>
        prevTodoList.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );
    }
  }

  return (
    <div>
      {error && (
        <div>
          <p role="alert">{error}</p>
          <button onClick={() => setError("")}>Clear Error</button>
        </div>
      )}
      {isTodoListLoading && <p>Todo list loading...</p>}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;