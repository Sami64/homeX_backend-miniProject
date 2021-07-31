const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/responseApi");

exports.getCategories = async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * from categories");

    res.status(200).json(rows);
  } catch (errorMes) {
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
};

exports.getServices = async (req, res) => {
  try {
    const categoryID = req.params.categoryId;
    const { rows } = await db.query(
      "SELECT * from services inner join sellers on services.sellerID = sellers.sellerspk inner join categories on services.categoryID = categories.categoriespk where services.categoryID = $1",
      [categoryID]
    );

    let services = [];
    rows.forEach((service, index) => {
      console.log(service);
      let responseService = {
        pk: service.servicespk,
        serviceName: service.servicename,
        serviceDescription: service.servicedescription,
        features: service.features,
        category: service.categoryname,
        seller: { sellerName: service.sellername },
      };
      services.push(responseService);
    });

    res.status(200).json(services);
  } catch (errorMess) {
    console.log(errorMess);
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
};

exports.getServiceDetail = async (req, res) => {
  // Get service id
  const id = req.params.serviceId;
  const { rows } = await db.query(
    "SELECT * FROM services inner join sellers on services.sellerID = sellers.sellerspk inner join categories on services.categoryID = categories.categoriespk where services.servicespk = $1",
    [id]
  );

  const responseService = {
    pk: rows[0].pk,
    serviceName: rows[0].servicename,
    serviceDescription: rows[0].servicedescription,
    features: rows[0].features,
    image: rows[0].image,
    category: rows[0].categoryname,
    seller: {
      sellerName: rows[0].sellername,
      sellerPhoneNo: rows[0].phoneno,
      sellerEmail: rows[0].email,
      sellerQualification: rows[0].qualification,
      sellerAddress: rows[0].address,
    },
  };

  if (responseService !== undefined) res.status(200).json(responseService);
};

exports.orderService = async (req, res) => {
  console.log(req.body);
  const user = req.body.clientID;
  const service = req.body.serviceID;

  const order = {
    orderNo: uuidv4(),
    serviceID: service,
    userID: user,
    dateplaced: new Date().toISOString.slice(0, 10),
  };

  const results = await db.query(
    "INSERT INTO orders(serviceid,clientid, orderno, dateplaced) VALUES ($1,$2,$3,$4)",
    [order.serviceID, order.userID, order.orderNo, order.dateplaced]
  );

  console.log(results);

  res.status(200).json(order);
};

exports.getOrders = async (req, res) => {
  const clientID = req.params.clientID;

  const { rows } = await db.query(
    "SELECT * FROM orders inner join services on orders.serviceID = services.servicespk inner join client on orders.clientID = client.clientpk where client.clientpk = $1 AND status = 'processing'",
    [clientID]
  );

  let orders = [];

  rows.forEach((order, index) => {
    let responseOrder = {
      orderid: order.orderid,
      orderno: order.orderno,
      servicename: order.servicename,
      dateplaced: order.dateplaced,
      seller: {
        sellername: order.sellername,
      },
    };

    orders.push(responseOrder);
  });

  res.status(200).json(orders);
};

exports.getCompleted = async (req, res) => {
  const clientID = req.params.clientID;

  const { rows } = await db.query(
    "SELECT * FROM orders inner join services on orders.serviceID = services.servicespk inner join client on orders.clientID = client.clientpk where client.clientpk = $1 AND status = 'completed'",
    [clientID]
  );

  let orders = [];

  rows.forEach((order, index) => {
    let responseOrder = {
      orderid: order.orderid,
      orderno: order.orderno,
      servicename: order.servicename,
      dateplaced: order.dateplaced,
      seller: {
        sellername: order.sellername,
      },
    };

    orders.push(responseOrder);
  });

  res.status(200).json(orders);
};

exports.completeService = async (req, res) => {
  try {
    const { orderNo } = req.body;

    const { rows } = await db.query(
      "UPDATE orders SET status = 'completed' WHERE orderno = $1 ",
      [orderNo]
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
};
