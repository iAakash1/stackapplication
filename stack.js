const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

class Task {
    constructor(description, deadline) {
        this.description = description;
        this.deadline = deadline;
        this.completed = false;
        this.next = null;
    }
}

class StudyPlanner {
    constructor() {
        this.top = null;
        this.completedTop = null;
    }

    isEmpty() {
        return this.top === null;
    }

    addTask(description, deadline) {
        const newTask = new Task(description, deadline);
        if (this.isEmpty()) {
            this.top = newTask;
            return;
        }

        let current = this.top;
        let previous = null;

        while (current && current.deadline < deadline) {
            previous = current;
            current = current.next;
        }

        if (previous === null) {
            newTask.next = this.top;
            this.top = newTask;
        } else {
            newTask.next = current;
            previous.next = newTask;
        }
    }

    displayStack() {
        const tasks = [];
        let temp = this.top;
        while (temp) {
            tasks.push({ description: temp.description, deadline: temp.deadline });
            temp = temp.next;
        }
        return tasks;
    }

    completeTask(taskDescription) {
        let temp = this.top;
        let prev = null;

        while (temp) {
            if (temp.description === taskDescription) {
                const completedTask = new Task(temp.description, temp.deadline);
                completedTask.completed = true;

                if (this.completedTop === null) {
                    this.completedTop = completedTask;
                } else {
                    completedTask.next = this.completedTop;
                    this.completedTop = completedTask;
                }

                if (prev) {
                    prev.next = temp.next;
                } else {
                    this.top = temp.next;
                }

                return temp.description;
            }
            prev = temp;
            temp = temp.next;
        }
        return null; // Task not found
    }

    progress() {
        const completed = [];
        let temp = this.completedTop;
        while (temp) {
            completed.push(temp.description);
            temp = temp.next;
        }
        return {
            completed,
            pending: this.displayStack(),
        };
    }

    deleteTask(description) {
        let temp = this.top;
        let prev = null;

        while (temp) {
            if (temp.description === description) {
                if (prev) {
                    prev.next = temp.next;
                } else {
                    this.top = temp.next;
                }
                return true;
            }
            prev = temp;
            temp = temp.next;
        }
        return false; // Task not found
    }

    clear() {
        this.top = null;
    }
}

const planner = new StudyPlanner();

app.post('/tasks', (req, res) => {
    const { description, deadline } = req.body;
    planner.addTask(description, deadline);
    res.send({ message: 'Task added successfully' });
});

app.get('/tasks', (req, res) => {
    const tasks = planner.displayStack();
    res.send(tasks);
});

app.post('/complete', (req, res) => {
    const { description } = req.body;
    const completedTask = planner.completeTask(description);
    if (completedTask) {
        res.send({ message: `Task completed: ${completedTask}` });
    } else {
        res.status(404).send({ message: 'Task not found' });
    }
});

app.get('/progress', (req, res) => {
    const progress = planner.progress();
    res.send(progress);
});

app.delete('/tasks/:description', (req, res) => {
    const { description } = req.params;
    const success = planner.deleteTask(description);
    if (success) {
        res.send({ message: 'Task deleted successfully' });
    } else {
        res.status(404).send({ message: 'Task not found' });
    }
});

app.delete('/tasks', (req, res) => {
    planner.clear();
    res.send({ message: 'All tasks cleared!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
