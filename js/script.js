const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task");
const dateInput = document.getElementById("date");
const list = document.getElementById("todo-list");
const filter = document.getElementById("filter");
const sortBtn = document.getElementById("sort-date");

/* ===== LOCAL STORAGE ===== */
function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

/* ===== RENDER TABLE ===== */
function renderTodos() {
  const todos = getTodos();
  list.innerHTML = "";

  if (todos.length === 0) {
    list.innerHTML = `
      <tr>
        <td colspan="4" class="empty">
          No tasks yet. Add your first task!
        </td>
      </tr>
    `;
    return;
  }

  todos.forEach((todo, index) => {
    const row = document.createElement("tr");
    row.className = todo.completed ? "completed" : "uncompleted";

    row.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td class="status ${todo.completed ? "completed" : "uncompleted"}">
        ${todo.completed ? "Completed" : "Uncompleted"}
      </td>
      <td>
        <button class="done" data-index="${index}">Done</button>
        <button class="delete" data-index="${index}">Delete</button>
      </td>
    `;

    list.appendChild(row);
  });

  applyFilter();
}

/* ===== ADD TASK ===== */
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (taskInput.value === "" || dateInput.value === "") {
    alert("Please fill all fields");
    return;
  }

  const todos = getTodos();

  todos.push({
    task: taskInput.value,
    date: dateInput.value,
    completed: false
  });

  saveTodos(todos);
  renderTodos();

  taskInput.value = "";
  dateInput.value = "";
});

/* ===== DONE & DELETE ===== */
list.addEventListener("click", function (e) {
  const index = e.target.dataset.index;
  const todos = getTodos();

  if (e.target.classList.contains("done")) {
    todos[index].completed = !todos[index].completed;
  }

  if (e.target.classList.contains("delete")) {
    todos.splice(index, 1);
  }

  saveTodos(todos);
  renderTodos();
});

/* ===== FILTER ===== */
function applyFilter() {
  const rows = list.querySelectorAll("tr");

  rows.forEach(row => {
    if (row.classList.contains("empty")) return;

    if (filter.value === "all") {
      row.style.display = "";
    } else if (filter.value === "completed") {
      row.style.display = row.classList.contains("completed") ? "" : "none";
    } else {
      row.style.display = row.classList.contains("uncompleted") ? "" : "none";
    }
  });
}

filter.addEventListener("change", applyFilter);

/* ===== SORT BY DUE DATE ===== */
sortBtn.addEventListener("click", function () {
  const todos = getTodos();

  todos.sort((a, b) => new Date(a.date) - new Date(b.date));

  saveTodos(todos);
  renderTodos();
});

/* ===== LOAD ON REFRESH ===== */
document.addEventListener("DOMContentLoaded", renderTodos);
