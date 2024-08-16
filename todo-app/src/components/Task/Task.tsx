import '@telegram-apps/telegram-ui/dist/styles.css';
import { Cell, Checkbox, IconButton } from '@telegram-apps/telegram-ui';
import { Icon24Close } from '@telegram-apps/telegram-ui/dist/icons/24/close';
import { Task as TaskType } from '../../types';

interface TaskProps {
    task: TaskType | null;
    onComplete: (taskID: string) => void;
    onDelete: (taskID: string) => void;
}

function Task({ task, onComplete, onDelete }: TaskProps) {
    if (!task) {
        return null;
    }

    return (
        <Cell
            Component="label"
            before={
                <Checkbox
                    name="checkbox"
                    value="1"
                    checked={task.isCompleted}
                    onClick={() => onComplete(task.id)}
                />
            }
            multiline
            after={
                <IconButton
                    mode="plain"
                    size="l"
                    onClick={() => onDelete(task.id)}
                >
                    <Icon24Close />
                </IconButton>
            }
        >
            <span
                style={{
                    color: task.isCompleted ? 'gray' : 'inherit',
                    textDecoration: task.isCompleted ? 'line-through' : 'none',
                }}
            >
                {task.title}
            </span>
        </Cell>
    );
}

export default Task;