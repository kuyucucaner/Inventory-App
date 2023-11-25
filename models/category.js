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

  const Category = {
    getAllCategories: async function () {
        try {
            const pool = await sql.connect(config);
    
            const result = await pool.request().query('SELECT * FROM Category');
            return result.recordset;
        }
        catch (error) {
            throw error;
        }
        finally{
            sql.close();
        }
    },
    getCategoryById: async function (categoryId) {
      try {
          const pool = await sql.connect(config);
          console.log(`Executing SQL query: SELECT * FROM Product WHERE CategoryID = ${categoryId}`);

          const result = await pool
              .request()
              .input('categoryId', sql.Int, categoryId) // Use parameterized query to prevent SQL injection
              .query('SELECT * FROM Product WHERE CategoryID = @categoryId');
              console.log(`Query result:`, result.recordset);

          return result.recordset;
      } catch (error) {
          throw error;
      } finally {
          sql.close();
      }
  },
    createCategory: async function (category) {
      try {
        const pool = await sql.connect(config);
    
        const result = await pool
          .request()
          .input('name', sql.NVarChar, category.name)
          .input('description', sql.NVarChar, category.description)
          .input('url', sql.NVarChar, category.url)
          .query('INSERT INTO Category (Name, Description, Url) OUTPUT INSERTED.ID VALUES (@name, @description, @url)');
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
     deleteCategoryById: async function (categoryId) {
        try {
            const pool = await sql.connect(config);

            const result = await pool
                .request()
                .input('categoryId', sql.Int, categoryId)
                .query('DELETE FROM Category WHERE ID = @categoryId');

            if (result.rowsAffected && result.rowsAffected[0] > 0) {
                console.log(`Category with ID ${categoryId} deleted successfully.`);
                return true; // Indicate success
            } else {
                console.error(`Category deletion failed. No category with ID ${categoryId} found.`);
                return false; // Indicate failure (category not found or deletion unsuccessful)
            }
        } catch (error) {
            console.error('Category deletion error:', error);
            throw error;
        } finally {
            sql.close();
        }
    },
  };
  module.exports = Category;