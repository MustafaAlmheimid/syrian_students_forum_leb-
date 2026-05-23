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

  // لاحقاً يمكنك تفعيل التحقق الحقيقي

  // const userId = req.headers['x-user-id'];
  // if (!userId) return false;

  // const result = await sql`
  //   SELECT role
  //   FROM users
  //   WHERE id = ${userId}
  // `;

  // return result[0]?.role === 'admin';

  return true;
}


// ==================== AUTH ====================

// ==================== AUTH ====================

app.post('/api/auth', async (req, res) => {

  try {

    const {
      action,
      first_name,
      last_name,
      birthday,
      university,
      major,
      email,
      password
    } = req.body;

    // LOGIN
    if (action === 'login') {

      const users = await sql`
        SELECT *
        FROM users
        WHERE email = ${email}
      `;

      const user = users[0];

      if (!user || user.password !== password) {

        return res.status(401).json({
          error: 'البريد أو كلمة المرور غير صحيحة'
        });
      }

      return res.json({
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          birthday: user.birthday,
          university: user.university,
          major: user.major,
          role: user.role
        }
      });
    }

    // SIGNUP
    if (action === 'signup') {

      const existing = await sql`
        SELECT id
        FROM users
        WHERE email = ${email}
      `;

      if (existing.length > 0) {

        return res.status(400).json({
          error: 'هذا البريد مسجل مسبقاً'
        });
      }

      const id = 'user-' + Date.now();

      const [newUser] = await sql`
        INSERT INTO users (
          id,
          first_name,
          last_name,
          birthday,
          university,
          major,
          email,
          password,
          role
        )
        VALUES (
          ${id},
          ${first_name},
          ${last_name},
          ${birthday},
          ${university},
          ${major},
          ${email},
          ${password},
          'user'
        )
        RETURNING *
      `;

      return res.status(201).json({
        user: {
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          birthday: newUser.birthday,
          university: newUser.university,
          major: newUser.major,
          email: newUser.email,
          role: newUser.role
        }
      });
    }

    return res.status(400).json({
      error: 'Invalid action'
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ==================== POSTS ====================

// PUBLIC POSTS + Editing if Admin 
// ==================== POSTS ====================

// PUBLIC POSTS
// app.get('/api/posts', async (req, res) => {

//   try {

//     const posts = await sql`
//       SELECT *
//       FROM posts
//       ORDER BY created_at DESC
//     `;

//     res.json(posts);

//   } catch (err) {

//     res.status(500).json({
//       error: err.message
//     });
//   }
// });


app.get('/api/posts', async (req, res) => {

  try {

    const posts = await sql`
      SELECT *
      FROM posts
      ORDER BY created_at DESC
    `;

    res.json(posts);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});


// CREATE POST
app.post('/api/posts', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const {
      title,
      content,
      category
    } = req.body;

    const [post] = await sql`
      INSERT INTO posts (
        title,
        content,
        category,
        published
      )
      VALUES (
        ${title},
        ${content},
        ${category},
        true
      )
      RETURNING *
    `;

    res.status(201).json(post);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// UPDATE POST
app.put('/api/posts', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const {
      id,
      title,
      content,
      category
    } = req.body;

    const [post] = await sql`
      UPDATE posts
      SET
        title = ${title},
        content = ${content},
        category = ${category}
      WHERE id = ${id}
      RETURNING *
    `;

    res.json(post);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// DELETE POST
app.delete('/api/posts', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const { id } = req.body;

    await sql`
      DELETE FROM posts
      WHERE id = ${id}
    `;

    res.json({
      ok: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});
// ADMIN POSTS
app.get('/api/admin/posts', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const posts = await sql`
      SELECT *
      FROM posts
      ORDER BY created_at DESC
    `;

    res.json(posts);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// CREATE POST
app.post('/api/admin/posts', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const {
      title,
      content,
      category
    } = req.body;

    const [post] = await sql`
      INSERT INTO posts (
        title,
        content,
        category,
        published
      )
      VALUES (
        ${title},
        ${content},
        ${category},
        true
      )
      RETURNING *
    `;

    res.status(201).json(post);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// UPDATE POST
app.put('/api/admin/posts', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const {
      id,
      title,
      content,
      category
    } = req.body;

    const [post] = await sql`
      UPDATE posts
      SET
        title = ${title},
        content = ${content},
        category = ${category}
      WHERE id = ${id}
      RETURNING *
    `;

    res.json(post);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// DELETE POST
app.delete('/api/admin/posts', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const { id } = req.body;

    await sql`
      DELETE FROM posts
      WHERE id = ${id}
    `;

    res.json({
      ok: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ==================== COMMENTS ====================

app.get('/api/admin/comments', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const comments = await sql`
      SELECT *
      FROM comments
      ORDER BY created_at DESC
    `;

    res.json(comments);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


app.delete('/api/admin/comments', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const { id } = req.body;

    await sql`
      DELETE FROM comments
      WHERE id = ${id}
    `;

    res.json({
      ok: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ==================== QUESTIONS ====================

// PUBLIC QUESTIONS
app.get('/api/questions', async (req, res) => {

  try {

    const questions = await sql`
      SELECT *
      FROM questions
      ORDER BY created_at DESC
    `;

    res.json(questions);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// CREATE QUESTION
app.post('/api/questions', async (req, res) => {

  try {

    const {
      user_id,
      user_name,
      title,
      content
    } = req.body;

    const [q] = await sql`
      INSERT INTO questions (
        user_id,
        user_name,
        title,
        content,
        answered
      )
      VALUES (
        ${user_id},
        ${user_name},
        ${title},
        ${content},
        false
      )
      RETURNING *
    `;

    res.status(201).json(q);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ADMIN QUESTIONS
app.get('/api/admin/questions', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const questions = await sql`
      SELECT *
      FROM questions
      ORDER BY created_at DESC
    `;

    res.json(questions);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


app.put('/api/admin/questions', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const {
      id,
      answered
    } = req.body;

    await sql`
      UPDATE questions
      SET answered = ${answered}
      WHERE id = ${id}
    `;

    res.json({
      ok: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


app.delete('/api/admin/questions', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const { id } = req.body;

    await sql`
      DELETE FROM questions
      WHERE id = ${id}
    `;

    res.json({
      ok: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ==================== QUESTION REPLIES ====================

app.get('/api/question-replies', async (req, res) => {

  try {

    const { question_id } = req.query;

    const replies = await sql`
      SELECT *
      FROM question_replies
      WHERE question_id = ${question_id}
      ORDER BY created_at ASC
    `;

    res.json(replies);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


app.post('/api/question-replies', async (req, res) => {

  try {

    const {
      question_id,
      user_id,
      user_name,
      content
    } = req.body;

    const [reply] = await sql`
      INSERT INTO question_replies (
        question_id,
        user_id,
        user_name,
        content
      )
      VALUES (
        ${question_id},
        ${user_id},
        ${user_name},
        ${content}
      )
      RETURNING *
    `;

    res.status(201).json(reply);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// ==================== USERS ====================

app.get('/api/admin/users', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const users = await sql`
    SELECT
      id,
      email,
      first_name,
      last_name,
      birthday,
      university,
      major,
      role,
      created_at
    FROM users
      ORDER BY created_at DESC
    `;

    res.json(users);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// UPDATE USER ROLE
app.put('/api/admin/users', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const {
      id,
      role
    } = req.body;

    await sql`
      UPDATE users
      SET role = ${role}
      WHERE id = ${id}
    `;

    res.json({
      ok: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});


// DELETE USER
app.delete('/api/admin/users', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const { id } = req.body;

    await sql`
      DELETE FROM users
      WHERE id = ${id}
    `;

    res.json({
      ok: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});



//======================Profile =======================
//get user information for profile page
app.get('/api/profile/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const users = await sql`
      SELECT
        id,
        email,
        first_name,
        last_name,
        birthday,
        university,
        major,
        role
      FROM users
      WHERE id = ${id}
    `;

    if (users.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(users[0]);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

//Profile update 
app.put('/api/profile', async (req, res) => {

  try {

    const {
      id,
      first_name,
      last_name,
      birthday,
      university,
      major
    } = req.body;

    const [updatedUser] = await sql`
      UPDATE users
      SET
        first_name = ${first_name},
        last_name = ${last_name},
        birthday = ${birthday},
        university = ${university},
        major = ${major}
      WHERE id = ${id}
      RETURNING *
    `;

    res.json(updatedUser);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

// ==================== FRONTEND ====================

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});