import { completeTodoItem, uncompleteTodoItem } from "@/app/actions/todo";
import useTodoMutation from "@/hooks/useTodoMutation";
import { Button } from "@mui/material";


interface Props {
    completed: boolean;
    id: string;
}
const CompleteButton = (props: Props) => {
    const { id, completed } = props;
    const mutComplete = useTodoMutation(completeTodoItem);
    const mutUncomplete = useTodoMutation(uncompleteTodoItem);

    return (
        <form action={completed ? mutUncomplete.mutate : mutComplete.mutate}>
            <input type="hidden" name="id" value={id} />
            <Button
                variant="contained"
                color={completed ? "success" : "primary"}
                type="submit"
                sx={{ marginRight: 1 }}
            >
                {completed ? "Completed" : "Complete"}
            </Button>
        </form>
    )
};

export default CompleteButton;