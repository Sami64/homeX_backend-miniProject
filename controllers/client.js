const db = require("../utils/db");
const { error } = require("../utils/responseApi");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const { email, password, name, address, phoneNumber } = req.body;
    //console.log(req);
    const userExists = await db.query(
      "SELECT email from client where email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      res.status(400).json(error("User exists", res.statusCode));
      return;
    }
    //const user = { email, password, name, address, phoneNumber };

    bcrypt.hash(password, 20, async (err, hash) => {
      const user = { email, pass: hash, address, phoneNumber, name };
      console.log(user);
      await db.query(
        "INSERT INTO client(clientName,email,phoneNo,address,pass) VALUES ($1,$2,$3,$4,$5)",
        [user.name, user.email, user.phoneNumber, user.address, user.pass]
      );
    });

    const user = await db.query("SELECT * from client where email = $1", [
      email,
    ]);

    res.status(200).json(user.rows[0]);
  } catch (err) {
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await db.query("SELECT * from client where email = $1", [
      email,
    ]);

    if (findUser.rowCount < 1) {
      res.status(404).json(error("User Not Found", res.statusCode));
      return;
    }

    const match = await bcrypt.compare(password, findUser.rows[0].pass);
    if (match) {
      res.status(200).json(findUser.rows[0]);
    }
  } catch (err) {
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
};
