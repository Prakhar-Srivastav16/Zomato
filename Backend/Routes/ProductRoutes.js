const { CreateProduct, GetAllProducts, GetProductById, UpdateProduct, DeleteProduct } = require('../Controller/ProductController');
const express = require('express');
const router = express.Router();

router.post('/create', CreateProduct);
router.get('/all', GetAllProducts);
router.get('/:id', GetProductById);
router.put('/:id', UpdateProduct);
router.delete('/:id', DeleteProduct);

module.exports = router;
