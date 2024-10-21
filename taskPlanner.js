// TaskPlanner JS Code
document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("task-form");
    const categorySelect = document.getElementById("category");
    const taskProgress = document.getElementById("task-progress");
    const completeTaskBtn = document.getElementById("complete-task");
    const undoTaskBtn = document.getElementById("undo-task");
    const showProgressBtn = document.getElementById("show-progress");

    const TaskCategory = {
        MostImportantUrgent: 0,
        ImportantUrgent: 1,
        NotImportantUrgent: 2,
        MostImportantNotUrgent: 3,
        ImportantNotUrgent: 4,
        NotImportantNotUrgent: 5,
        TOTAL_CATEGORIES: 6
    };

    class Task {
        constructor(description, category) {
            this.description = description;
            this.category = category;
        }
    }

    class TaskPlanner {
        constructor() {
            this.taskStacks = Array(TaskCategory.TOTAL_CATEGORIES).fill().map(() => []);
            this.completedStack = [];
        }

        addTask(description, category) {
            this.taskStacks[category].push(new Task(description, category));
            this.updateProgress();
        }

        completeTask(category) {
            if (this.taskStacks[category].length > 0) {
                const completedTask = this.taskStacks[category].pop();
                this.completedStack.push(completedTask);
            } else {
                alert("No tasks in this category to complete.");
            }
            this.updateProgress();
        }

        undoCompletedTask() {
            if (this.completedStack.length > 0) {
                const undoneTask = this.completedStack.pop();
                this.taskStacks[undoneTask.category].push(undoneTask);
            } else {
                alert("No completed tasks to undo.");
            }
            this.updateProgress();
        }

        showProgress() {
            let progressHtml = "<h3>Task Progress</h3>";
            for (let i = 0; i < TaskCategory.TOTAL_CATEGORIES; i++) {
                progressHtml += `<p>${this.categoryToString(i)} - Remaining tasks: ${this.taskStacks[i].length}</p>`;
            }
            progressHtml += `<p>Total completed tasks: ${this.completedStack.length}</p>`;
            taskProgress.innerHTML = progressHtml;
        }

        categoryToString(category) {
            switch (category) {
                case TaskCategory.MostImportantUrgent: return "Most Important & Urgent";
                case TaskCategory.ImportantUrgent: return "Important & Urgent";
                case TaskCategory.NotImportantUrgent: return "Not Important but Urgent";
                case TaskCategory.MostImportantNotUrgent: return "Most Important but Not Urgent";
                case TaskCategory.ImportantNotUrgent: return "Important but Not Urgent";
                case TaskCategory.NotImportantNotUrgent: return "Not Important & Not Urgent";
                default: return "Unknown";
            }
        }

        updateProgress() {
            this.showProgress();
        }
    }

    const planner = new TaskPlanner();

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const description = document.getElementById("description").value;
        const category = categorySelect.value;
        planner.addTask(description, parseInt(category));
        taskForm.reset();
    });

    completeTaskBtn.addEventListener("click", function () {
        const category = prompt("Enter category (0-5) to complete a task:");
        if (category !== null) planner.completeTask(parseInt(category));
    });

    undoTaskBtn.addEventListener("click", function () {
        planner.undoCompletedTask();
    });

    showProgressBtn.addEventListener("click", function () {
        planner.showProgress();
    });
});
