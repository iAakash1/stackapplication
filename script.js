const addTaskButton = document.getElementById('addTask');
const taskList = document.getElementById('taskList');

addTaskButton.addEventListener('click', async () => {
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;

    const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description, deadline }),
    });

    if (response.ok) {
        document.getElementById('description').value = '';
        document.getElementById('deadline').value = '';
        loadTasks();
    }
});

const loadTasks = async () => {
    const response = await fetch('http://localhost:3000/tasks');
    const tasks = await response.json();
    displayTasks(tasks);
};

const displayTasks = (tasks) => {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.classList.add('task');
        taskDiv.textContent = `${task.description} - ${task.deadline}`;
        taskList.appendChild(taskDiv);
    });
};

window.onload = loadTasks;
