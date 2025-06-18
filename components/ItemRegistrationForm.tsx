'use client';

import { Button, TextField } from "@mui/material";
import React from "react";

const ItemRegistrationForm = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [deadline, setDeadline] = React.useState<Date | null>(null);

    return (
        <React.Fragment>
            <form onSubmit={async (e) => {
                e.preventDefault();
                // TODO
            }}>
                <TextField
                    type="text"
                    name="title"
                    placeholder="Enter item name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
                <TextField
                    type="text"
                    name="description"
                    placeholder="Enter item description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
                <TextField
                    type="datetime-local"
                    name="deadline"
                    value={deadline || ""}
                    onChange={(e) => setDeadline(new Date(e.target.value))} />
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