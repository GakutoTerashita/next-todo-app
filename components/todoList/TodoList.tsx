import { Divider, List } from "@mui/material";
import React from "react";
import TodoListItem from "./TodoListItem";
import { todo_item } from "@prisma/client";

interface Props {
    todoItems: todo_item[];
};

const TodoList = (props: Props) => {

    return (
        <React.Fragment>
            <List>
                {props.todoItems.map((item, index) => {
                    return (
                        <React.Fragment key={item.id}>
                            <TodoListItem item={item} />
                            {index < props.todoItems.length - 1 && <Divider component="li" sx={{ marginY: 2 }} />}
                        </React.Fragment>
                    );
                })}
            </List>
        </React.Fragment>
    );
};

export default TodoList;