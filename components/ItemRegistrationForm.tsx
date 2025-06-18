'use client';

import useTodoListItemRegistration from "@/hooks/useTodoListItemRegistration";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { todo_item } from "@prisma/client";
import { Dayjs } from "dayjs";
import React, { useState } from "react";

const handleSubmit = async (
    e: React.FormEvent,
    title: string,
    description: string,
    deadline: Dayjs | null,
    register: (title: string, description: string, deadline: Dayjs | null) => Promise<todo_item>,
) => {
    e.preventDefault();

    if (!title) {
        alert("Please fill in the title");
        return;
    }

    try {
        const result = await register(title, description, deadline);
        console.log("Item registered successfully:", result);
    } catch (error) {
        console.error("Failed to register item:", error);
    }
};


const ItemRegistrationForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState<Dayjs | null>(null);

    const { loading, register, } = useTodoListItemRegistration(() => {
        setTitle("");
        setDescription("");
        setDeadline(null);
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TextField
                type="text"
                name="title"
                placeholder="Enter item name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
                type="text"
                name="description"
                placeholder="Enter item description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <DatePicker
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
            />
            <Button
                type="submit"
                loading={loading}
                onClick={
                    (e) => handleSubmit(
                        e,
                        title,
                        description,
                        deadline,
                        register,
                    )}>
                Add Item
            </Button>
        </LocalizationProvider>
    );
}

export default ItemRegistrationForm;