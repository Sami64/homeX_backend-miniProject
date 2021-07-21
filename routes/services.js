const express = require("express");
const router = express.Router();

const {
  getServices,
  getServiceDetail,
  orderService,
  getOrders,
} = require("../controllers/services");

router.get("/", getServices);
router.get("/service/:serviceId", getServiceDetail);
router.get('/orders', getOrders);
router.post('/order', orderService);

module.exports = router;
