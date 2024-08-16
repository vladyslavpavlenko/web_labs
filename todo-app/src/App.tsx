import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot, Placeholder } from '@telegram-apps/telegram-ui';
import Tasks from "./components/Tasks/Tasks.tsx";
import Header from "./components/Header/Header.tsx";
import {useState, useEffect} from "react";
import {Task} from "./types.ts";

const LOCAL_STORAGE_KEY = "todo:savedTasks";

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    function loadSaveTasks() {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            setTasks(JSON.parse(saved));
        }
    }

    useEffect(() => {
        loadSaveTasks();
    }, []);

    function setTasksAndSave(newTasks: Task[]): void {
        setTasks(newTasks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
    }

    function addTask(taskTitle: string): void {
        setTasksAndSave([
            ...tasks,
            {
                id: crypto.randomUUID(),
                title: taskTitle,
                isCompleted: false,
            },
        ]);
    }

    function toggleTaskCompletedByID(taskID: string): void {
        const newTasks = tasks.map(task => {
            if (task.id === taskID) {
                return {
                    ...task,
                    isCompleted: !task.isCompleted,
                }
            }

            return task;
        });
        setTasksAndSave(newTasks);
    }

    function deleteTaskByID(taskID: string): void {
        const newTasks = tasks.filter(task => task.id !== taskID);
        setTasksAndSave(newTasks);
    }

    return (
        <AppRoot style={{ minWidth: 500 }}>
            <Placeholder
                header="To Do"
                description={"Write down things you want to do"}
            >
                <img
                    alt="Sticker"
                    src="https://utyatheduck.com/assets/img/utya3.gif"
                    style={{ display: 'block', width: '144px', height: '144px' }}
                />
            </Placeholder>

            <Header onAddTask={addTask} />
            <Tasks tasks={tasks} onComplete={toggleTaskCompletedByID} onDelete={deleteTaskByID} />
        </AppRoot>
    )
}

export default App