import { useRef } from 'react';
import { useState } from "react";
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../utils/todoValidation';

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
            <TextInputWithLabel
                ref={inputRef}
                value={workingTodoTitle}
                elementId="todoTitle"
                labelText="Todo"
                onChange={(event) => setWorkingTodoTitle(event.target.value)}
                />
            <button disabled={!isValidTodoTitle(workingTodoTitle)}>Add Todo</button>
    </form>
  );
}
export default TodoForm;
