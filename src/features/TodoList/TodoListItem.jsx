import { useRef } from "react";
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { useEditableTitle } from "../../hooks/useEditableTitle.js";


function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
     const inputRef = useRef();
    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit
    } = useEditableTitle(todo.title);

    const handleEdit = (event) => {
        updateTitle(event.target.value);
    };

    const handleCancel = cancelEdit;

    const handleUpdate = (event) => {
        if (!isEditing) return;
        event.preventDefault();
        const finalTitle = finishEdit();
        onUpdateTodo({ ...todo, title: finalTitle });
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
                            type="button"
                            onClick={handleUpdate}
                            disabled={!workingTitle.trim()}
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
                        <span onClick={() => startEditing()}>{todo.title}</span>
                    </>
                )}
            </form>
        </li>
    );
}

export default TodoListItem;