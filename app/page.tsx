"use client";
import ItemRegistrationForm from "@/components/ItemRegistrationForm";
import TodoList from "@/components/TodoList";
import { Container, List, Paper, styled } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getTodoItems } from "./actions";
import HeaderBar from "@/components/HeaderBar";

const MyDiv = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
});

const StyledContainer = styled(Container)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  paddingY: 2,
});

const StyledPaper = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  overflow: 'hidden',
  maxHeight: 'calc(100vh - 212px)', // Adjust based on header
  padding: 1,
  marginTop: 16,
});

const Home = () => {
  const query = useQuery({ queryKey: ['todoItems'], queryFn: getTodoItems });

  return (
    <MyDiv>
      <HeaderBar />
      <StyledContainer maxWidth="lg">
        <StyledPaper elevation={3}>
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
        </StyledPaper>
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <ItemRegistrationForm />
        </Paper>
      </StyledContainer>
    </MyDiv>
  );
}

export default Home;