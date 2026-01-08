const express = require("express");
const router = express.Router();
const db = require("../config/database");

// Halaman Utama - List Menfess
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM menfess ORDER BY created_at DESC"
    );
    res.render("index", { messages: rows });
  } catch (err) {
    console.error(err);
    res.render("index", { messages: [], error: "Database connection failed!" });
  }
});

// Halaman Create Menfess
router.get("/create", (req, res) => {
  res.render("create");
});

// Handle Form Submission
router.post("/send", async (req, res) => {
  const { sender, content, color } = req.body;
  if (!sender || !content) return res.redirect("/create");

  try {
    await db.query(
      "INSERT INTO menfess (sender, content, color) VALUES (?, ?, ?)",
      [sender, content, color]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.redirect("/create");
  }
});

/** * TUGAS 1.2: BACKEND LOGIC 
 */

// Route untuk Like (POST /like/:id) [cite: 197]
router.post('/like/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Cari pesan berdasarkan ID, lalu tambahkan nilai kolom likes sebanyak +1 [cite: 197]
        await db.query('UPDATE menfess SET likes = likes + 1 WHERE id = ?', [id]);
        // Redirect: Kembali ke halaman utama (/) [cite: 200]
        res.redirect('/'); 
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// Route untuk Dislike (POST /dislike/:id) [cite: 198]
router.post('/dislike/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Cari pesan berdasarkan ID, lalu tambahkan nilai kolom dislikes sebanyak +1 [cite: 198]
        await db.query('UPDATE menfess SET dislikes = dislikes + 1 WHERE id = ?', [id]);
        // Redirect: Kembali ke halaman utama (/) [cite: 200]
        res.redirect('/'); 
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

module.exports = router;