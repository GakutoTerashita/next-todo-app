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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <HeaderBar />
      <Container maxWidth="lg" sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        paddingY: 2
      }}>
        <Paper elevation={3} sx={{
          padding: 1,
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          maxHeight: 'calc(100vh - 212px)' // Adjust based on header and form below
        }}>
          <div style={{ overflowY: 'auto', flexGrow: 1 }}>
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
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <ItemRegistrationForm />
        </Paper>
      </Container>
    </div>
  );
}

export default Home;