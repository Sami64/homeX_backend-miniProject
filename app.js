require("dotenv").config();
const express = require("express");
const app = express();

const services = require("./routes/services");

app.use(express.json());

app.use("/api/services", services);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
