// 1. ALL YOUR API ROUTES MUST BE AT TOP
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
// ... your other api routes ...

// 2. THEN HOME ROUTE
app.get('/', (req, res) => {
  res.json({ 
    status: "LIVE", 
    message: "Shipz API running on Render!",
    api_base: "https://shipz-server.onrender.com/api"
  });
});

// 3. THEN ONLY ONE 404 HANDLER - VERY LAST LINE
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.path });
});
