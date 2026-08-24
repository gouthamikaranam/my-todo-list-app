import { useState } from "react";
import "./App.css";
import Header from "./shared/Header.jsx";
import TodosPage from "./features/Todos/TodosPage.jsx";
import Logon from "./features/Logon.jsx";

function App() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  function handleLogOut() {
    setToken("");
    setEmail("");
  }

  return (
    <>
      <Header />
      {token ? (
        <>
          <p>
            Logged in as {email}{" "}
            <button type="button" onClick={handleLogOut}>
              Log Out
            </button>
          </p>
          <TodosPage token={token} />
        </>
      ) : (
        <Logon onSetEmail={setEmail} onSetToken={setToken} />
      )}
    </>
  );
}

export default App;