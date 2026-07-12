const { CreateOrder, GetAllOrders, GetOrderById, UpdateOrder, DeleteOrder } = require('../Controller/OrderController');
const express = require('express');
const router = express.Router();

router.post('/create', CreateOrder);
router.get('/all', GetAllOrders);
router.get('/:id', GetOrderById);
router.put('/:id', UpdateOrder);
router.delete('/:id', DeleteOrder);

module.exports = router;
