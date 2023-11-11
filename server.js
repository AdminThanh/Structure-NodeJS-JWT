const app = require("./src/app");

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
  console.log(`Start Server: http://localhost:${PORT}`);
});

// Ctrl + C === SIGINT
// process.on("SIGINT", () => {
//   server.close(() => console.log(" Exit Server Express"));
// });
