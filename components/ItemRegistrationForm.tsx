'use client';

import { registerTodoItem } from "@/lib/api/todo-items";
import { Button, TextField } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import React from "react";

const ItemRegistrationForm = () => {
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [deadline, setDeadline] = React.useState<Dayjs | null>(null);

    return (
        <React.Fragment>
            <form onSubmit={async (e) => {
                e.preventDefault();

                try {
                    const result = await registerTodoItem({
                        title,
                        description,
                        deadline: deadline?.toDate() || null,
                    })
                    console.log("Item registered successfully:", result);
                    setTitle("");
                    setDescription("");
                    setDeadline(null);
                } catch (error) {
                    console.error("Failed to register item:", error);
                }

            }}>
                <TextField
                    type="text"
                    name="title"
                    label="title"
                    placeholder="Enter item name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    type="text"
                    name="description"
                    label="description"
                    placeholder="Enter item description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    type="date"
                    name="deadline"
                    label="deadline"
                    value={deadline?.format("YYYY-MM-DD") || ""}
                    onChange={(e) => setDeadline(e.target.value ? dayjs(e.target.value) : null)}
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