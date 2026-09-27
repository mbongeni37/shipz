app.get('/{*splat}', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({error:'Not found'});
  }
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  try {
    if (require('fs').existsSync(indexPath)) {
      return res.sendFile(indexPath);
    } else {
      return res.json({ 
        message: "Shipz Academy API is LIVE! 🚀",
        status: "Backend running",
        frontend: "Deploy frontend on Vercel with VITE_API_URL=https://shipz-server.onrender.com",
        docs: "/api"
      });
    }
  } catch (e) {
    return res.json({ message: "API LIVE" });
  }
});
