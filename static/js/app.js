document.addEventListener("DOMContentLoaded", function () {
  const todoform = document.getElementById("todo-form");
  const todoTitle = document.getElementById("todo-title");
  const todoList = document.getElementById("todo-list");

  async function loadTodos() {
    try {
      const res = await fetch("/api/todos");
      const todos = await res.json();
      todos.forEach((todo) => {
        const listItem = document.createElement("li");
        listItem.innerText = todo.title;
        todoList.appendChild(listItem);
      });
    } catch (e) {
      console.error("Error loading todos: ", e);
    }
  }

  todoform.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = todoTitle.value;
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      const newTodo = await res.json();

      const listItem = document.createElement("li");
      listItem.innerText = newTodo.title;
      todoList.appendChild(listItem);
      todoTitle.value = "";
    } catch (e) {
      console.error("Error creating new todo: ", e);
    }
  });

  loadTodos();
});
