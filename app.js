require("dotenv").config();
const express = require("express");
const app = express();

const services = require("./routes/services");
const client = require("./routes/client");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/services", services);
app.use("/api/client", client);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
