function addTask() {
   const input = document.getElementById("taskInput");
   const task = input.value.trim();
   const errorMsg = document.getElementById("errorMsg");
   const categoryInput = document.getElementById("categoryInput");
   const category = categoryInput ? categoryInput.value : "";

  if (task === "") {
      errorMsg.textContent = "Please enter a task.";
      return;
   }
   errorMsg.textContent = "";

   const li = document.createElement("li");
   if (category) {
      li.setAttribute("data-category", category);
   }

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
   timeElement.textContent = ` ${day}, ${date} at ${time}`;

   // Text wrapper 
   const textWrapper = document.createElement("div");
   textWrapper.className = "task-text-wrapper";
   textWrapper.appendChild(span);
   textWrapper.appendChild(timeElement);

   // Edit button
   const editButton = document.createElement("button");
   editButton.textContent = "Edit";
   editButton.setAttribute("aria-label", "Edit task");
   editButton.setAttribute("title", "Edit task");
   editButton.addEventListener("click", function () {
      const newTask = prompt("Edit task:", span.textContent);
      if (newTask !== null && newTask.trim() !== "") {
         span.textContent = newTask.trim();
         
         // Update time on edit
         const editNow = new Date();
         const editDay = dayNames[editNow.getDay()];
         const editDate = `${editNow.getDate()} ${editNow.toLocaleString("default", { month: "long" })} ${editNow.getFullYear()}`;
         const editTime = editNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
         timeElement.textContent = ` ${editDay}, ${editDate} at ${editTime}`;
      }
   });
   
   // Remove button
   const removeButton = document.createElement("button");
   removeButton.textContent = "Remove";
   removeButton.setAttribute("title", "Remove task");
   removeButton.setAttribute("aria-label", "Remove task");
   removeButton.addEventListener("click", function () {
      li.remove();

      taskTracker();
      
   });

   li.appendChild(checkbox);
   li.appendChild(textWrapper);
   li.appendChild(editButton);
   li.appendChild(removeButton);

   document.getElementById("taskList").appendChild(li);
   
   input.value = "";
   if(input.focus) input.focus();

   taskTracker();

}

/* =========================
     MULTI-THEME SWITCHER
========================= */

const themeSwitcher = document.getElementById("themeSwitcher");

// Load saved theme
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);

if (themeSwitcher) {
   themeSwitcher.value = savedTheme;

   themeSwitcher.addEventListener("change", function (e) {
      const selectedTheme = e.target.value;

      document.documentElement.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("theme", selectedTheme);
   });
}

function toggleTask(checkbox) {
   const li = checkbox.closest("li");
   const textWrapper = checkbox.nextElementSibling;
   const span = textWrapper ? textWrapper.querySelector("span") : li.querySelector("span");

   if (span) {
      span.classList.toggle("completed");
   }

   if (li) {
      if (checkbox.checked) {
         li.classList.add("completed");
         if (span) span.setAttribute("aria-label", `${span.textContent}, completed`);
      } else {
         li.classList.remove("completed");
         if (span) span.removeAttribute("aria-label");
      }
   }

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
      stats.innerText = `✅ ${completed.length} / ${tasks.length} completed`;
   }

   const celebration = document.getElementById("celebration");

   if (celebration) {
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
}

function sortTasks(order) {
   const taskList = document.getElementById("taskList");
   const tasks = Array.from(taskList.getElementsByTagName("li"));

   tasks.sort((a, b) => {
      const textA = a.querySelector("span").textContent.toLowerCase();
      const textB = b.querySelector("span").textContent.toLowerCase();

      if (order === "asc") {
         return textA.localeCompare(textB);
      } else {
         return textB.localeCompare(textA);
      }
   });

   tasks.forEach(task => taskList.appendChild(task));
}