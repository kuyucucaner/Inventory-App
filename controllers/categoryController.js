const Category = require('../models/category');

const categoryController = {
    getAllCategoriesController : async function (req , res){
        try {
            const categories = await Category.getAllCategories();
            console.log('Categories:', categories);

            res.render('categories', { categories });
        }
        catch (error){
            console.error('Kategori alma hatası : ', error);
            res.status(500).send('Internal Server Error');
        }
    },
    getCategoryProductByIdController: async function (req, res) {
        const categoryId = req.params.id;
        try {
          const products = await Category.getCategoryById(categoryId);
          res.render('categories_detail', { products });  // Burada 'productList' şablonunuzu kullanabilirsiniz.
        } catch (error) {
          console.error('Ürünleri alma hatası : ', error);
          res.status(500).send('Internal Server Error');
        }
      },
      
    postCategoryController: async function (req, res) {
        const newCategory = req.body;
    
        try {
          await Category.createCategory(newCategory);
          return res.redirect('/inventory/categories');
        } catch (error) {
          console.error('Ürün ekleme hatası:', error);
          res.status(500).send('Internal Server Error');
        }
     },
};

module.exports = categoryController;