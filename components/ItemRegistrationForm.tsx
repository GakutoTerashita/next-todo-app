'use client';

import { registerTodoItem } from "@/app/actions";
import { Button, TextField } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

const ItemRegistrationForm = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: registerTodoItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todoItems'] });
        }
    })

    return (
        <React.Fragment>
            <form action={mutation.mutate}>
                <TextField
                    type="text"
                    name="title"
                    label="title"
                    placeholder="Enter item name"
                />
                <TextField
                    type="text"
                    name="description"
                    label="description"
                    placeholder="Enter item description"
                />
                <TextField
                    type="date"
                    name="deadline"
                    label="deadline"
                />
                <Button
                    type="submit"
                >
                    Add Item
                </Button>
            </form>
        </React.Fragment>
    );
}

export default ItemRegistrationForm;