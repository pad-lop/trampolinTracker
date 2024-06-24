import { Router } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db.js";

const router = Router();

// Create a user
router.post('/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a user
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const data = { username };
    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all users (optional)
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Validate user credentials
router.post('/users/validate', async (req, res) => {
	const { username, password } = req.body;
  
	try {
	  const user = await prisma.user.findUnique({
		where: { username },
	  });
  
	  if (!user) {
		return res.status(401).json({ error: 'Invalid username or password' });
	  }
  
	  const isValidPassword = await bcrypt.compare(password, user.password);
  
	  if (!isValidPassword) {
		return res.status(401).json({ error: 'Invalid username or password' });
	  }
  
	  res.status(200).json({ message: 'Validation successful' });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: 'Internal server error' });
	}
  });
  
export default router;
