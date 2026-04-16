const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const handleTask = (e, onTaskAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#taskName').value;


    if(!name){
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name}, onTaskAdded);
    return false;
}

const TaskForm = (props) => {
    return(
        <form id="taskForm"
        onSubmit = {(e) => handleTask(e, props.triggerReload)}
        name="taskForm"
        action="/app"
        method="POST"
        className="taskForm"
        >
        <label htmlFor="name"></label>
        <input id="taskName" type="text" name="name" placeholder="Today's Plan" />
        <input className="makeTaskSubmit" type="submit" value="Make Task" />

        </form>

    );
}

const TaskList = (props) => {
    const [tasks, setTasks] = useState(props.tasks);
    useEffect(() => {
        const loadTasksFromServer = async() => {
            const response = await fetch('/getTasks');
            const data = await response.json();
            setTasks(data.tasks);

        };
        loadTasksFromServer();
    },[props.reloadTasks]);
    
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

      
    if(tasks.length === 0){
        return (
            <div className="taskList">
                <h3 className="emptyTask">No Tasks Yet</h3>
            </div>
        )
    }

    const taskNodes = tasks.map(task => {
        return(
            <div key={task._id} className="task">
            <h3 className="taskName">{task.name}</h3>
            <button onClick={() => handleDelete(task._id)} className="deleteTask">Delete</button>
            </div>

        );
    })

    return (
        <div className="taskList">
            {taskNodes}
        </div>
    )
}

const App = () => {
    const [reloadTasks, setReloadTasks] = useState(false);

    return(
        <div>
            <div id="makeTask">
                <TaskForm triggerReload={() => setReloadTasks(!reloadTasks)} />
            </div>
            <div id="tasks">
                <TaskList tasks={[]} reloadTasks={reloadTasks} />
            </div>
        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
}

window.onload = init;