import { completeTodoItem, deleteTodoItem } from "@/app/actions";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

interface Props {
    completed: boolean;
    id: string;
}

const ItemCtrlButtons = (props: Props) => {
    const queryClient = useQueryClient();
    const mutDelete = useMutation({
        mutationFn: deleteTodoItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todoItems"] });
        },
    });
    const mutComplete = useMutation({
        mutationFn: completeTodoItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todoItems"] });
        },
    });

    return (
        <React.Fragment>
            <form action={mutComplete.mutate}>
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
                onClick={() => {
                    console.log(`Edit props.item ${props.id}`);
                }}
                sx={{ marginRight: 1 }}
            >
                Edit
            </Button>
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
        </React.Fragment>
    );
};

export default ItemCtrlButtons;