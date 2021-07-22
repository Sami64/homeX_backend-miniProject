const db = require("../utils/db");
const { v4: uuidv4 } = require("uuid");
const { success, error } = require("../utils/responseApi");

exports.getServices = async (req, res) => {
  const { rows } = await db.query(
    "SELECT * from services inner join sellers on services.sellerID = sellers.pk inner join categories on services.categoryID = categories.pk"
  );
  let complete;

  let services = [];
  //console.log(rows)
  rows.forEach((service, index) => {
    let responseService = {
      pk: service.pk,
      serviceName: service.servicename,
      serviceDescription: service.servicedescription,
      category: service.categoryname,
      sellerName: service.sellername,
    };
    services.push(responseService);
    complete = true;
  });

  if (complete) {
    res.status(200).json(success("Success", services, res.statusCode));
  } else {
    res.status(404).json(error("Not Found", [], res.statusCode));
  }
};

exports.getServiceDetail = async (req, res) => {
  // Get service id
  const id = req.params.serviceId;
  const { rows } = await db.query(
    "SELECT * FROM services inner join sellers on services.sellerID = sellers.pk inner join categories on services.categoryID = categories.pk where services.pk = $1",
    [id]
  );

  const responseService = {
    pk: rows[0].pk,
    serviceName: rows[0].servicename,
    serviceDescription: rows[0].servicedescription,
    features: rows[0].features,
    category: rows[0].categoryname,
    sellerName: rows[0].sellername,
    sellerPhoneNo: rows[0].phoneno,
    sellerEmail: rows[0].email,
  };

  if (responseService !== undefined)
    res.status(200).json(success("Success", responseService, res.statusCode));
};

exports.orderService = async (req, res) => {
  console.log(req.body);
  const user = req.body.user;
  const service = req.body.service;

  const order = {
    orderID: uuidv4(),
    serviceID: service.pk,
    userID: user.pk,
  };
  const { rows } = await db.query(
    "INSERT INTO orders(orderno,serviceid,clientid) VALUES ($1,$2,$3)",
    [order.orderID, order.serviceID, order.userID]
  );

 // console.log(rows);

  //res.send(order);
  res.status(200).json(success("Success", rows, res.statusCode));
};

exports.getOrders = async (req, res) => {
  const { rows } = await db.query(
    "SELECT * FROM orders inner join services on orders.serviceID = services.pk inner join client on orders.clientID = client.pk where client.pk = 1"
  );

  //console.log(results);

  //res.send(rows);
  res.status(200).json(success("Success", rows, res.statusCode));
};
