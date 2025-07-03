"use client";

import { deleteTodoItem } from "@/app/actions/todo";
import useTodoMutation from "@/hooks/useTodoMutation";
import { Button } from "@mui/material";

interface Props {
    id: string;
}
const DeleteButton = (props: Props) => {
    const { id } = props;
    const mutDelete = useTodoMutation(deleteTodoItem);

    return (
        <form action={mutDelete.mutate}>
            <input type="hidden" name="id" value={id} />
            <Button
                variant="outlined"
                color="error"
                type="submit"
            >
                Delete
            </Button>
        </form>
    );
};

export default DeleteButton;