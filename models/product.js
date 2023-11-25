const sql = require('mssql');

const config = {
  server: 'localhost',
  database: 'inventory',
  authentication: {
    type: 'default',
    options: {
      userName: 'caner',
      password: '12',
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const tedious = require('tedious');
const connection = new tedious.Connection(config);

connection.on('connect', (err) => {
  if (err) {
    console.error('Bağlantı hatası:', err);
  } else {
    console.log('Veritabanına başarıyla bağlandı');
    // Veritabanı işlemlerinizi burada gerçekleştirin
  }
});

connection.connect();


const Product = {
  getAllProducts: async function () {
    try {
      const pool = await sql.connect(config);

      const result = await pool.request().query('SELECT * FROM Product');

      return result.recordset;
    } catch (error) {
      throw error;
    } finally {
      sql.close();
    }
  },

  getProductById: async function (productId) {
    try {
      const pool = await sql.connect(config);

      const result = await pool
        .request()
        .input('productId', sql.Int, productId)
        .query('SELECT * FROM Product WHERE ID = @productId');

      return result.recordset[0];
    } catch (error) {
      throw error;
    } finally {
      sql.close();
    }
  },
  createProduct: async function (product) {
    try {
      const pool = await sql.connect(config);
  
      const result = await pool
        .request()
        .input('categoryId', sql.Int, product.categoryId)
        .input('name', sql.NVarChar, product.name)
        .input('description', sql.NVarChar, product.description)
        .input('price', sql.Decimal, product.price)
        .query('INSERT INTO Product (CategoryID, Name, Description, Price) OUTPUT INSERTED.ID VALUES (@categoryId, @name, @description, @price)');
  
      // Veritabanı işlemi başarılı oldu mu?
      if (result && result.recordset && result.recordset.length > 0) {
        return result.recordset[0];
      } else {
        console.error('Ürün ekleme hatası: Veritabanı işlemi başarısız oldu veya beklenen sonuç dönmedi.', result);
        return null;
      }
    } catch (error) {
      console.error('Ürün ekleme hatası:', error);
      throw error;
    } finally {
      sql.close();
    }
  },
  deleteProductById: async function (id) {
    try {
      const pool = await sql.connect(config);

      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Product WHERE ID = @id');

      // Check if the deletion was successful
      if (result.rowsAffected && result.rowsAffected[0] > 0) {
        console.log(`Product with ID ${id} deleted successfully.`);
        return true; // Indicate success
      } else {
        console.error(`Product deletion failed. No product with ID ${id} found.`);
        return false; // Indicate failure (product not found or deletion unsuccessful)
      }
    } catch (error) {
      console.error('Product deletion error:', error);
      throw error;
    } finally {
      sql.close();
    }
  },
  updateProductById: async function (id,updatedProduct){
    try {
      const pool = await sql.connect(config);
  
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .input('name', sql.NVarChar(255), updatedProduct.name)
        .input('description', sql.NVarChar(255), updatedProduct.description)
        .input('price', sql.Decimal(18, 2), updatedProduct.price)
        .query('UPDATE Product SET Name = @name, Description = @description, Price = @price WHERE ID = @id');
  
      // Check if the update was successful
      return result.rowsAffected && result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Product update error:', error);
      throw error;
    } finally {
      sql.close();
    }
  },
  
  
  
  

};

module.exports = Product;
