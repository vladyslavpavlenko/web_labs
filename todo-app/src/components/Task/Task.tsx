import '@telegram-apps/telegram-ui/dist/styles.css';
import { Text, Checkbox, IconButton } from '@telegram-apps/telegram-ui';
import { Icon24Close } from '@telegram-apps/telegram-ui/dist/icons/24/close';
import { Task as TaskType } from '../../types';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskProps {
    task: TaskType | null;
    onComplete: (taskID: string) => void;
    onDelete: (taskID: string) => void;
}

function Task({ task, onComplete, onDelete }: TaskProps) {
    if (!task) {
        return null;
    }

    const id = task.id;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 0',
    };

    return (
        <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                    name={task.id}
                    checked={task.isCompleted}
                    onClick={(e) => {
                        if (isDragging) {
                            e.preventDefault();
                        } else {
                            e.stopPropagation();
                            onComplete(task.id);
                        }
                    }}
                />

                <Text
                    style={{
                        color: task.isCompleted ? 'gray' : 'inherit',
                        textDecoration: task.isCompleted ? 'line-through' : 'none',
                        userSelect: 'none',
                        marginLeft: '14px',
                    }}
                >
                    {task.title}
                </Text>
            </div>

            <IconButton
                mode="plain"
                size="l"
                onClick={(e) => {
                    if (!isDragging) {
                        e.stopPropagation();
                        onDelete(task.id);
                    }
                }}
            >
                <Icon24Close />
            </IconButton>
        </div>
    );
}

export default Task;