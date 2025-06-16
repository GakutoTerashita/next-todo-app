'use client';

import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import useTodoListItemList from "@/hooks/useTodoListItemList";
import { Container, Paper } from "@mui/material";

export default function Home() {
  const { todoListItems } = useTodoListItemList();

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 1, marginTop: 2, marginBottom: 2 }}>
        <TodoList items={todoListItems} />
      </Paper>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <ItemRegistrationForm />
      </Paper>
    </Container>
  );
}
