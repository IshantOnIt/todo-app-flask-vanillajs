export async function fetchTodos() {
  const res = await fetch("/api/todos");
  const todos = await res.json();
  return todos;
}

export async function updateTodo(id, updates) {
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

export async function deleteTodo(id) {
  const res = await fetch(`/api/todos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error deleting todo");
  }
}
