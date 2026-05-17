import { sql } from '../_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  // TODO: Add proper admin verification later
  try {
    if (req.method === 'GET') {
      const users = await sql`
        SELECT id, email, full_name, role, created_at 
        FROM users 
        ORDER BY created_at DESC
      `;
      return res.status(200).json(users);
    }

    if (req.method === 'PUT') {
      const { id, role } = req.body;
      await sql`UPDATE users SET role = ${role} WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      await sql`DELETE FROM users WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}