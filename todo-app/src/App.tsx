import '@telegram-apps/telegram-ui/dist/styles.css';
import { AppRoot, Placeholder } from '@telegram-apps/telegram-ui';
import Tasks from "./components/Tasks/Tasks";
import Header from "./components/Header/Header";
import { useState, useEffect } from "react";
import { Task } from "./types";
import { closestCorners, DndContext, DragEndEvent, MouseSensor, useSensor, useSensors, UniqueIdentifier } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const LOCAL_STORAGE_KEY = "todo:savedTasks";
const PORT = 8080

const ws = new WebSocket('ws://localhost:' + PORT);

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    function loadSaveTasks() {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
            try {
                const parsedTasks = JSON.parse(saved);
                if (Array.isArray(parsedTasks)) {
                    setTasks(parsedTasks);
                } else {
                    setTasks([]);
                }
            } catch (error) {
                console.error("Error parsing saved tasks:", error);
                setTasks([]);
            }
        } else {
            setTasks([]);
        }
    }

    function setTasksAndSync(newTasks: Task[]): void {
        setTasks(newTasks);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTasks));
        ws.send(JSON.stringify({ type: 'update', tasks: newTasks }));
    }

    useEffect(() => {
        loadSaveTasks();

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'update') {
                setTasks(data.tasks);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.tasks));
            }
        };
    }, []);

    function addTask(taskTitle: string): void {
        const newTask = {
            id: crypto.randomUUID(),
            title: taskTitle,
            isCompleted: false,
        };
        setTasksAndSync([newTask, ...tasks]);
    }

    function toggleTaskCompletedByID(taskID: string): void {
        const newTasks = tasks.map(task => {
            if (task.id === taskID) {
                return {
                    ...task,
                    isCompleted: !task.isCompleted,
                };
            }
            return task;
        });
        setTasksAndSync(newTasks);
    }

    function deleteTaskByID(taskID: string): void {
        const newTasks = tasks.filter(task => task.id !== taskID);
        setTasksAndSync(newTasks);
    }

    const getTaskIndex = (id: UniqueIdentifier) => tasks.findIndex(task => task.id === id as string);

    const reorderTasks = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || active.id === over.id) return;

        const originalPos = getTaskIndex(active.id);
        const newPos = getTaskIndex(over.id);

        if (originalPos !== -1 && newPos !== -1) {
            const newTasks = arrayMove(tasks, originalPos, newPos);
            setTasksAndSync(newTasks);
        }
    };

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 10,
            },
        })
    );

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
            <DndContext collisionDetection={closestCorners} onDragEnd={reorderTasks} sensors={sensors}>
                <Tasks tasks={tasks} onComplete={toggleTaskCompletedByID} onDelete={deleteTaskByID} />
            </DndContext>
        </AppRoot>
    );
}

export default App;