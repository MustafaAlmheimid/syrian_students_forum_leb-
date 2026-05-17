import { sql } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'POST') {
      const { action, email, password, full_name } = req.body;

      if (action === 'login') {
        const users = await sql`
          SELECT * FROM users WHERE email = ${email}
        `;
        const user = users[0];
        
        if (!user || user.password !== password) {
          return res.status(401).json({ error: 'البريد أو كلمة المرور غير صحيحة' });
        }
        
        return res.status(200).json({
          user: {
            id: user.id,
            email: user.email,
            full_name: user.full_name,
            role: user.role
          }
        });
      }

      if (action === 'signup') {
        const existing = await sql`
          SELECT id FROM users WHERE email = ${email}
        `;
        
        if (existing.length > 0) {
          return res.status(400).json({ error: 'هذا البريد مسجل مسبقاً' });
        }

        const id = 'user-' + Date.now();
        const [newUser] = await sql`
          INSERT INTO users (id, email, password, full_name, role)
          VALUES (${id}, ${email}, ${password}, ${full_name || ''}, 'user')
          RETURNING *
        `;
        
        return res.status(201).json({
          user: {
            id: newUser.id,
            email: newUser.email,
            full_name: newUser.full_name,
            role: newUser.role
          }
        });
      }
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Auth API Error:', err);
    res.status(500).json({ error: err.message || 'حدث خطأ في السيرفر' });
  }
}
