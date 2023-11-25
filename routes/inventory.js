const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');

// Assuming you have a route for getting all categories
router.get('/categories', categoryController.getAllCategoriesController);

// Assuming you have a route for getting a category by ID
router.get('/categories/:id/products', categoryController.getCategoryProductByIdController);

router.post('/categories', categoryController.postCategoryController);

router.put('/products/:id', productController.updateProductById);

router.delete('/products/:id', productController.deleteProductByIdController);


// Assuming you have a route for getting all products
router.get('/products', productController.getAllProductsController);

// Assuming you have a route for getting a product by ID

router.post('/products', productController.postProductController);


module.exports = router;
