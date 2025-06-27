"use client";
import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { Container, Divider, Paper } from "@mui/material";
import React from "react";

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 1, marginTop: 2, marginBottom: 2 }}>
        <div style={{ padding: '0 12px' }}>
          <h2>Todo List</h2>
        </div>
        <Divider />
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
          <TodoList />
        </div>
      </Paper>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <ItemRegistrationForm />
      </Paper>
    </Container>
  );
}

export default Home;