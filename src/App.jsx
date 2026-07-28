import { useState } from "react";
import "./App.css";
import TodoForm from "./TodoForm.jsx";
import TodoList from "./TodoList.jsx";

 const todos = [
    { id: 1, title: "review resources and learning objectives in lessons" },
    { id: 2, title: "take notes" },
    { id: 3, title: "code out app" },
 ];

function App() {

  const [todoList, setTodoList] = useState(todos);

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />
      <TodoList todoList={todoList} />
    </div>
  );
}

export default App;
