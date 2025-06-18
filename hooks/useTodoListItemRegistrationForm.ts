import { todo_item } from "@prisma/client";
import { Dayjs } from "dayjs";
import React, { useState } from "react";

const useTodoListItemRegistrationForm = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState<Dayjs | null>(null);

    const handleSubmit = async (
        e: React.FormEvent,
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

    const onRegistered = () => {
        setTitle("");
        setDescription("");
        setDeadline(null);
    };

    const syncTitleInputField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const syncDescriptionInputField = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };
    const syncDeadlineInputField = (newValue: Dayjs | null) => {
        setDeadline(newValue);
    };

    return {
        title,
        description,
        deadline,
        handleSubmit,
        onRegistered,
        syncTitleInputField,
        syncDescriptionInputField,
        syncDeadlineInputField,
    }
};

export default useTodoListItemRegistrationForm;
