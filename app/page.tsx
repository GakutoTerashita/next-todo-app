"use client";
import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { AppBar, Container, List, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getTodoItems } from "./actions";

const Home = () => {
  const query = useQuery({ queryKey: ['todoItems'], queryFn: getTodoItems });

  return (
    <React.Fragment>
      <AppBar position="static">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, padding: 2 }}>
          Next.js Todo App
        </Typography>
      </AppBar>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ padding: 1, marginTop: 2, marginBottom: 2 }}>
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
    </React.Fragment>
  );
}

export default Home;