const Product = require('../models/product');

const productController = {
  getAllProductsController: async function (req, res) {
    try {
      const products = await Product.getAllProducts();
      
      res.render('products', { products });
      console.log('Alınan ürünler:', products);
    } catch (error) {
      console.error('Ürünleri alma hatası:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  getProductByIdController: async function (req, res) {
    const productId = req.params.id;

    try {
      const product = await Product.getProductById(productId);

      if (!product) {
        return res.status(404).json({ message: 'Ürün bulunamadı' });
      }

      res.json(product);
    } catch (error) {
      console.error('Ürünü alma hatası:', error);
      res.status(500).send('Internal Server Error');
    }
  },
  updateProductById : async (req,res)=>{
    const id = req.params.id;
    const { name, description, price } = req.body;
  
    try {
      const success = await Product.updateProductById(id, { name, description, price });
  
      if (success) {
        res.redirect(`/inventory/products`);
      } else {
        res.status(404).json({ success: false, message: 'Belirtilen ID ile ürün bulunamadı.' });
      }
    } catch (error) {
      console.error('Ürün güncelleme hatası:', error);

      res.status(500).json({ success: false, message: 'Ürün güncelleme sırasında bir hata oluştu.' });
    }
  },
  deleteProductByIdController: async (req, res) => {
    const id = req.params.id;
  
    try {
      if (id === undefined || id === null || id === '') {
        // productId undefined, null veya boş bir dize ise
        return res.status(400).json({ success: false, message: 'Invalid productId.' });
      }
  
      const deletionResult = await Product.deleteProductById(id);
      if (deletionResult) {
        // Product deleted successfully
      res.redirect(`/inventory/categories`);
      } else {
        // Product not found or deletion unsuccessful
        return res.status(404).json({ success: false, message: `Product with ID ${id} not found or deletion unsuccessful.` });
      }
    } catch (error) {
      console.error('Error in deleteProductByIdController:', error.message || error.stack || error);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },
  postProductController: async function (req, res) {
    const newProduct = req.body;

    try {
      await Product.createProduct(newProduct);
      return res.redirect('/inventory/products');
    } catch (error) {
      console.error('Ürün ekleme hatası:', error);
      res.status(500).send('Internal Server Error');
    }
 },

};

module.exports = productController;
