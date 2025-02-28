import { useState, useEffect } from "react";
import { supabase } from "../supabase"; // Updated import
import {
  CircularProgress,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const ExpensesList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        console.error("Error fetching user:", userError);
        setLoading(false);
        return;
      }

      const userId = userData.user.id; // Get the logged-in user's ID

      const { data, error } = await supabase
        .from("transactions") // Fetch from transactions table
        .select("id, merchantName, amount, transactiontime, categories(name)") // Join categories table
        .eq("userid", userId) // Filter by logged-in user
        .order("transactiontime", { ascending: false });

      if (error) {
        console.error("Error fetching expenses:", error);
      } else {
        setExpenses(data || []);
      }
      setLoading(false);
    };

    fetchExpenses();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Expenses
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : expenses.length === 0 ? (
        <Typography>No expenses found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Merchant</strong></TableCell>
                <TableCell><strong>Amount (₹)</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>{expense.merchantName}</TableCell>
                  <TableCell>₹{expense.amount}</TableCell>
                  <TableCell>{expense.categories?.name || "Uncategorized"}</TableCell>
                  <TableCell>{new Date(expense.transactiontime).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default ExpensesList;
