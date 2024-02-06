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
            var course = document.getElementById("courseOptions").value;
            if (title.trim() !== "") {
                var allTasksColumn = document.getElementById("allTasks");
                var taskItem = document.createElement("div");
                var taskId = "task" + Date.now(); // Unique ID for each task

                taskItem.setAttribute("id", taskId);
                taskItem.setAttribute("class", "task");
                taskItem.setAttribute("draggable", "true");
                taskItem.setAttribute("ondragstart", "drag(event)");

                taskItem.innerHTML = `
                    <h3>${title} - ${course}</h3>
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
            // Title also contains the course, which needs to be removed before updating new title.
            document.getElementById("taskTitle").value = title.substring(0, title.indexOf("-"));
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
        
        /* Used to open the course menu. */ 
        function openCourseMenu() {
            document.getElementById("courseMenu").style.display = "flex";
        }

        /* Used to close the course menu. */
        function closeCourseMenu() {
            document.getElementById("courseMenu").style.display = "none";
        }

        /* Used to open the add course window. */ 
        function openAddCourseWindow() {
            document.getElementById("addCourse").style.display = "flex";
        }

        /* Used to close the course menu. */
        function closeAddCourseWindow() {
            document.getElementById("addCourse").style.display = "none";
            document.getElementById("addCourseForm").reset();
        }
        
        /* Used to add courses. */
        function addCourse() {
            var name = document.getElementById("courseName").value;
            var description = document.getElementById("courseDescription").value;
            var courseColumn = document.getElementById("courseList");
            var courseItem = document.createElement("div");
            var courseId = name;
            // Dropdown bar for the options of courses in Add Task.
            var courseOptionsBar = document.getElementById("courseOptions");
            var option = document.createElement("option");

            // Set the course attributes and add to the course list.
            courseItem.setAttribute("id", courseId);
            courseItem.setAttribute("class", "course");
            courseItem.innerHTML = `
                <h4 style="display: inline-block;">${name}</h4>
                <p style="display: inline-block;">${description}</p>
                <button onclick="editCourse('${courseId}')" style="display: inline-block;">Edit</button>
                <button onclick="removeCourse('${courseId}')" style="display: inline-block;">Remove</button>
                `;
            courseColumn.appendChild(courseItem);

            // Also update the dropdown bar.
            option.value = name;
            option.textContent = name;
            courseOptionsBar.appendChild(option);

            closeAddCourseWindow();
            return false; // Prevent form submission
        }

        /* Used to edit courses. */
        function editCourse(courseId) {
            var course = document.getElementById(courseId);
            var name = course.querySelector("h4").innerText;
            var description = course.querySelector("p").innerText;
            var courseOptionsBar = document.getElementById("courseOptions");
            var options = courseOptionsBar.options;
            
            document.getElementById("courseName").value = name;
            document.getElementById("courseDescription").value = description;

            // Remove the task item from the list
            course.parentNode.removeChild(course);

            // Also remove the course from the add task course options.
            for (var i = 0; i < options.length; i++) {
                if (options[i].textContent === courseId) {
                    courseOptionsBar.removeChild(options[i]);
                    break;
                }
            }
            openAddCourseWindow();
        }

        function removeCourse(courseId) {
            var course = document.getElementById(courseId);
            var courseOptionsBar = document.getElementById("courseOptions");
            var options = courseOptionsBar.options;
    
            if (course) {
                course.parentNode.removeChild(course);
                // This is to make sure users cannot choose the deleted course when adding tasks.
                for (var i = 0; i < options.length; i++) {
                    if (options[i].textContent === courseId) {
                        courseOptionsBar.removeChild(options[i]);
                        break;
                    }
                }
            }
        }