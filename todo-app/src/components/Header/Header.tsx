import '@telegram-apps/telegram-ui/dist/styles.css';
import { Input, Button } from '@telegram-apps/telegram-ui';
import { Icon28AddCircle } from '@telegram-apps/telegram-ui/dist/icons/28/add_circle';
import { useState, ChangeEvent, FormEvent } from "react";

interface HeaderProps {
    onAddTask: (taskTitle: string) => void;
}

function Header({ onAddTask }: HeaderProps) {
    const [title, setTitle] = useState<string>('');

    function onChangeTitle(event: ChangeEvent<HTMLInputElement>): void {
        setTitle(event.target.value);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();
        if (title.trim() === '') {
            return;
        }
        onAddTask(title);
        setTitle('');
    }

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ flexGrow: 2 }}>
                <Input
                    header="To Do"
                    placeholder="What are you up to?"
                    value={title}
                    onChange={onChangeTitle}
                />
            </div>

            <Button
                type="submit"
                before={<Icon28AddCircle />}
                size="l"
            >
                Add
            </Button>
        </form>
    );
}

export default Header;