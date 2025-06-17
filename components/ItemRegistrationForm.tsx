'use client';

import useTodoListItemRegistration from "@/hooks/useTodoListItemRegistration";
import { Button, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import dynamic from "next/dynamic";
import useTextField from "@/hooks/useTextField";
import useDatePicker from "@/hooks/useDatePicker";
import { Dayjs } from "dayjs";
import { todo_item } from "@prisma/client";

const DynamicDatePicker = dynamic(
    () => import("@mui/x-date-pickers/DatePicker").then((mod) => mod.DatePicker),
    { ssr: false }
);

const handleRegistrationFormSubmit = async (
    e: React.FormEvent,
    executeRegistration: (itemToRegister: Omit<todo_item, "id" | "completed">) => void,
    title: string,
    description: string,
    deadline: Dayjs | null
) => {
    e.preventDefault();

    if (!title) {
        alert("Please fill in the title");
        return;
    }

    const newItem: Omit<todo_item, "id" | "completed"> = {
        title,
        description: description || "",
        deadline: deadline?.toDate() || null,
    };
    executeRegistration(newItem);
};

const ItemRegistrationForm = () => {
    const {
        value: title,
        syncValue: syncTitleInputField,
        resetValue: resetTitleInputField,
    } = useTextField();
    const {
        value: description,
        syncValue: syncDescriptionInputField,
        resetValue: resetDescriptionInputField
    } = useTextField();
    const {
        value: deadline,
        syncValue: syncDeadlineInputField,
        resetValue: resetDeadlineInputField
    } = useDatePicker();

    const { registeredTodoItem, loading, executeRegistration } = useTodoListItemRegistration(() => {
        resetTitleInputField();
        resetDescriptionInputField();
        resetDeadlineInputField();
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={(e) => handleRegistrationFormSubmit(e, executeRegistration, title, description, deadline)}>
                <TextField
                    type="text"
                    name="title"
                    placeholder="Enter item name"
                    value={title}
                    onChange={syncTitleInputField}
                />
                <TextField
                    type="text"
                    name="description"
                    placeholder="Enter item description"
                    value={description}
                    onChange={syncDescriptionInputField}
                />
                <DynamicDatePicker
                    value={deadline}
                    onChange={syncDeadlineInputField}
                />
                <Button
                    type="submit"
                    loading={loading}
                >
                    Add Item
                </Button>
            </form>
        </LocalizationProvider>
    );
}

export default ItemRegistrationForm;