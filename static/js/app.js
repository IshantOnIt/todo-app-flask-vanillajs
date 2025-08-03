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

  async function updateTodo(id, updates) {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    const updatedTodo = await res.json();

    return updatedTodo;
  }

  async function deleteTodo(id) {
    const res = await fetch(`/api/todos/${todo.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Error deleting todo");
    }
  }

  function createTodo(todo) {
    const listItemCheckbox = document.createElement("input");
    listItemCheckbox.type = "checkbox";
    listItemCheckbox.checked = todo.completed;
    listItemCheckbox.addEventListener("change", async (e) => {
      try {
        const updatedTodo = await updateTodo(todo.id, {
          completed: e.target.checked,
        });

        if (!updatedTodo || updatedTodo.completed === null) {
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

    const listItemDeleteButton = document.createElement("button");
    listItemDeleteButton.innerText = "Delete";
    listItemDeleteButton.addEventListener("click", async (e) => {
      try {
        await deleteTodo(todo.id);
        todoList.removeChild(e.target.parentNode);
      } catch (e) {
        console.error("Error deleting todo: ", e);
      }
    });

    const listItemEditButton = document.createElement("button");
    listItemEditButton.innerText = "Edit";
    listItemEditButton.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = todo.title;
      listItemLabel.replaceChild(input, listItemSpan);
      input.focus();

      const save = async () => {
        const newTitle = input.value.trim();
        if (newTitle && newTitle !== todo.title) {
          try {
            const updatedTodo = await updateTodo(todo.id, {
              title: newTitle,
            });

            if (!updatedTodo || updatedTodo.title === null) {
              throw new Error("Error updating todo");
            }

            todo.title = updatedTodo.title;
            listItemSpan.innerText = updatedTodo.title;
          } catch (e) {
            console.error("Error updating title: ", e);
          }
        }
        listItemLabel.replaceChild(listItemSpan, input);
      };

      input.addEventListener("blur", save);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          input.blur();
        } else if (e.key === "Escape") {
          listItemLabel.replaceChild(listItemSpan, input);
        }
      });
    });

    const listItem = document.createElement("li");
    listItem.appendChild(listItemLabel);
    listItem.appendChild(listItemEditButton);
    listItem.appendChild(listItemDeleteButton);

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
