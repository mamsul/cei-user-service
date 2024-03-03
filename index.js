const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const users = require("./lib/users.json");

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const TOKEN = process.env.TOKEN;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Users Service");
});

app.use((req, res, next) => {
  try {
    const { tokenId } = req.body;

    if (tokenId !== TOKEN) {
      return res.status(401).json({
        error: "Unauthorized.",
      });
    }

    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
    });
  }
});

app.post("/user", (req, res) => {
  try {
    const { email } = req.body;
    const user = users.find((u) => u.email == email);

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials.",
      });
    }

    return res.json({
      name: user.name,
      memberNo: user.memberNo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Users Service started at http://localhost:${PORT}`);
});

module.exports = app;
