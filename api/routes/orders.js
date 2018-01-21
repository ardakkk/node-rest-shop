const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');


//Handling incoming GET requests to /orders
router.get('/', checkAuth, OrdersController.orders_get_all);
//Create orders
router.post('/', checkAuth, OrderController.orders_create_order);
router.get('/:orderId', checkAuth, OrderController.get_order_single);
router.delete('/:orderId', checkAuth, OrderController.orders_delete_order);

module.exports = router;