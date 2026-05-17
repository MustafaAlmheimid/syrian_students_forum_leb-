import { sql } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const posts = await sql`
        SELECT * FROM posts 
        WHERE published = true 
        ORDER BY created_at DESC
      `;
      return res.status(200).json(posts);
    }

    if (req.method === 'POST') {
      const { title, content, category } = req.body;
      const [newPost] = await sql`
        INSERT INTO posts (title, content, category, published)
        VALUES (${title}, ${content}, ${category}, true)
        RETURNING *
      `;
      return res.status(201).json(newPost);
    }

    if (req.method === 'PUT') {
      const { id, title, content, category, published } = req.body;
      const [updated] = await sql`
        UPDATE posts 
        SET title = ${title}, content = ${content}, category = ${category}, published = ${published}
        WHERE id = ${id}
        RETURNING *
      `;
      return res.status(200).json(updated);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM posts WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
