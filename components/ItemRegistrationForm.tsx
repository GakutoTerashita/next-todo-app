'use client';

import { registerTodoItem } from "@/app/actions/todo";
import { Button, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const ItemRegistrationForm = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: registerTodoItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todoItems'] });
        },
        onError: (error) => {
            alert(`Error registering item: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    })

    return (
        <React.Fragment>
            <form action={mutation.mutate} style={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <TextField
                    type="text"
                    name="title"
                    label="title"
                    defaultValue=""
                    placeholder="Enter item name"
                />
                <TextField
                    type="text"
                    name="description"
                    label="description"
                    defaultValue=""
                    placeholder="Enter item description"
                    sx={{ flexGrow: 1 }}
                />
                <TextField
                    type="date"
                    name="deadline"
                    label="deadline"
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={mutation.isPending}
                    loading={mutation.isPending}
                >
                    Add Item
                </Button>
            </form>
        </React.Fragment>
    );
}

export default ItemRegistrationForm;