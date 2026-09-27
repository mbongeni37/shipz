// Home - check if API is live
app.get('/', (req,res) => res.json({ status: "LIVE", message: "Shipz API running!" }));
app.use((req,res) => res.status(404).json({ error: "Route not found", path: req.path }));

// Handle all other routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API route not found', path: req.path });
  }
  res.json({ message: "Go to / for API status. Frontend is on Vercel." });
});
