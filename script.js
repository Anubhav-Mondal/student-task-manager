/* ============================================================
   ACADEMIC TASK MANAGER - JAVASCRIPT
   ============================================================ */

/* ===== ADD TASK FUNCTIONALITY ===== */
function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();
  const errorMsg = document.querySelector(".error-message");

  // Validation
  if (task === "") {
    errorMsg.textContent = "Please enter a task description.";
    return;
  }

  errorMsg.textContent = "";
  const li = document.createElement("li");

  // Create checkbox
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", function () {
    toggleTask(checkbox);
  });

  // Create span for task text
  const span = document.createElement("span");
  span.textContent = task;

  // Create timestamp
  const now = new Date();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const day = dayNames[now.getDay()];
  const date = `${now.getDate()} ${now.toLocaleString("default", {
    month: "long",
  })} ${now.getFullYear()}`;
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const timeElement = document.createElement("small");
  timeElement.textContent = `${day}, ${date} at ${time}`;

  // Create Edit button
  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.type = "button";
  editButton.addEventListener("click", function () {
    const newTask = prompt("Edit task:", span.textContent);
    if (newTask !== null && newTask.trim() !== "") {
      span.textContent = newTask.trim();
    }
  });

  // Create Remove button
  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.type = "button";
  removeButton.addEventListener("click", function () {
    li.remove();
    taskTracker();
  });

  // Append elements in grid order: checkbox, span, time, buttons
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(timeElement);
  li.appendChild(editButton);
  li.appendChild(removeButton);

  // Add to task list
  document.getElementById("taskList").appendChild(li);

  // Clear input
  input.value = "";
  input.focus();

  // Update tracker
  taskTracker();
}

/* ===== THEME SWITCHER ===== */
const themeSwitcher = document.getElementById("themeSwitcher");

// Load saved theme (default to "professional")
const savedTheme = localStorage.getItem("theme") || "professional";
document.documentElement.setAttribute("data-theme", savedTheme);

if (themeSwitcher) {
  themeSwitcher.value = savedTheme;

  themeSwitcher.addEventListener("change", function (e) {
    const selectedTheme = e.target.value;
    document.documentElement.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("theme", selectedTheme);
  });
}

/* ===== TOGGLE TASK COMPLETION ===== */
function toggleTask(checkbox) {
  const span = checkbox.nextElementSibling;
  span.classList.toggle("completed");
  taskTracker();
}

/* ===== TASK TRACKER & STATS ===== */
function taskTracker() {
  const tasks = document.querySelectorAll("#taskList li");
  const completed = document.querySelectorAll("#taskList input:checked");

  // Update empty state
  const empty = document.getElementById("emptyState");
  if (empty) {
    empty.style.display = tasks.length === 0 ? "block" : "none";
  }

  // Update stats badge
  const stats = document.getElementById("taskStats");
  if (stats) {
    const percentage =
      tasks.length > 0
        ? Math.round((completed.length / tasks.length) * 100)
        : 0;
    stats.textContent = `${completed.length} / ${tasks.length} tasks completed`;
  }

  // Show celebration when all tasks complete
  const celebration = document.getElementById("celebration");
  if (
    tasks.length > 0 &&
    tasks.length === completed.length &&
    !celebration.classList.contains("show")
  ) {
    celebration.classList.remove("hidden");
    setTimeout(() => {
      celebration.classList.add("show");
    }, 100);
  } else if (tasks.length !== completed.length) {
    celebration.classList.remove("show");
    celebration.classList.add("hidden");
  }
}

/* ===== KEYBOARD ACCESSIBILITY ===== */
document.addEventListener("DOMContentLoaded", function () {
  // Allow Enter key in task input
  const taskInput = document.getElementById("taskInput");
  if (taskInput) {
    taskInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addTask();
      }
    });
  }

  // Initialize task tracker on load
  taskTracker();
});

/* ===== PREVENT FORM SUBMISSION ON TASK FORM ===== */
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addTask();
  });
}

