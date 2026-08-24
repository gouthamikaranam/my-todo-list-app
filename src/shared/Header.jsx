function Header({ email, token, onSetToken, onSetEmail }) {
  function handleLogOut() {
    onSetToken("");
    onSetEmail("");
  }

  return (
    <header>
      <h1>Todo List</h1>
      {token && (
        <div>
          <span>{email}</span>
          <button type="button" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;