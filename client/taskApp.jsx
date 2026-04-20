const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const PomodoroTimer = require('./PomodoroTimer.jsx');

const handleTask = (e, onTaskAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#taskName').value;
    const pomodoroTrigger = e.target.querySelector('#pomodoroTrigger').checked;
    console.log(pomodoroTrigger);
    if (!name) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, { name, pomodoroTrigger }, onTaskAdded);
    return false;
}

const TaskForm = (props) => {
    return (
        <form id="taskForm"
            onSubmit={(e) => handleTask(e, props.triggerReload)}
            name="taskForm"
            action="/app"
            method="POST"
            className="taskForm"
        >
            <label htmlFor="name"></label>
            <input id="taskName" type="text" name="name" placeholder="Today's Plan" />
            <div>
                <label>
                    <input type="checkbox" id="pomodoroTrigger" name="pomodoroTrigger" />
                    Enable Pomodoro
                </label>
            </div>
            <input className="makeTaskSubmit" type="submit" value="Make Task" />

        </form>

    );
}

const TaskList = ({ props }) => {
    const [tasks, setTasks] = useState(props.tasks);

    useEffect(() => {
        const loadTasksFromServer = async () => {
            const response = await fetch('/getTasks');
            const data = await response.json();
            setTasks(data.tasks);
        };
        loadTasksFromServer();
    }, [props.reloadTasks]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/deleteTask/${id}`, { method: 'DELETE' });
            if (response.ok) {
                setTasks(currentTasks => currentTasks.filter(task => task._id !== id));
            } else {
                const errData = await response.json();
                helper.handleError(errData.error);
            }
        } catch {
            helper.handleError('Network error');
        }
    };

    if (tasks.length === 0) {
        return (
            <div className="taskList">
                <h3 className="emptyTask">No Tasks Yet</h3>
            </div>
        );
    }

    const taskNodes = tasks.map(task => (
        <div key={task._id} className="task">
            <h3 className="taskName">{task.name}</h3>
            <div className="buttonControl">
                <button onClick={() => handleDelete(task._id)} className="deleteTask">Delete</button>
                {task.pomodoroTrigger && (
                    <button onClick={() => props.onStartPomodoro(task._id)}>Start Pomodoro</button>

                )} </div>
        </div>
    ));

    return <div id="tasks">{taskNodes}</div>;
};

const App = () => {
    const [reloadTasks, setReloadTasks] = useState(false);
    const [activeTimerTaskId, setActiveTimerTaskId] = useState(null);   // 新增

    return (
        <div className="taskPanel">
            <div id="makeTask">
                <TaskForm triggerReload={() => setReloadTasks(!reloadTasks)} />
            </div>
         
                <TaskList props={{ tasks: [], reloadTasks: reloadTasks, onStartPomodoro: setActiveTimerTaskId }} />

            {activeTimerTaskId && (
                <div className="pomodoro-wrapper">
                    <PomodoroTimer
                        taskId={activeTimerTaskId}
                        onComplete={() => {
                            setActiveTimerTaskId(null);
                        }}
                    />
                </div>
            )}
        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;