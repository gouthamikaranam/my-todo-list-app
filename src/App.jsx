import './App.css'

function App() {
  const todoList = [
    {id: 1, title: "Learn objectives in each week lessons"},
    {id: 2, title: "review resources"},
    {id: 3, title: "take notes"},
    {id: 4, title: "code out app"},
]
  

  return (
    <div>
        <h1>Todo List</h1>
        <ul>
            {todoList.map(todo => <li key={todo.id}>{todo.title}</li>)}
        </ul>
    </div>
  );
}

export default App
