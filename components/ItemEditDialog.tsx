"use client";
import { getTodoItemById } from '@/app/actions';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import React from 'react';

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
            <DialogContent>
                {isPending && <p>Loading...</p>}

                {isError && <p>Error: {error.message}</p>}

                {data && (
                    <>
                        <DialogContentText>
                            To edit this todo item, please enter the new details here.
                        </DialogContentText>
                        <form action={mutate} id={`edit-form-${itemId}`}>
                            <input type="hidden" name="id" value={itemId} />
                            <TextField
                                autoFocus
                                margin="dense"
                                name="title"
                                label="Title"
                                type="text"
                                fullWidth
                                variant="standard"
                                defaultValue={data.title}
                            />
                            <TextField
                                margin="dense"
                                name="description"
                                label="Description"
                                type="text"
                                fullWidth
                                variant="standard"
                                defaultValue={data.description || ''}
                            />
                            <TextField
                                margin="dense"
                                name="deadline"
                                label="Deadline"
                                type="date"
                                fullWidth
                                variant="standard"
                                slotProps={{ inputLabel: { shrink: true } }}
                                defaultValue={data.deadline ? dayjs(data.deadline).format('YYYY-MM-DD') : ''}
                            />
                        </form>
                    </>
                )}
            </DialogContent>
            <DialogActions>
                {!isPending && !isError && (
                    <>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" form={`edit-form-${itemId}`}>Confirm</Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ItemEditDialog;