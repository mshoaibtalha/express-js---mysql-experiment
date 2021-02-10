const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const port = 1000;
//app.use(mysql());
app.use(cors());
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded


db = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'root',
database: 'northwind'
});

app.get('/get-suppliers', (req, res) => {
let sql = `SELECT * FROM suppliers`;
db.query(sql, function (err, data, fields) {
if (err) throw err;
res.json({
status: 200,
data,
message: "suppliers lists retrieved successfully"
})
})
});

app.post('/add-supplier', (req, res) => {
var post = { job_title: req.body.job_title, first_name: req.body.first_name, last_name: req.body.last_name, company: req.body.company_name,email_address: req.body.email_address, city: req.body.city, business_phone: req.body.business_phone};
var query = db.query('INSERT INTO suppliers SET ?', post, function (err, result) {
if (err) throw err;
res.json({
status: 200,
message: "suppliers lists added successfully"
});
});
});

app.post('/edit-supplier', (req, res) => {

//var post = {id:req.body.id, job_title: req.body.job_title, first_name: req.body.first_name, last_name: req.body.last_name, company: req.body.company_name,email_address: req.body.email_address, city: req.body.city, business_phone: req.body.business_phone};
var post = [req.body.job_title, req.body.first_name, req.body.last_name, req.body.company_name, req.body.email_address, req.body.city, req.body.business_phone, req.body.id ]
//db.query("UPDATE posts SET title = :title", { title: "Hello MySQL" });
var query = db.query('UPDATE suppliers SET job_title = ?, first_name = ?, last_name = ?, company = ?, email_address = ?, city = ?,business_phone = ? where id = ?', post, function (err, result) {
if (err) throw err;
res.json({
status: 200,
message: "suppliers lists edited successfully"
});
});
});

// Delete supplier

app.get('/delete-supplier/:id', (req, res) => {
var query = db.query('DELETE FROM suppliers WHERE id =' + req.params.id, function (err, result) {
if (err) throw err;
res.json({
status: 200,
message: "suppliers lists deleted successfully"
})
});

});
// Editing
app.get('/get-supplier/:id', (req, res) => {
var query = db.query('SELECT * FROM suppliers WHERE id =' + req.params.id, function (err, result) {
if (err) throw err;
res.json({
status: 200,
message: "suppliers lists deleted successfully",
data:result
})
});

});

// app.get('/get-purchase-order/:id', (req, res) => {
// var query = db.query('SELECT * FROM purchase_order_details WHERE id =' + req.params.id, function (err, result){
// if (err) throw err;
// res.json({
// status: 200,
// message: "order lists retrieved successfully",
// data:result
// })
// });

// });

app.get('/get-supplier-purchasing-orders/:supplier_id', (req, res) => {
let sql = "SELECT po.*,pos.status, emp.job_title,emp.first_name,emp.last_name FROM purchase_orders AS po LEFT JOIN purchase_order_status AS pos ON pos.id = po.status_id LEFT JOIN employees AS emp ON emp.id = po.approved_by WHERE po.supplier_id = " + req.params.supplier_id;
db.query(sql, function (err, data, fields) {
if (err) throw err;
res.json({
status: 200,
data,
message: "Order lists retrieved successfully"
})
})
});
app.get('/get-purchasing-order/:purchase_order_id', (req, res) => {
let sql = "SELECT po.*,sp.company, sp.first_name, sp.last_name, sp.job_title, sp.business_phone,sp.email_address, pos.status, emp.job_title AS e_job_title,emp.first_name AS e_first_name,emp.last_name AS e_last_name FROM purchase_orders AS po LEFT JOIN suppliers AS sp ON sp.id = po.supplier_id LEFT JOIN purchase_order_status AS pos ON pos.id = po.status_id LEFT JOIN employees AS emp ON emp.id = po.approved_by WHERE po.id = " + req.params.purchase_order_id;
db.query(sql, function (err, data, fields) {
if (err) throw err;
res.json({
status: 200,
data,
message: "Order lists retrieved successfully"
})
})
});
app.get('/get-purchasing-order-item/:purchase_order_id', (req, res) => {
let sql = "SELECT d.*,p.product_name FROM purchase_order_details AS d LEFT JOIN products AS p ON p.id = d.product_id WHERE d.purchase_order_id = " + req.params.purchase_order_id;
db.query(sql, function (err, data, fields) {
if (err) throw err;
res.json({
status: 200,
data,
message: "Order lists retrieved successfully"
})
})
});

// app.get('/get-shippers', (req, res) => {
// let sql = `SELECT * FROM shippers`;
// db.query(sql, function (err, data, fields) {
// if (err) throw err;
// res.json({
// status: 200,
// data,
// message: "shippers lists retrieved successfully"
// })
// })
// });
// app.post('/add-shipper', (req, res) => {
// let sql = `SELECT * FROM shippers`;
// db.query(sql, function (err, data, fields) {
// if (err) throw err;
// res.json({
// status: 200,
// data,
// message: "shippers lists retrieved successfully"
// })
// })
// });

// app.get('/get-employees', (req, res) => {
// let sql = `SELECT * FROM employees`;
// db.query(sql, function (err, data, fields) {
// if (err) throw err;
// res.json({
// status: 200,
// data,
// message: "employees lists retrieved successfully"
// })
// })
// });
// app.get('/get-products', (req, res) => {
// let sql = `SELECT list_price FROM products`;
// db.query(sql, function (err, data, fields) {
// if (err) throw err;
// res.json({
// status: 200,
// data,
// message: "product lists retrieved successfully"
// })
// })
// });


app.listen(port, () => {
console.log(`Example app listening at http://localhost:${port}`)
})