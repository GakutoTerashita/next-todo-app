import { useState } from "react";

const useItemEditDialog = () => {
    const [open, setOpen] = useState(false);
    const handleDialogOpen = () => {
        setOpen(true);
    };
    const handleDialogClose = () => {
        setOpen(false);
    };

    return {
        isDialogOpened: open,
        handleDialogOpen,
        handleDialogClose
    };
};

export default useItemEditDialog;