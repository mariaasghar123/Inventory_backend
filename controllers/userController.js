import prisma from '../prisma/client.js';

// ✅ Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// ✅ Get single user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// ✅ Create a new user
export const createUser = async (req, res) => {
  const { name, role, username, password, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, role, username, password, email },
    });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, role, username, password } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, role, username, password },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
