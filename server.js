import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { sql } from './api/_db.js';

import nodemailer from 'nodemailer';
import crypto from 'crypto';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
      phone,
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
            birthday: user.birthday
            ? user.birthday.toISOString().split('T')[0]
            : null,
            university: user.university,
            major: user.major,
            phone: user.phone,
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
            phone,
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
            ${phone},
            ${email},
            ${password},
            'user'
          )
        RETURNING *
      `;

      // Send Welcome Email
      await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: email,

        subject: 'مرحباً بك في ملتقى الطلاب السوريين',

        html: `
          <div style="
            font-family: Arial;
            direction: rtl;
            text-align: right;
            padding: 20px;
          ">

            <h2 style="color:#047857;">
              أهلاً بك ${first_name} 👋
            </h2>

            <p>
              تم إنشاء حسابك بنجاح في منصة
              <strong>ملتقى الطلاب السوريين في لبنان</strong>.
            </p>

            <p>
              يمكنك الآن:
            </p>

            <ul>
              <li>متابعة الأخبار والتحديثات</li>
              <li>طرح الأسئلة داخل المجتمع</li>
              <li>التفاعل مع الطلاب</li>
              <li>الوصول إلى الأدلة الإرشادية</li>
            </ul>

            <br>

            <a
              href="${process.env.BASE_URL}"
              style="
                background:#047857;
                color:white;
                padding:12px 20px;
                border-radius:10px;
                text-decoration:none;
                display:inline-block;
              "
            >
              الدخول إلى المنصة
            </a>

            <br><br>

            <p style="font-size:13px;color:gray;">
              ملتقى الطلاب السوريين في لبنان
            </p>

          </div>
        `
      });

      return res.status(201).json({
        user: {
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          birthday: newUser.birthday  ? 
          user.birthday.toISOString().split('T')[0]
          : null,
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
      phone,
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
        phone,
        role
      FROM users
      WHERE id = ${id}
    `;

    if (users.length === 0) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const user = users[0];

    res.json({
      ...user,
      birthday: user.birthday
        ? user.birthday.toISOString().split('T')[0]
        : null
    });

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
      major,
      phone
    } = req.body;

    const [updatedUser] = await sql`
      UPDATE users
        SET
          first_name = ${first_name},
          last_name = ${last_name},
          birthday = ${birthday},
          university = ${university},
          major = ${major},
          phone = ${phone}
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



//==================== Forgot Password ====================
app.post('/api/forgot-password', async (req, res) => {

  try {

    const { email } = req.body;

    const users = await sql`
      SELECT *
      FROM users
      WHERE email = ${email}
    `;

    const user = users[0];

    if (!user) {
      return res.status(404).json({
        error: 'البريد غير موجود'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');

    const expiry = Date.now() + 1000 * 60 * 30;

    await sql`
      UPDATE users
      SET
        reset_token = ${token},
        reset_token_expiry = ${expiry}
      WHERE id = ${user.id}
    `;

    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

    const resetLink = `${BASE_URL}/reset-password/${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'إعادة تعيين كلمة المرور',
     html: `
      <div style="
        font-family: Arial, sans-serif;
        direction: rtl;
        text-align: right;
        background: #f9fafb;
        padding: 40px 20px;
      ">

        <div style="
          max-width: 600px;
          margin: auto;
          background: white;
          border-radius: 20px;
          padding: 40px;
          border: 1px solid #e5e7eb;
        ">

          <div style="
            text-align: center;
            margin-bottom: 30px;
          ">

            <h1 style="
              color: #047857;
              margin: 0;
              font-size: 28px;
            ">
              إعادة تعيين كلمة المرور
            </h1>

            <p style="
              color: #6b7280;
              margin-top: 10px;
              font-size: 15px;
            ">
              ملتقى الطلاب السوريين في لبنان
            </p>

          </div>

          <p style="
            color: #374151;
            font-size: 16px;
            line-height: 1.8;
          ">
            تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.
          </p>

          <p style="
            color: #374151;
            font-size: 16px;
            line-height: 1.8;
          ">
            اضغط على الزر التالي لإكمال العملية:
          </p>

          <div style="text-align:center; margin:40px 0;">

            <a
              href="${resetLink}"
              style="
                background:#047857;
                color:white;
                text-decoration:none;
                padding:14px 28px;
                border-radius:12px;
                font-size:16px;
                font-weight:bold;
                display:inline-block;
              "
            >
              إعادة تعيين كلمة المرور
            </a>

          </div>

          <p style="
            color:#6b7280;
            font-size:14px;
            line-height:1.8;
          ">
            إذا لم تقم بطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.
          </p>

          <hr style="
            border:none;
            border-top:1px solid #e5e7eb;
            margin:30px 0;
          ">

          <p style="
            text-align:center;
            color:#9ca3af;
            font-size:13px;
          ">
            © ملتقى الطلاب السوريين في لبنان
          </p>

        </div>
      </div>
    `
    });

    res.json({
      ok: true
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});

//reset password
app.post('/api/reset-password', async (req, res) => {

  try {

    const {
      token,
      password
    } = req.body;

    const users = await sql`
      SELECT *
      FROM users
      WHERE reset_token = ${token}
    `;

    const user = users[0];

    if (!user) {

      return res.status(400).json({
        error: 'الرابط غير صالح'
      });
    }

    if (Date.now() > user.reset_token_expiry) {

      return res.status(400).json({
        error: 'انتهت صلاحية الرابط'
      });
    }

    await sql`
      UPDATE users
      SET
        password = ${password},
        reset_token = NULL,
        reset_token_expiry = NULL
      WHERE id = ${user.id}
    `;

    res.json({
      ok: true
    });

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
});



//===================== Announcement Stats ====================
app.post('/api/admin/send-announcement', async (req, res) => {

  try {

    if (!(await checkAdmin(req))) {
      return res.status(403).json({
        error: 'Admin only'
      });
    }

    const {
      title,
      message
    } = req.body;

    const users = await sql`
      SELECT email, first_name
      FROM users
      WHERE email IS NOT NULL
    `;

    for (const user of users) {

      await transporter.sendMail({

        from: process.env.EMAIL_USER,

        to: user.email,

        subject: title,

        html: `
          <div style="
            font-family: Arial, sans-serif;
            background: #f5f7f9;
            padding: 40px 20px;
          ">

            <div style="
              max-width: 650px;
              margin: auto;
              background: white;
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid #e5e7eb;
            ">

              <div style="
                background: linear-gradient(135deg, #047857, #065f46);
                padding: 35px;
                text-align: center;
                color: white;
              ">
                <h1 style="
                  margin: 0;
                  font-size: 30px;
                ">
                  ملتقى الطلاب السوريين
                </h1>

                <p style="
                  margin-top: 10px;
                  opacity: 0.9;
                ">
                  Syrian Students Forum in Lebanon
                </p>
              </div>

              <div style="padding: 40px;">

                <h2 style="
                  color: #111827;
                  margin-bottom: 25px;
                ">
                  ${title}
                </h2>

                <p style="
                  color: #374151;
                  line-height: 2;
                  font-size: 16px;
                  white-space: pre-line;
                ">
                  مرحباً ${user.first_name || ''}،

                  ${message}
                </p>

                <div style="
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  color: #6b7280;
                  font-size: 14px;
                ">
                  تم إرسال هذه الرسالة من منصة ملتقى الطلاب السوريين في لبنان.
                </div>

              </div>
            </div>
          </div>
        `
      });
    }

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: err.message
    });
  }
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
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