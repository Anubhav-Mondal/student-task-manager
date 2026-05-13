function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (task.trim()=== "") {
    errorMsg.textContent = " Please enter a task.";
    return;
  };
  errorMsg.textContent = "";
  const li = document.createElement("li");


  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("change", function () {
    toggleTask(checkbox);
  });

  const span = document.createElement("span");
  span.textContent = task;

  const now = new Date();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = dayNames[now.getDay()];
  const date =`${now.getDate()} ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const timeElement = document.createElement("small");
  timeElement.textContent = ` (${day}, ${date} at ${time})`;
  timeElement.style.marginLeft = "10px";
  timeElement.style.color = "#888";


  const editButton = document.createElement("button");
    editButton.innerHTML = '<span class="material-symbols-outlined">edit</span>';
    editButton.title = "Edit task";
    editButton.addEventListener("click", function () {
      const newTask = prompt("Edit task:", span.textContent);
      if (newTask !== null) {
        span.textContent = newTask;
      }
    });
    li.appendChild(span);
    li.appendChild(timeElement);
    li.appendChild(editButton);
  const removeButton = document.createElement("button");
  removeButton.innerHTML = '<span class="material-symbols-outlined">delete</span>';
  removeButton.title = "Remove task";
  removeButton.addEventListener("click", function () {
    li.remove();

    taskTracker();
    
  });



  li.appendChild(checkbox);
  li.appendChild(span);


  li.appendChild(removeButton);

  document.getElementById("taskList").appendChild(li);
  
  input.value = "";

  taskTracker();

}
/* =========================
   CUSTOM THEME DROPDOWN
========================= */
const themeDropdown = document.getElementById("themeDropdown");
const dropdownTrigger = document.getElementById("dropdownTrigger");
const dropdownMenu = document.getElementById("dropdownMenu");
const dropdownItems = document.querySelectorAll(".dropdown-item");

// Load and apply saved theme
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  
  // Update trigger UI
  const selectedItem = document.querySelector(`.dropdown-item[data-value="${theme}"]`);
  if (selectedItem && dropdownTrigger) {
    const icon = selectedItem.querySelector(".material-symbols-outlined").textContent;
    const text = selectedItem.textContent.trim().replace(icon, "").trim();
    dropdownTrigger.querySelector(".icon").textContent = icon;
    dropdownTrigger.querySelector(".text").textContent = text;
  }
}

if (dropdownTrigger) {
  dropdownTrigger.addEventListener("click", () => {
    themeDropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  window.addEventListener("click", (e) => {
    if (!themeDropdown.contains(e.target)) {
      themeDropdown.classList.remove("active");
    }
  });
}

dropdownItems.forEach(item => {
  item.addEventListener("click", () => {
    const theme = item.getAttribute("data-value");
    applyTheme(theme);
    themeDropdown.classList.remove("active");
  });
});




function toggleTask(checkbox) {
  const span = checkbox.nextElementSibling;
  span.classList.toggle("completed");

  taskTracker();
}


function taskTracker() {
  const tasks = document.querySelectorAll("#taskList li");
  const completed = document.querySelectorAll("#taskList input:checked");

  const empty = document.getElementById("emptyState");
  if (empty) {
    empty.style.display = tasks.length === 0 ? "block" : "none";
  }

  const stats = document.getElementById("taskStats");
  if (stats) {
    stats.innerHTML = `<span class="material-symbols-outlined" style="vertical-align: middle; color: #10b981;">check_circle</span> ${completed.length} / ${tasks.length} completed`;
  }

  const celebration = document.getElementById("celebration");

  if (tasks.length > 0 && tasks.length === completed.length) {
    celebration.classList.remove("hidden");

    setTimeout(() => {
      celebration.classList.add("show");
    }, 100);
  } else {
    celebration.classList.remove("show");
    celebration.classList.add("hidden");
  }
}


