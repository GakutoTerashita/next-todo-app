import { completeTodoItem, deleteTodoItem, uncompleteTodoItem, updateTodoItem } from "@/app/actions/todo";
import useItemEditDialog from "@/hooks/useItemEditDialog";
import useTodoMutation from "@/hooks/useTodoMutation";
import { Button } from "@mui/material";
import React from "react";
import ItemEditDialog from "../ItemEditDialog";

interface Props {
    completed: boolean;
    id: string;
}

const ItemCtrlButtons = (props: Props) => {
    const {
        open: editDialogOpen,
        handleOpen,
        handleClose
    } = useItemEditDialog();

    const mutDelete = useTodoMutation(deleteTodoItem);
    const mutEdit = useTodoMutation(updateTodoItem.bind(null, props.id), handleClose);
    const mutComplete = useTodoMutation(completeTodoItem);
    const mutUncomplete = useTodoMutation(uncompleteTodoItem);

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <form action={props.completed ? mutUncomplete.mutate : mutComplete.mutate}>
                <input type="hidden" name="id" value={props.id} />
                <Button
                    variant="contained"
                    color={props.completed ? "success" : "primary"}
                    type="submit"
                    sx={{ marginRight: 1 }}
                >
                    {props.completed ? "Completed" : "Complete"}
                </Button>
            </form>
            <Button
                variant="outlined"
                color="secondary"
                onClick={handleOpen}
                sx={{ marginRight: 1 }}
            >
                Edit
            </Button>
            <ItemEditDialog
                itemId={props.id}
                mutate={mutEdit.mutate}
                pending={mutEdit.isPending}
                open={editDialogOpen}
                onClose={handleClose}
            />
            <form action={mutDelete.mutate}>
                <input type="hidden" name="id" value={props.id} />
                <Button
                    variant="outlined"
                    color="error"
                    type="submit"
                >
                    Delete
                </Button>
            </form>
        </div>
    );
};

export default ItemCtrlButtons;