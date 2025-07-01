"use client";
import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { Container, List, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getTodoItems } from "./actions";
import HeaderBar from "@/components/HeaderBar";

const Home = () => {
  const query = useQuery({ queryKey: ['todoItems'], queryFn: getTodoItems });

  return (
    <React.Fragment>
      <HeaderBar />
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