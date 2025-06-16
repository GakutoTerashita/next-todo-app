'use client';

import useTodoListItemRegistration from "@/hooks/useTodoListItemRegistration";
import { Button, TextField } from "@mui/material";
import React from "react";

const ItemRegistrationForm = () => {
    const {
        loading,
        register,
        setTitle,
        setDescription,
        setDeadline,
    } = useTodoListItemRegistration();

    return (
        <React.Fragment>
            <TextField type="text" name="title" placeholder="Enter item name" onChange={(e) => setTitle(e.target.value)} />
            <TextField type="text" name="description" placeholder="Enter item description" onChange={(e) => setDescription(e.target.value)} />
            <TextField type="datetime-local" name="deadline" onChange={(e) => setDeadline(new Date(e.target.value))} />
            <Button type="submit" loading={loading} onClick={register}>Add Item</Button>
        </React.Fragment>
    );
}

export default ItemRegistrationForm;