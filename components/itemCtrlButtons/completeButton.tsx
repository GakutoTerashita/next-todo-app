import { completeTodoItem, uncompleteTodoItem } from "@/app/actions/todo";
import useTodoItemMutation from "@/hooks/useTodoItemMutation";
import { Button } from "@mui/material";


interface Props {
    completed: boolean;
    id: string;
}
const CompleteButton = (props: Props) => {
    const { id, completed } = props;
    const mutComplete = useTodoItemMutation(completeTodoItem);
    const mutUncomplete = useTodoItemMutation(uncompleteTodoItem);

    return (
        <form action={completed ? mutUncomplete.mutate : mutComplete.mutate}>
            <input type="hidden" name="id" value={id} />
            <Button
                variant="contained"
                color={completed ? "success" : "primary"}
                type="submit"
                sx={{ marginRight: 1 }}
                disabled={mutComplete.isPending || mutUncomplete.isPending}
                loading={mutComplete.isPending || mutUncomplete.isPending}
            >
                {completed ? "Completed" : "Complete"}
            </Button>
        </form>
    )
};

export default CompleteButton;