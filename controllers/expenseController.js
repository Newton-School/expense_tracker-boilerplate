const Expense = require('../models/expenseModel');

exports.addExpense = async (req, res) => {
  try {
    const { amount, category, description } = req.body;

    const userId = req.user.userId;

    const newExpense = await Expense.create({
      amount,
      category,
      description,
      user: userId,
    });

    res
      .status(201)
      .json({ message: 'Expense added successfully', expense: newExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.viewExpenses = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Retrieve all expenses associated with the authenticated user
    const expenses = await Expense.find({ user: userId });

    res.json({ message: 'View expenses', expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update Expense
exports.updateExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenseId = req.params.expenseId;
    const { amount, category, description } = req.body;

    // Check if the expense belongs to the authenticated user
    const expense = await Expense.findOne({ _id: expenseId, user: userId });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Update expense details
    expense.amount = amount;
    expense.category = category;
    expense.description = description;

    await expense.save();

    res.json({ message: 'Expense updated successfully', expense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    const userId = req.user.userId;
    const expenseId = req.params.expenseId;

    // Check if the expense belongs to the authenticated user
    const expense = await Expense.findOne({ _id: expenseId, user: userId });
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Remove the expense
    await expense.remove();

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
