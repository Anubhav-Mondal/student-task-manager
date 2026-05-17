function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (task === "") {
    errorMsg.textContent = "Please enter a task.";
    return;
  }
  errorMsg.textContent = "";

  const now = new Date();
  const timestamp = ` (${now.toLocaleDateString()} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;

  const taskData = {
    text: task,
    completed: false,
    timestamp: timestamp
  };

  createTaskElement(taskData);
  input.value = "";
  taskTracker();
  saveTasks();
}

function createTaskElement(task) {
  const li = document.createElement("li");
  li.innerHTML = `
    <input type="checkbox" ${task.completed ? 'checked' : ''}>
    <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
    <small style="margin-left: 10px; color: #888;">${task.timestamp}</small>
    <button class="edit-btn">Edit</button>
    <button class="remove-btn">Remove</button>
  `;

  const checkbox = li.querySelector('input[type="checkbox"]');
  checkbox.addEventListener("change", () => {
    li.querySelector('span').classList.toggle("completed");
    taskTracker();
    saveTasks();
  });

  const editButton = li.querySelector('.edit-btn');
  editButton.addEventListener("click", () => {
    const span = li.querySelector('span');
    const newTask = prompt("Edit task:", span.textContent);
    if (newTask !== null) {
      span.textContent = newTask;
      saveTasks();
    }
  });

  li.querySelector('.remove-btn').addEventListener("click", () => {
    li.remove();
    taskTracker();
    saveTasks();
  });

  document.getElementById("taskList").appendChild(li);
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach((li) => {
    tasks.push({
      text: li.querySelector("span").textContent,
      completed: li.querySelector("input").checked,
      timestamp: li.querySelector("small").textContent
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  savedTasks.forEach((task) => createTaskElement(task));
  taskTracker();
}

document.addEventListener("DOMContentLoaded", loadTasks);

const clearAllBtn = document.getElementById("clearAllBtn");
if (clearAllBtn) {
  clearAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
      document.getElementById("taskList").innerHTML = "";
      taskTracker();
      saveTasks();
    }
  });
}

function taskTracker() {
  const tasks = document.querySelectorAll("#taskList li");
  const completed = document.querySelectorAll("#taskList input:checked");
  const stats = document.getElementById("taskStats");
  if (stats) stats.innerText = `✅ ${completed.length} / ${tasks.length} completed`;

  const headerStats = document.getElementById("headerStats");
  if (headerStats) {
    const percentage = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
    headerStats.innerText = `🎯 ${percentage}%`;
  }
  
  const celebration = document.getElementById("celebration");
  if (tasks.length > 0 && tasks.length === completed.length) {
    celebration.classList.remove("hidden");
    celebration.classList.add("show");
  } else {
    celebration.classList.remove("show");
    celebration.classList.add("hidden");
  }
}
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("input", function () {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll("#taskList li").forEach((li) => {
      const text = li.querySelector("span").textContent.toLowerCase();
      li.style.display = text.includes(query) ? "flex" : "none";
    });
  });
}

// Theme Selector & Persistence Engine
document.addEventListener("DOMContentLoaded", () => {
  const themeSwitcher = document.getElementById("themeSwitcher");
  const savedTheme = localStorage.getItem("theme") || "dark";

  // Apply theme to document root
  document.documentElement.setAttribute("data-theme", savedTheme);

  if (themeSwitcher) {
    themeSwitcher.value = savedTheme;
    themeSwitcher.addEventListener("change", (e) => {
      const selectedTheme = e.target.value;
      document.documentElement.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("theme", selectedTheme);
    });
  }
});

// Dynamic Greeting & Live Date Engine
function updateHeaderGreetingAndDate() {
  const greetingEl = document.getElementById("headerGreeting");
  const dateEl = document.getElementById("headerDate");
  
  if (!greetingEl && !dateEl) return;

  const now = new Date();
  const hour = now.getHours();
  
  let greetingText = "👋 Focus Time!";
  if (hour >= 5 && hour < 12) {
    greetingText = "🌅 Good morning, Student!";
  } else if (hour >= 12 && hour < 17) {
    greetingText = "☀️ Good afternoon, Student!";
  } else if (hour >= 17 && hour < 22) {
    greetingText = "🌆 Good evening, Student!";
  } else {
    greetingText = "🌌 Happy late-night study!";
  }

  // Format date: e.g. "Sun, May 17"
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  const formattedDate = now.toLocaleDateString('en-US', options);

  if (greetingEl) greetingEl.textContent = greetingText;
  if (dateEl) dateEl.textContent = formattedDate;
}

// Initialize greeting and date when page loads
document.addEventListener("DOMContentLoaded", updateHeaderGreetingAndDate);
