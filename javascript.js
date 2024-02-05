var tasks = [];

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

        function openAddTaskModal(dateText) {
        
            // Display the modal
            $("#addTaskModal").css("display", "flex");
        
            // Format the date to "YYYY-MM-DD"
            const formattedDate = $.datepicker.formatDate("yy-mm-dd", new Date(dateText));
        
            // Set the value of the task date field with the formatted date
            $("#selectedDate").val(formattedDate);
        
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
            var selectedDate = document.getElementById("selectedDate").value;
            var priority = document.getElementById("taskPriority").value;
        
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
                    <p><strong>Priority:</strong> ${priority}</p>
                    <p><strong>Deadline:</strong> ${selectedDate}</p>
                    <button onclick="completeTask('${taskId}')">Complete</button>
                    <button onclick="editTask('${taskId}')">Edit</button>
                    <button onclick="deleteTask('${taskId}')">Delete</button>
                `;
        
                allTasksColumn.appendChild(taskItem);
                closeAddTaskModal();
        
                // // Add the task information to the global tasks array
                // tasks.push({
                //     title: title,
                //     deadline: selectedDate
                // });
        
                // // Update the calendar
                // updateCalendar();
        
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

                if (newStatus === "calendar") {
                    // Get the date from the task
                    var taskDate = taskItem.querySelector("p:nth-child(3)").innerText;
        
                    // Find the date cell on the calendar and append the task title
                    $(".ui-datepicker-calendar td a:contains(" + taskDate + ")").parent().append('<div class="calendar-task">' + taskTitle + '</div>');
                    showCalendar();
                }
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

        function showCalendar() {
            // Show a larger calendar initially
            $("#calendarSection").css({
                "display": "flex",
                "flex-direction": "column",
                "align-items": "center",
                "justify-content": "center"
            });
        
            // Add a close button to the calendar section
            $("#calendarSection").html(`
                <button onclick="closeCalendar()" class="close-calendar-button">Close</button>
                <div id="calendar" class="calendar"></div>
            `);
        
            $("#calendar").datepicker({
                onSelect: function (dateText) {
                
                    // Open the add task modal when a date is selected
                    openAddTaskModal(dateText);

        
                    // Hide the calendar after selecting a date
                    closeCalendar();
                }
            });
        
            // Highlight the current date
            var currentDate = new Date();
            var day = currentDate.getDate();
            $(".ui-datepicker-calendar td a:contains(" + day + ")").parent().addClass("highlight");
           
            console.log("Tasks:", tasks);
            tasks.forEach(function (task) {
                var taskDate = task.deadline;
        
                console.log("Task Date:", taskDate);
        
                // Find the date cell on the calendar and append the task title
                var matchingDateCell = $(".ui-datepicker-calendar td a:contains(" + taskDate + ")").parent();
        
                if (matchingDateCell.length > 0) {
                    matchingDateCell.append('<div class="calendar-task">' + task.title + '</div>');
                } else {
                    console.warn("No matching date cell found for task:", task);
                }
            });
        }
        
        function closeCalendar() {
            $("#calendarSection").hide();
        }