"use client";
import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { Container, Divider, List, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getTodoItems } from "./actions";

const Home = () => {
  const query = useQuery({ queryKey: ['todoItems'], queryFn: getTodoItems });

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 1, marginTop: 2, marginBottom: 2 }}>
        <div style={{ padding: '0 12px' }}>
          <h2>Todo List</h2>
        </div>
        <Divider />
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
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
            <TodoList todoItems={query.data} />
          )}
        </div>
      </Paper>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <ItemRegistrationForm />
      </Paper>
    </Container>
  );
}

export default Home;