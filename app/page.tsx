import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { Container, Paper } from "@mui/material";
import { fetchAllTodoItems } from "./actions/actions";

const Home = async () => {
  try {
    const result = await fetchAllTodoItems();

    return (
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ padding: 1, marginTop: 2, marginBottom: 2 }}>
          <TodoList items={result} />
        </Paper>
        <Paper elevation={3} sx={{ padding: 2 }}>
          <ItemRegistrationForm />
        </Paper>
      </Container>
    );
  } catch (error) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <h2>Error fetching todo items</h2>
          <p>Please try again later.</p>
        </Paper>
      </Container>
    );
  }
}

export default Home;