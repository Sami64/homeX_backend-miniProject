const db = require("../utils/db");

exports.getServices = async (req, res) => {
  const { rows } = await db.query("SELECT * from services");
  //console.log(rows[0]['sellerid']);
  //res.send(rows);

  let services = [];
  rows.forEach((service, index) => {
    //console.log(service);
    //console.log(`index ${index}`);
    let responseService = {
      pk: service.pk,
      serviceName: service.servicename,
      serviceDescription: service.servicedescription,
    };

    console.log(responseService);
    services.push(responseService);
  });

  res.send(services)

  // res.send([
  //   {
  //     pk: "1244",
  //     name: "AAA Plumber Services",
  //     description: "some plumbing service",
  //     features: ["refund", "free fitting"],
  //   },
  //   {
  //     pk: "1242",
  //     name: "AAA Carpentry Services",
  //     description: "some carpentry service",
  //     features: ["free polishing", "free fitting"],
  //   },
  // ]);
};

exports.getServiceDetail = async (req, res) => {
  // Get service id
  const id = req.params.serviceId;
  const result = await db.query("SELECT * FROM services WHERE pk = id", [id]);

  res.send({
    pk: "1244",
    name: "AAA Plumber Services",
    description: "The description",
    features: ["the feature one", "the feature two"],
    seller: {
      name: "Khae",
      age: "20",
      phone: "0552344568",
      email: "j@gmail.com",
    },
    category: "plumbing",
  });
};

exports.orderService = async (req, res) => {
  console.log(req.body);
  res.send({
    orderId: "",
    service: {},
    user: { name: "user plumb", phone: "0552421134", email: "j@j.com" },
  });
};

exports.getOrders = async (req, res) => {
  const result = await db.query("SELECT * FROM orders");
  res.send([
    {
      orderId: "",
      service: {},
      user: { name: "user plumb", phone: "0552421134", email: "" },
    },
  ]);
};
