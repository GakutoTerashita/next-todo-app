import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { getTodoItems } from "@/lib/api/todo-items";
import { Container, Paper } from "@mui/material";
import { todo_item } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<todo_item[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const result = await getTodoItems();
        setItems(result);
      } catch (error) {
        console.error("Failed to fetch todo items:", error);
      }
    }

    fetchItems();
  }, []);

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ padding: 1, marginTop: 2, marginBottom: 2 }}>
        <TodoList items={items} />
      </Paper>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <ItemRegistrationForm />
      </Paper>
    </Container>
  );
}
