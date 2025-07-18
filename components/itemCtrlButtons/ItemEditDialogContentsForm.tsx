import { DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { todo_item } from "@prisma/client";
import dayjs from "dayjs";
import React from "react";

interface Props {
    pending: boolean;
    todoItem: todo_item;
    action: (formData: FormData) => void;
    onClose: () => void;
};

const ItemEditDialogContentsForm = (props: Props) => {
    const { pending, todoItem, action, onClose } = props;

    return (
        <React.Fragment>
            <DialogContent>
                <DialogContentText>
                    To edit this todo item, please enter the new details here.
                </DialogContentText>
                <form action={action} id={`edit-form-${todoItem.id}`}>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={todoItem.title}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={todoItem.description || ''}
                    />
                    <TextField
                        margin="dense"
                        name="deadline"
                        label="Deadline"
                        type="date"
                        fullWidth
                        variant="standard"
                        slotProps={{ inputLabel: { shrink: true } }}
                        defaultValue={todoItem.deadline ? dayjs(todoItem.deadline).format('YYYY-MM-DD') : ''}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    type="submit"
                    form={`edit-form-${todoItem.id}`}
                    disabled={pending}
                    loading={pending}
                >
                    Confirm
                </Button>
            </DialogActions>
        </React.Fragment>
    )
};

export default ItemEditDialogContentsForm;