const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");

const coinsText = document.getElementById("coins");
const streakText = document.getElementById("streakCount");

const xpText = document.getElementById("xpText");
const xpFill = document.getElementById("xpFill");

const filterBtns = document.querySelectorAll(".filter-btn");

const categorySelect =
  document.getElementById("categorySelect");

const questText =
  document.getElementById("questText");

const themeToggle =
  document.getElementById("themeToggle");

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
          Add tasks and begin your productivity adventure.
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

        if (
          updated !== null &&
          updated.trim() !== ""
        ) {

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

  const completed =
    tasks.filter(task => task.completed).length;

  completedTasks.textContent = completed;

  questText.textContent = `${completed} / 5`;
}

/* GAMIFICATION */

function updateGamification() {

  coinsText.textContent = coins;

  streakText.textContent = streak;

  xpText.textContent = `${xp} / 300 XP`;

  xpFill.style.width = `${xp / 3}%`;
}

/* FILTER */

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

/* POMODORO TIMER */

let studyTime = 25 * 60;

let breakTime = 5 * 60;

let currentTime = studyTime;

let timer;

let isStudy = true;

function updateDisplay() {

  const minutes =
    Math.floor(currentTime / 60);

  let seconds =
    currentTime % 60;

  seconds =
    seconds < 10
      ? "0" + seconds
      : seconds;

  document.getElementById("timer").innerText =
    `${minutes}:${seconds}`;
}

function startTimer() {

  if (timer) return;

  timer = setInterval(() => {

    currentTime--;

    updateDisplay();

    if (currentTime <= 0) {

      clearInterval(timer);

      timer = null;

      if (isStudy) {

        alert("Study session completed!");

        isStudy = false;

        currentTime = breakTime;

        document.getElementById("modeText")
          .innerText = "Break Time";

      } else {

        alert("Break finished!");

        isStudy = true;

        currentTime = studyTime;

        document.getElementById("modeText")
          .innerText = "Study Time";

      }

      updateDisplay();

      startTimer();
    }

  }, 1000);
}

function pauseTimer() {

  clearInterval(timer);

  timer = null;
}

function resetTimer() {

  clearInterval(timer);

  timer = null;

  isStudy = true;

  currentTime = studyTime;

  document.getElementById("modeText")
    .innerText = "Study Time";

  updateDisplay();
}

updateDisplay();