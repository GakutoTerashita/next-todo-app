"use client";
import { getTodoItemById } from '@/app/actions';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React from 'react';
import ItemEditDialogContentsForm from './ItemEditDialogContentsForm';

const ItemEditDialog = ({
    itemId,
    mutate,
    open,
    onClose,
}: {
    itemId: string;
    mutate: (formData: FormData) => void;
    open: boolean;
    onClose: () => void;
}) => {
    const { data, isPending, isError, error } = useQuery({
        queryKey: ['unique-todo-item', itemId],
        queryFn: () => getTodoItemById(itemId),
        enabled: open,
    });

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit TodoItem</DialogTitle>
            {isPending && <p>Loading...</p>}

            {isError && <p>Error: {error.message}</p>}

            {data && (
                <ItemEditDialogContentsForm
                    todoItem={data}
                    submitAction={mutate}
                    onClose={onClose}
                />
            )}
        </Dialog>
    );
};

export default ItemEditDialog;