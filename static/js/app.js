document.addEventListener("DOMContentLoaded", function () {
  const todoform = document.getElementById("todo-form");
  const todoTitle = document.getElementById("todo-title");
  const todoList = document.getElementById("todo-list");

  async function loadTodos() {
    try {
      const res = await fetch("/api/todos");
      const todos = await res.json();
      todos.forEach((todo) => {
        createTodo(todo);
      });
    } catch (e) {
      console.error("Error loading todos: ", e);
    }
  }

  function createTodo(todo) {
    const listItemCheckbox = document.createElement("input");
    listItemCheckbox.type = "checkbox";
    listItemCheckbox.checked = todo.completed;
    listItemCheckbox.addEventListener("change", async (e) => {
      try {
        const res = await fetch(`/api/todos/${todo.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completed: e.target.checked }),
        });
        const updatedTodo = await res.json();
        if (!updatedTodo) {
          throw new Error("Error updating todo");
        }
        listItemCheckbox.checked = updatedTodo.completed;
      } catch (e) {
        console.error("Error updating todo: ", e);
      }
    });

    const listItemSpan = document.createElement("span");
    listItemSpan.innerText = todo.title;

    const listItemLabel = document.createElement("label");
    listItemLabel.appendChild(listItemCheckbox);
    listItemLabel.appendChild(listItemSpan);

    const listItem = document.createElement("li");
    listItem.appendChild(listItemLabel);
    todoList.appendChild(listItem);
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

      if (!newTodo) {
        throw new Error("Error creating new todo");
      }

      createTodo(newTodo);

      todoTitle.value = "";
    } catch (e) {
      console.error("Error creating new todo: ", e);
    }
  });

  loadTodos();
});
