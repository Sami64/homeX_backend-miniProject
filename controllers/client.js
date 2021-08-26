const db = require("../utils/db");
const { error } = require("../utils/responseApi");
const bcrypt = require("bcryptjs");

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

    bcrypt.hash(password, 12, async (err, hash) => {
      const user = { email, pass: hash, address, phoneNumber, name };
      console.log(user);
      await db.query(
        "INSERT INTO client(clientName,email,phoneNo,address,pass) VALUES ($1,$2,$3,$4,$5)",
        [user.name, user.email, user.phoneNumber, user.address, user.pass]
      );
    });

    const { rows } = await db.query("SELECT * from client where email = $1", [
      email,
    ]);
    //const user = rows[0];

    res.status(200).json(rows[0]);
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
      console.log("no user");
      res.status(404).json(error("User Not Found", res.statusCode));
      //return;
    }
    console.log("comparing");

    bcrypt.compare(password, findUser.rows[0].pass, (err, result) => {
      console.log("compare function");
      if (result == true) {
        console.log("match");
        res.status(200).json(findUser.rows[0]);
        //return;
      } else {
        res.status(400).json(error("Authentication Error", res.statusCode));
      }
    });
  } catch (err) {
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
};

exports.getUserData = async (req, res) => {
  try {
    let token = req.headers.authorization;
    token = token.slice(7);
    console.log(`The Token ${token}`);
    const results = await db.query("SELECT * from client WHERE clientpk = $1", [
      token,
    ]);
    if (results.rowCount > 0) {
      const user = results.rows[0];
      res.status(200).json(user);
    } else {
      res.status(404).json(error("User Not Found", res.statusCode));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
};
