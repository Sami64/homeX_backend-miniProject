const express = require("express");
const router = express.Router();

const {
  getServices,
  getServiceDetail,
  orderService,
  getOrders,
  getCategories,
  getNearby,
  getCompleted,
} = require("../controllers/services");

router.get("/categories/:categoryId", getServices);
router.get("/categories", getCategories);
router.get("/service/:serviceId", getServiceDetail);
router.get("/orders/:clientID", getOrders);
router.get("/orders-completed/:clientID", getCompleted);
router.post("/order", orderService);
router.post("/nearby", getNearby);

module.exports = router;
