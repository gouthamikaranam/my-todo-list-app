import { useState, useEffect, useCallback } from "react";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList/TodoList.jsx";
import SortBy from "../../shared/SortBy.jsx";
import  useDebounce from "../../utils/useDebounce.js";
import FilterInput from "../../shared/FilterInput.jsx";

function TodosPage({ token }) {

  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [isTodoListLoading, setIsTodoListLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    const fetchTodos = async () => {
      setError("");
      setIsTodoListLoading(true);
      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100,
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);
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
        setFilterError('');
      } catch (error) {
        const isFilterOrSort =
          debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc';
        
        const message =
          error.message === "unauthorized"
            ? "Your session has expired. Please log in again."
            : isFilterOrSort
              ? `Error filtering/sorting todos: ${error.message}`
              : `Error fetching todos: ${error.message}`;
        
        if (isFilterOrSort) {
          setFilterError(message);
        } else {
          setError(message);
        }
      } finally {
        setIsTodoListLoading(false);
      }
    };

    if (token) {
      fetchTodos();
    }
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

  const invalidateCache = useCallback(() => {
  //console.log("Invalidating memo cache after todo mutation");
    setDataVersion((prev) => prev + 1);
  }, []);

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
      invalidateCache();
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
      invalidateCache();
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
      invalidateCache();
    } catch {
      setError(`Could not update "${originalTodo.title}". Please try again.`);
      setTodoList((prevTodoList) =>
        prevTodoList.map((todo) =>
          todo.id === editedTodo.id ? originalTodo : todo
        )
      );
    }
  }

const handleFilterChange = (newTerm) => {
  setFilterTerm(newTerm);
};

  return (
    <div>
      {error && (
        <div>
          <p role="alert">{error}</p>
          <button onClick={() => setError("")}>Clear Error</button>
        </div>
      )}
      {filterError && (
  <div>
    <p role="alert">{filterError}</p>
    <button onClick={() => setFilterError('')}>Clear Filter Error</button>
    <button
      onClick={() => {
        setFilterTerm('');
        setSortBy('createdAt');
        setSortDirection('desc');
        setFilterError('');
      }}
    >
            Reset Filters
          </button>
        </div>
      )}
      {isTodoListLoading && <p>Todo list loading...</p>}
      <SortBy
      sortBy={sortBy}
      sortDirection={sortDirection}
      onSortByChange={setSortBy}
      onSortDirectionChange={setSortDirection}
      />
      <FilterInput
      filterTerm={filterTerm}
      onFilterChange={handleFilterChange}
    />
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        dataVersion={dataVersion}
        onCompleteTodo={completeTodo}
        onUpdateTodo={updateTodo}
      />
    </div>
  );
}

export default TodosPage;