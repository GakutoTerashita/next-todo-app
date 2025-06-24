'use client';

import { registerTodoItem } from "@/app/actions";
import { Button, TextField } from "@mui/material";
import React, { useActionState } from "react";

const ItemRegistrationForm = () => {
    return (
        <React.Fragment>
            <form action={registerTodoItem}>
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