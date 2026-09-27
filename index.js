// Home - check if API is live
app.get('/', (req, res) => {
  res.json({ 
    message: "Shipz Academy API is LIVE! 🚀",
    status: "Backend running on Render",
    frontend: "Deploy frontend on Vercel with VITE_API_URL=https://shipz-server.onrender.com"
  });
});

// Handle all other routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found', path: req.path });
  }
  res.json({ message: "Go to / for API status. Frontend is on Vercel." });
});
