export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Vercel will give you a parsed JSON body automatically
    const { password } = req.body;

    // Replace this with a real secret or bcrypt.compare
    if (password === process.env.ADMIN_PASSWORD) {
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({ success: false, message: 'Invalid password' });

  } catch (err) {
    console.error('Auth login crash:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}