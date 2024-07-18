const express = require("express");
const app = express();
const connectDb = require("./config/dbconnection");
const Student = require("./models/student");

connectDb();
app.use(express.json());

app.use("/auth", require("./routes/authRoutes"));

app.use("/room", require("./routes/roomRoutes"));

// health check
app.get("/", async (req, res) => {
  res.send(await Student.find());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
