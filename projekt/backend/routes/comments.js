const prisma = require("../prismaClient");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

// GET /comments?nr_tab=&order=asc|desc — czyta komentarze, opcjonalnie filtrowane po nr_tab i sortowane po created_at
router.get("/", async (req, res) => {
  const { nr_tab, order } = req.query;

  // Domyślnie sortujemy malejąco (najnowsze na górze)
  const sortOrder = order === "asc" ? "asc" : "desc";

  try {
    const comments = await prisma.comment.findMany({
      where: nr_tab ? { nr_tab } : {},
      orderBy: { created_at: sortOrder },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: "Błąd podczas pobierania komentarzy" });
  }
});

// POST /comments — dodaje komentarz
router.post("/", auth, async (req, res) => {
  const { nr_tab, context, is_positive } = req.body;

  if (!nr_tab || !context || typeof is_positive !== "boolean") {
    return res.status(400).json({ error: "Brakuje wymaganych danych" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        nr_tab,
        context,
        is_positive,
        user: { connect: { id: req.user.userId } }, // pokazują sie wszystkie dane, średnio
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Błąd podczas dodawania komentarza" });
  }
});

// PUT /comments/:id — edycja komentarza (tylko autor lub admin)
router.put("/:id", auth, async (req, res) => {
  const commentId = parseInt(req.params.id);
  const { context, is_positive } = req.body;

  if (!context || typeof is_positive !== "boolean") {
    return res.status(400).json({ error: "Brakuje wymaganych danych" });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      return res.status(404).json({ error: "Komentarz nie istnieje" });

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    if (comment.user_id !== req.user.userId && !user?.is_admin) {
      return res.status(403).json({ error: "Brak uprawnień do edycji" });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { context, is_positive },
    });

    res.json(updated);
  } catch (error) {
    console.error("Błąd przy edytowaniu komentarza:", error);
    res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
});

// DELETE /comments/:id
router.delete("/:id", auth, async (req, res) => {
  const commentId = parseInt(req.params.id);

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment)
      return res.status(404).json({ error: "Komentarz nie istnieje" });

    // Pobierz dane użytkownika (czy jest adminem)
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    // Czy to jego komentarz lub admin?
    if (comment.user_id !== req.user.userId && !user?.is_admin) {
      return res.status(403).json({ error: "Brak uprawnień do usunięcia" });
    }

    await prisma.comment.delete({ where: { id: commentId } });
    res.status(200).json({ message: "Komentarz usunięty" });
  } catch (error) {
    console.error("Błąd przy usuwaniu komentarza:", error);
    res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
});

module.exports = router;
