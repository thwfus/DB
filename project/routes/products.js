const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Kết nối MySQL (Aiven)
const pool = mysql.createPool({
  host: 'btl-hcsdl-tienloc0902-2358.g.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_xNTjkqxKZJWB7A1ej72',
  database: 'defaultdb',
  port: 16219,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Hiển thị tất cả sản phẩm
router.get('/', (req, res) => {
  pool.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Thêm sản phẩm
router.post('/add', (req, res) => {
  const { name, price, quantity } = req.body;
  const sql = 'INSERT INTO products(name, price, quantity) VALUES (?, ?, ?)';
  pool.query(sql, [name, price, quantity], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Thêm sản phẩm thành công');
  });
});

// Sửa sản phẩm
router.post('/edit/:id', (req, res) => {
  const { id } = req.params;
  const { name, price, quantity } = req.body;
  const sql = 'UPDATE products SET name=?, price=?, quantity=? WHERE id=?';
  pool.query(sql, [name, price, quantity, id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Cập nhật sản phẩm thành công');
  });
});

// Xóa sản phẩm
router.post('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id=?';
  pool.query(sql, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send('Xóa sản phẩm thành công');
  });
});

module.exports = router;
