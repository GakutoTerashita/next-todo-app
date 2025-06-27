"use client";
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@mui/material';
import React from 'react';

const ItemEditDialog = ({
    itemId,
    mutate,
    open,
    handleClose,
}: {
    itemId: string;
    mutate: (formData: FormData) => void;
    open: boolean;
    handleClose: () => void;
}) => {

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit TodoItem</DialogTitle>
            <DialogContent>
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
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="deadline"
                        label="Deadline"
                        type="date"
                        fullWidth
                        variant="standard"
                        slotProps={{ inputLabel: { shrink: true } }}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" form={`edit-form-${itemId}`}>Confirm</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ItemEditDialog;