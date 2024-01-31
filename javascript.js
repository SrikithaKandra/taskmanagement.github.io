$(function() {
            $(".columns").sortable({
                connectWith: ".column",
                update: function(event, ui) {
                    // Update the task status when dragged to a different column
                    var taskId = ui.item.attr("id");
                    var newStatus = ui.item.parent().attr("id");
                    updateTaskStatus(taskId, newStatus);
                }
            }).disableSelection();
        });

        function openAddTaskModal() {
            document.getElementById("addTaskModal").style.display = "flex";
        }

        function closeAddTaskModal() {
            document.getElementById("addTaskModal").style.display = "none";
            document.getElementById("addTaskForm").reset();
        }

        function allowDrop(event) {
            event.preventDefault();
        }

        function drop(event) {
            event.preventDefault();
            var taskId = event.dataTransfer.getData("text");
            var newStatus = event.target.id;
            updateTaskStatus(taskId, newStatus);
        }

        function addTask() {
            var title = document.getElementById("taskTitle").value;
            var description = document.getElementById("taskDescription").value;

            if (title.trim() !== "") {
                var allTasksColumn = document.getElementById("allTasks");
                var taskItem = document.createElement("div");
                var taskId = "task" + Date.now(); // Unique ID for each task

                taskItem.setAttribute("id", taskId);
                taskItem.setAttribute("class", "task");
                taskItem.setAttribute("draggable", "true");
                taskItem.setAttribute("ondragstart", "drag(event)");

                taskItem.innerHTML = `
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <button onclick="completeTask('${taskId}')">Complete</button>
                    <button onclick="editTask('${taskId}')">Edit</button>
                    <button onclick="deleteTask('${taskId}')">Delete</button>
                `;

                allTasksColumn.appendChild(taskItem);
                closeAddTaskModal();
                return false; // Prevent form submission
            } else {
                alert("Please enter a task title.");
            }
        }

        function updateTaskStatus(taskId, newStatus) {
            var taskItem = document.getElementById(taskId);
            var targetColumn = document.getElementById(newStatus);

            if (taskItem && targetColumn) {
                taskItem.parentNode.removeChild(taskItem);
                targetColumn.appendChild(taskItem);
            }
        }

        function completeTask(taskId) {
            var taskItem = document.getElementById(taskId);
            var completedTasksColumn = document.getElementById("completedTasks");

            if (taskItem && completedTasksColumn) {
                taskItem.parentNode.removeChild(taskItem);
                completedTasksColumn.appendChild(taskItem);
            }
        }

        function editTask(taskId) {
            var taskItem = document.getElementById(taskId);
            var title = taskItem.querySelector("h3").innerText;
            var description = taskItem.querySelector("p").innerText;

            // Set form fields with task details for editing
            document.getElementById("taskTitle").value = title;
            document.getElementById("taskDescription").value = description;

            // Remove the task item from the list
            taskItem.parentNode.removeChild(taskItem);

            openAddTaskModal();
        }

        function deleteTask(taskId) {
            var taskItem = document.getElementById(taskId);
            if (taskItem) {
                taskItem.parentNode.removeChild(taskItem);
            }
        }

        function drag(event) {
            event.dataTransfer.setData("text", event.target.id);
        }
