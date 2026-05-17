import { sql } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const questions = await sql`
        SELECT * FROM questions ORDER BY created_at DESC
      `;
      return res.status(200).json(questions);
    }

    if (req.method === 'POST') {
      const { user_id, user_name, title, content } = req.body;
      const [newQ] = await sql`
        INSERT INTO questions (user_id, user_name, title, content, answered)
        VALUES (${user_id}, ${user_name}, ${title}, ${content}, false)
        RETURNING *
      `;
      return res.status(201).json(newQ);
    }

    if (req.method === 'PUT') {
      const { id, answered } = req.body;
      const [updated] = await sql`
        UPDATE questions 
        SET answered = ${answered}
        WHERE id = ${id}
        RETURNING *
      `;
      return res.status(200).json(updated);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
