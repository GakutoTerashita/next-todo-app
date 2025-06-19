import { ListItem, Stack, Button, Divider } from "@mui/material";
import { todo_item } from "@prisma/client";
import React from "react";
import ItemCtrlButtons from "./ItemCtrlButtons";

interface Props {
    item: todo_item;
}

const TodoListItem = (props: Props) => (
    <ListItem key={props.item.id}>
        <Stack direction="row" sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3>{props.item.title}</h3>
                <p>{props.item.description}</p>
            </div>
            <div>
                <p>{
                    props.item.deadline
                        ?
                        `Deadline: ${props.item.deadline.toISOString()}`
                        :
                        ""
                }</p>
                <ItemCtrlButtons completed={props.item.completed} id={props.item.id} />
            </div>
        </Stack>
    </ListItem>
);

export default TodoListItem;