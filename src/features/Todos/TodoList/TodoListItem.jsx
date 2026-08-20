import { useRef, useState } from "react";
import TextInputWithLabel from "../../../shared/TextInputWithLabel.jsx";
import { isValidTodoTitle } from "../../../utils/todoValidation.js";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);
    const inputRef = useRef();

     const handleEdit = (event) => {
        setWorkingTitle(event.target.value);
    };

      const handleCancel = () => {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    };

    const handleUpdate = (event) => {
        event.preventDefault();
        if (!isEditing) return;
        onUpdateTodo({ ...todo, title: workingTitle });
        setIsEditing(false);
    };

    return (
        <li>
            <form onSubmit={handleUpdate}>
                {isEditing ? (
                    <>
                        <TextInputWithLabel
                            elementId={`todoTitle${todo.id}`}
                            labelText="Todo"
                            ref={inputRef}
                            value={workingTitle}
                            onChange={handleEdit}
                        />
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValidTodoTitle(workingTitle)}
                        >
                            Update
                        </button>
                    </>
                ) : (
                    <>
                        <label>
                            <input
                                type="checkbox"
                                id={`checkbox${todo.id}`}
                                checked={todo.isCompleted}
                                onChange={() => onCompleteTodo(todo.id)}
                            />
                        </label>
                        <span onClick={() => setIsEditing(true)}>{todo.title}</span>
                    </>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;