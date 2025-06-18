'use client';

import useTodoListItemRegistration from "@/hooks/useTodoListItemRegistration";
import useTodoListItemRegistrationForm from "@/hooks/useTodoListItemRegistrationForm";
import { Button, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";

const ItemRegistrationForm = () => {
    const {
        title,
        description,
        deadline,
        handleSubmit,
        onRegistered,
        syncTitleInputField,
        syncDeadlineInputField,
        syncDescriptionInputField,
    } = useTodoListItemRegistrationForm();

    const { loading, register } = useTodoListItemRegistration(onRegistered);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
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
            {/* <DatePicker
                value={deadline}
                onChange={syncDeadlineInputField}
            /> */}
            <Button
                type="submit"
                loading={loading}
                onClick={(e) => handleSubmit(e, register)}
            >
                Add Item
            </Button>
        </LocalizationProvider>
    );
}

export default ItemRegistrationForm;