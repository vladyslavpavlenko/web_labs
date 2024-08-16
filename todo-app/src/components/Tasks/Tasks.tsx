import '@telegram-apps/telegram-ui/dist/styles.css';
import { Text } from '@telegram-apps/telegram-ui';
import Task from "../Task/Task";
import { Task as TaskType } from '../../types'; // Adjust the path as necessary

interface TasksProps {
    tasks: TaskType[];
    onComplete: (taskID: string) => void;
    onDelete: (taskID: string) => void;
}

function Tasks({ tasks, onComplete, onDelete }: TasksProps) {
    const totalTasksCount = tasks.length;
    const completedTasksCount = tasks.filter(task => task.isCompleted).length;

    return (
        <>
            <div style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'gray', marginBottom: '1rem' }}>
                {tasks.length === 0 ? (
                    <Text weight="3">No tasks</Text>
                ) : (
                    <>
                        <Text weight="3">Completed: </Text>
                        <Text>{completedTasksCount}/{totalTasksCount}</Text>
                    </>
                )}
            </div>
            <div>
                {tasks.map(task => (
                    <Task key={task.id} task={task} onComplete={onComplete} onDelete={onDelete}/>
                ))}
            </div>
        </>
    );
}

export default Tasks;