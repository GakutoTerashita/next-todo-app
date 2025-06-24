import { Divider, List } from "@mui/material";
import React from "react";
import TodoListItem from "./TodoListItem";
import { useQuery } from "@tanstack/react-query";
import { getTodoItems } from "@/app/actions";

const TodoList = () => {
    const query = useQuery({ queryKey: ['todoItems'], queryFn: getTodoItems });

    return (
        <React.Fragment>
            {query.isLoading && (
                <List>
                    <h3>Loading items...</h3>
                </List>
            )}

            {query.isError && (
                <List>
                    <h3>Error loading items</h3>
                </List>
            )}

            {query.isSuccess && (
                <List>
                    {query.data.map((item, index) => {
                        return (
                            <React.Fragment key={item.id}>
                                <TodoListItem item={item} />
                                {index < query.data.length - 1 && <Divider component="li" sx={{ marginY: 2 }} />}
                            </React.Fragment>
                        );
                    })}
                </List>
            )}
        </React.Fragment>
    );
};

export default TodoList;