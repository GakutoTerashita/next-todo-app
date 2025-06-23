"use client";
import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { Container, Paper } from "@mui/material";
import React from "react";

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 1, marginTop: 2, marginBottom: 2 }}>
        <TodoList />
      </Paper>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <ItemRegistrationForm />
      </Paper>
    </Container>
  );
}

export default Home;