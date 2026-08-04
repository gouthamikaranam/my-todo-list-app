import { useRef } from 'react';
import { useState } from "react";

function TodoForm({ onAddTodo }) {
    const [workingTodoTitle, setWorkingTodoTitle] = useState("");
    const inputRef = useRef();

    const handleAddTodo = (event) => {
        event.preventDefault();
            onAddTodo(workingTodoTitle);
            setWorkingTodoTitle("");
            inputRef.current.focus();
    };
    return (
        <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo</label>
            <input
                ref={inputRef}
                type="text"
                value={workingTodoTitle}
                id="todoTitle"
                name="todoTitle"
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                placeholder={'Todo text'}
                required
            />
            <button type="submit" disabled={!workingTodoTitle.trim()}>
                Add Todo
            </button>
    </form>
  );
}
export default TodoForm;
