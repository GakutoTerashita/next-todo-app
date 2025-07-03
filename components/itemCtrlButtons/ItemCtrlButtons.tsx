import { updateTodoItem } from "@/app/actions/todo";
import useItemEditDialog from "@/hooks/useItemEditDialog";
import useTodoMutation from "@/hooks/useTodoMutation";
import React from "react";
import ItemEditDialog from "./ItemEditDialog";
import DeleteButton from "./deleteButton";
import CompleteButton from "./completeButton";
import EditButton from "./editButton";

interface Props {
    completed: boolean;
    id: string;
}

const ItemCtrlButtons = (props: Props) => {
    const { id, completed } = props;
    const {
        open: openDialog,
        handleOpen: handleDialogOpen,
        handleClose: handleDialogClose,
    } = useItemEditDialog();

    const mutEdit = useTodoMutation(updateTodoItem.bind(null, props.id), handleDialogClose);


    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <CompleteButton id={id} completed={completed} />
            <EditButton handleDialogOpen={handleDialogOpen} />
            <ItemEditDialog
                itemId={props.id}
                mutate={mutEdit.mutate}
                pending={mutEdit.isPending}
                open={openDialog}
                onClose={handleDialogClose}
            />
            <DeleteButton id={id} />
        </div>
    );
};

export default ItemCtrlButtons;