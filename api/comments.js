import { sql } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { post_id } = req.query;
      let comments;
      
      if (post_id) {
        comments = await sql`
          SELECT * FROM comments 
          WHERE post_id = ${post_id} 
          ORDER BY created_at ASC
        `;
      } else {
        comments = await sql`SELECT * FROM comments ORDER BY created_at ASC`;
      }
      
      return res.status(200).json(comments);
    }

    if (req.method === 'POST') {
      const { post_id, user_id, user_name, content } = req.body;
      const [newComment] = await sql`
        INSERT INTO comments (post_id, user_id, user_name, content)
        VALUES (${post_id}, ${user_id}, ${user_name}, ${content})
        RETURNING *
      `;
      return res.status(201).json(newComment);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM comments WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
