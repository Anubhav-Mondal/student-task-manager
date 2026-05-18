const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const categorySelect = document.getElementById("categorySelect");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const points = document.getElementById("points");
const streakCount = document.getElementById("streakCount");

const filterBtns = document.querySelectorAll(".filter-btn");

const themeToggle = document.getElementById("themeToggle");

const xpFill = document.getElementById("xpFill");
const xpText = document.getElementById("xpText");

let tasks = [];

let currentFilter = "All";

let coins = 0;

let streak = 0;

let xp = 120;

/* ADD TASK */

function addTask() {

  const text = taskInput.value.trim();

  const category = categorySelect.value;

  if (text === "") return;

  const task = {
    id: Date.now(),
    text,
    category,
    completed: false
  };

  tasks.push(task);

  taskInput.value = "";

  renderTasks();
}

/* RENDER */

function renderTasks() {

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter !== "All") {

    filteredTasks = tasks.filter(
      task => task.category === currentFilter
    );

  }

  if (filteredTasks.length === 0) {

    taskList.innerHTML = `
      <div class="empty-state">

        <i class="ri-ghost-2-line"></i>

        <h3>No Tasks Yet</h3>

        <p>
          Add tasks and begin your productivity journey ✨
        </p>

      </div>
    `;

  }

  filteredTasks.forEach(task => {

    const div = document.createElement("div");

    div.classList.add("task");

    if (task.completed) {
      div.classList.add("completed");
    }

    div.innerHTML = `
      <div class="task-left">

        <div class="check-btn"></div>

        <div>

          <h3 class="task-title">
            ${task.text}
          </h3>

          <p class="task-category">
            ${task.category}
          </p>

        </div>

      </div>

      <div class="task-actions">

        <button class="icon-btn edit-btn">
          <i class="ri-edit-line"></i>
        </button>

        <button class="icon-btn delete-btn">
          <i class="ri-delete-bin-6-line"></i>
        </button>

      </div>
    `;

    /* COMPLETE */

    div.querySelector(".check-btn")
      .addEventListener("click", () => {

        task.completed = !task.completed;

        if (task.completed) {

          coins += 10;

          streak += 1;

          xp += 20;

        } else {

          coins -= 10;

          streak -= 1;

          xp -= 20;

        }

        updateGamification();

        renderTasks();

      });

    /* DELETE */

    div.querySelector(".delete-btn")
      .addEventListener("click", () => {

        tasks = tasks.filter(
          t => t.id !== task.id
        );

        renderTasks();

      });

    /* EDIT */

    div.querySelector(".edit-btn")
      .addEventListener("click", () => {

        const updated = prompt(
          "Edit your quest",
          task.text
        );

        if (updated !== null && updated.trim() !== "") {

          task.text = updated;

          renderTasks();

        }

      });

    taskList.appendChild(div);

  });

  updateStats();
}

/* STATS */

function updateStats() {

  totalTasks.textContent = tasks.length;

  const completed = tasks.filter(
    task => task.completed
  ).length;

  completedTasks.textContent = completed;
}

/* GAMIFICATION */

function updateGamification() {

  points.textContent = coins;

  streakCount.textContent = streak;

  xpText.textContent = `${xp} / 300 XP`;

  xpFill.style.width = `${xp / 3}%`;
}

/* FILTERS */

filterBtns.forEach(btn => {

  btn.addEventListener("click", () => {

    filterBtns.forEach(
      b => b.classList.remove("active")
    );

    btn.classList.add("active");

    currentFilter = btn.dataset.filter;

    renderTasks();

  });

});

/* THEME */

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light");

});

/* ENTER */

taskInput.addEventListener("keypress", e => {

  if (e.key === "Enter") {
    addTask();
  }

});

/* BUTTON */

addTaskBtn.addEventListener(
  "click",
  addTask
);

updateGamification();