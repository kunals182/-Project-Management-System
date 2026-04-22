const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀  Server is running at http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop.\n`);
});
