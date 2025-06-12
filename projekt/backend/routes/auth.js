const prisma = require("../prismaClient");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email i hasło są wymagane" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Błąd przy tworzeniu użytkownika" });
  }
});

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Brak danych" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user)
    return res.status(401).json({ error: "Niepoprawne dane logowania" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid)
    return res.status(401).json({ error: "Niepoprawne dane logowania" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "12h" });
  res.json({
    token,
    userId: user.id,
    is_admin: user.is_admin,
  });
});

module.exports = router;
