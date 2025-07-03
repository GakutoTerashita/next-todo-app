import { Button } from "@mui/material";

interface Props {
    handleDialogOpen: () => void;
}
const EditButton = (props: Props) => {
    const { handleDialogOpen } = props;
    return (
        <Button
            variant="outlined"
            color="secondary"
            onClick={handleDialogOpen}
            sx={{ marginRight: 1 }}
        >
            Edit
        </Button>
    );
}

export default EditButton;