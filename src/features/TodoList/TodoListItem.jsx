
import TextInputWithLabel from "../../shared/TextInputWithLabel.jsx";
import { useEditableTitle } from "../../hooks/useEditableTitle.js";

function TodoListItem({todo, onCompleteTodo, onUpdateTodo}) {
    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit
    } = useEditableTitle(todo.title);

    const handleCancel = cancelEdit;

    const handleEdit = (event) => {
        updateTitle(event.target.value);
    };

    const handleUpdate = (event) => {
        if (!isEditing) return;
        event.preventDefault();
        const finalTitle = finishEdit();
        onUpdateTodo({ ...todo, title: finalTitle });
    };

    return (
        isEditing ? (
                    <form onSubmit={handleUpdate}>
                        <TextInputWithLabel value={workingTitle} onChange={handleEdit}  />
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button type="button" onClick={handleUpdate} disabled={!workingTitle.trim()}>
                    Update
                            </button>
                            </form>
        ) : (
            <li>
                <label>
                    <input
                        type="checkbox"
                        id={`checkbox${todo.id}`}
                        checked={todo.isCompleted}
                        onChange={() => onCompleteTodo(todo.id)}
                    />
                </label>
                <span onClick={() => startEditing()}>{todo.title}</span>
            </li>
        )
)
}

export default TodoListItem;