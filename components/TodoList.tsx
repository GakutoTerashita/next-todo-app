'use client';

import { Button, Divider, List, ListItem, Stack } from "@mui/material";
import { todo_item } from "@prisma/client";
import React from "react";
import TodoListItem from "./TodoListItem";

interface Props {
    items: todo_item[];
}

const TodoList = (props: Props) => {
    return (
        <List>
            {props.items.map((item, index) => (
                <React.Fragment key={item.id}>
                    <TodoListItem item={item} />
                    {index < props.items.length - 1 && <Divider component="li" sx={{ marginY: 2 }} />}
                </React.Fragment>
            ))}
        </List>
    )
};

export default TodoList;