const express = require("express");
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(express());
app.use(express.json());
app.use(cors());

// =============================================================================
app.get("/", (req, res) => {
  res.send("My product Server is Running!!!!!!!");
});

app.listen(port, () => {
  console.log(`My Product server is running on port ${port}`);
});
// =============================================================================
