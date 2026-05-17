import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sql } from './api/_db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==================== Helper: Check Admin ====================
async function checkAdmin(req) {
  // const userId = req.headers['x-user-id'];
  // if (!userId) return false;

  // const result = await sql`SELECT role FROM users WHERE id = ${userId}`;
  // return result[0]?.role === 'admin';
   return true;
}

// ==================== PUBLIC ROUTES ====================

// Auth
app.post('/api/auth', async (req, res) => {
  try {
    const { action, email, password, full_name } = req.body;

    if (action === 'login') {
      const users = await sql`SELECT * FROM users WHERE email = ${email}`;
      const user = users[0];
      if (!user || user.password !== password) {
        return res.status(401).json({ error: 'البريد أو كلمة المرور غير صحيحة' });
      }
      return res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
    }

    if (action === 'signup') {
      const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existing.length > 0) return res.status(400).json({ error: 'هذا البريد مسجل مسبقاً' });

      const id = 'user-' + Date.now();
      const [newUser] = await sql`
        INSERT INTO users (id, email, password, full_name, role)
        VALUES (${id}, ${email}, ${password}, ${full_name || ''}, 'user')
        RETURNING *
      `;
      return res.status(201).json({ user: { id: newUser.id, email: newUser.email, full_name: newUser.full_name, role: newUser.role } });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Posts
app.get('/api/posts', async (req, res) => {
  const posts = await sql`SELECT * FROM posts WHERE published = true ORDER BY created_at DESC`;
  res.json(posts);
});

// Questions
app.get('/api/questions', async (req, res) => {
  const questions = await sql`SELECT * FROM questions ORDER BY created_at DESC`;
  res.json(questions);
});

app.post('/api/questions', async (req, res) => {
  const { user_id, user_name, title, content } = req.body;
  const [q] = await sql`
    INSERT INTO questions (user_id, user_name, title, content, answered)
    VALUES (${user_id}, ${user_name}, ${title}, ${content}, false)
    RETURNING *
  `;
  res.status(201).json(q);
});

// Question Replies
app.get('/api/question-replies', async (req, res) => {
  const { question_id } = req.query;
  const replies = await sql`
    SELECT * FROM question_replies 
    WHERE question_id = ${question_id} ORDER BY created_at ASC
  `;
  res.json(replies);
});

app.post('/api/question-replies', async (req, res) => {
  const { question_id, user_id, user_name, content } = req.body;
  const [reply] = await sql`
    INSERT INTO question_replies (question_id, user_id, user_name, content)
    VALUES (${question_id}, ${user_id}, ${user_name}, ${content})
    RETURNING *
  `;
  res.status(201).json(reply);
});

// ==================== ADMIN ROUTES ====================

// Users
app.get('/api/admin/users', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const users = await sql`SELECT id, email, full_name, role, created_at FROM users ORDER BY created_at DESC`;
  res.json(users);
});

app.put('/api/admin/users/role', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const { id, role } = req.body;
  await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
  res.json({ ok: true });
});

app.delete('/api/admin/users', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const { id } = req.body;
  await sql`DELETE FROM users WHERE id = ${id}`;
  res.json({ ok: true });
});

// Posts (Admin)
app.get('/api/admin/posts', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const posts = await sql`SELECT * FROM posts ORDER BY created_at DESC`;
  res.json(posts);
});

// Comments (Admin)
app.get('/api/admin/comments', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const comments = await sql`SELECT * FROM comments ORDER BY created_at DESC`;
  res.json(comments);
});

app.delete('/api/admin/comments', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const { id } = req.body;
  await sql`DELETE FROM comments WHERE id = ${id}`;
  res.json({ ok: true });
});

// Questions (Admin)
app.get('/api/admin/questions', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const questions = await sql`SELECT * FROM questions ORDER BY created_at DESC`;
  res.json(questions);
});

app.put('/api/admin/questions', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const { id, answered } = req.body;
  await sql`UPDATE questions SET answered = ${answered} WHERE id = ${id}`;
  res.json({ ok: true });
});

app.delete('/api/admin/questions', async (req, res) => {
  if (!(await checkAdmin(req))) return res.status(403).json({ error: 'Admin only' });
  const { id } = req.body;
  await sql`DELETE FROM questions WHERE id = ${id}`;
  res.json({ ok: true });
});

// ==================== SERVE FRONTEND ====================
app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});