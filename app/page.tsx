import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { Container, Paper } from "@mui/material";

export default function Home() {
  const items = [
    // Example items, replace with actual data fetching logic
    {
      id: '1',
      title: "Sample Todo Item",
      description: "This is a sample todo item.",
      deadline: new Date(),
      completed: false,
    },
    {
      id: '2',
      title: "Another Todo Item",
      description: "This is another sample todo item.",
      deadline: new Date(),
      completed: true,
    },
  ];

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
