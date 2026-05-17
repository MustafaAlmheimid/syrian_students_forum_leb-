import { sql } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { question_id } = req.query;
      const replies = await sql`
        SELECT * FROM question_replies 
        WHERE question_id = ${question_id} 
        ORDER BY created_at ASC
      `;
      return res.status(200).json(replies);
    }

    if (req.method === 'POST') {
      const { question_id, user_id, user_name, content } = req.body;
      const [newReply] = await sql`
        INSERT INTO question_replies (question_id, user_id, user_name, content)
        VALUES (${question_id}, ${user_id}, ${user_name}, ${content})
        RETURNING *
      `;
      return res.status(201).json(newReply);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM question_replies WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
