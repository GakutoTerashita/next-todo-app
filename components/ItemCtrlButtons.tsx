import { Button } from "@mui/material";
import React from "react";

interface Props {
    completed: boolean;
    id: string;
}

const ItemCtrlButtons = (props: Props) => (
    <React.Fragment>
        <Button
            variant="contained"
            color={props.completed ? "success" : "primary"}
            onClick={() => {
                console.log(`Toggle completion for props.item ${props.id}`);
            }}
            sx={{ marginRight: 1 }}
        >
            {props.completed ? "Completed" : "Complete"}
        </Button>
        <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
                console.log(`Edit props.item ${props.id}`);
            }}
            sx={{ marginRight: 1 }}
        >
            Edit
        </Button>
        <Button
            variant="outlined"
            color="error"
            onClick={() => {
                console.log(`Delete props.item ${props.id}`);
            }}
        >
            Delete
        </Button>
    </React.Fragment>
);

export default ItemCtrlButtons;