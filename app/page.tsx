"use client";
import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { Container, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getTodoItems } from "@/lib/api/todo-items";
import React from "react";

const Home = () => {
  const query = useQuery({ queryKey: ['todoItems'], queryFn: getTodoItems });

  return (
    <React.Fragment>
      {query.isLoading && (
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <h2>Loading todo items...</h2>
          </Paper>
        </Container>
      )}

      {query.isError && (
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <h2>Error fetching todo items</h2>
            <p>Please try again later.</p>
          </Paper>
        </Container>
      )}

      {query.isSuccess && (
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ padding: 1, marginTop: 2, marginBottom: 2 }}>
            <TodoList items={query.data || []} />
          </Paper>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <ItemRegistrationForm />
          </Paper>
        </Container>
      )}
    </React.Fragment>
  );
}

export default Home;