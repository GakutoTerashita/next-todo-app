"use client";
import { getTodoItemById } from '@/app/actions/todo';
import { Dialog, DialogTitle } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import ItemEditDialogContentsForm from './ItemEditDialogContentsForm';

interface Props {
    itemId: string;
    mutate: (formData: FormData) => void;
    pending: boolean;
    open: boolean;
    onClose: () => void;
};

const ItemEditDialog = ({
    itemId,
    mutate,
    pending,
    open,
    onClose,
}: Props) => {
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
                    pending={pending}
                    todoItem={data}
                    action={mutate}
                    onClose={onClose}
                />
            )}
        </Dialog>
    );
};

export default ItemEditDialog;