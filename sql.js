const express = require('express');
const app = express();
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = {
  origin: ['http://86.59.230.107:3002','http://localhost:3002']
};


// db Connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "event_handler",
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + connection.threadId);
});

// middleware settings
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post('/select', (req, res) => {
  const id = connection.escape(req.body.id);
  let sql = 'SELECT * FROM t_events';
  if (id) {
    sql += ' WHERE id = ' + id;
  }
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});


app.post('/update', (req, res) => {
  const id = req.body.id;
  const file_url = req.body.file_url;
  connection.query('UPDATE t_events SET file_url = ' + connection.escape(file_url) + ' WHERE id = ' + connection.escape(id), (error, results) => {
    if (error) throw error;
    console.log(results)
    res.send(results);
  });
});

app.post('/updatedetails', (req, res) => {
  const id = req.body.id;
  const cim = req.body.cim;
  const reszletek = req.body.reszletek;
  const kezdete = req.body.kezdete;
  const vege = req.body.vege;
  const file_url = req.body.file_url;
  connection.query(
    'UPDATE t_events SET file_url = ' +
      connection.escape(file_url) +
      ', cim = ' +
      connection.escape(cim) +
      ', reszletek = ' +
      connection.escape(reszletek) +
      ', kezdete = ' +
      connection.escape(kezdete) +
      ', vege = ' +
      connection.escape(vege) +
      ', file_url = ' +
      connection.escape(file_url) +
      ' WHERE id = ' +
      connection.escape(id),
    (error, results) => {
      if (error) throw error;
      console.log(results);
      res.send(results);
  });
});

app.post('/insert', (req, res) => {
  const cim = req.body.cim;
  const reszletek = req.body.reszletek;
  const kezdete = req.body.kezdete;
  const vege = req.body.vege;
  const file_url = req.body.file_url;
  connection.query(
    'INSERT INTO t_events (cim, reszletek, kezdete, vege, file_url) VALUES (' +
      connection.escape(cim) + ', ' +
      connection.escape(reszletek) + ', ' +
      connection.escape(kezdete) + ', ' +
      connection.escape(vege) + ', ' +
      connection.escape(file_url) + ')',
    (error, results) => {
      if (error) throw error;
      console.log(results);
      res.send(results);
  });
});

app.post('/delete', (req, res) => {
  const id = req.body.id;
  connection.query('DELETE FROM t_events WHERE id = ' + connection.escape(id), (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});


app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});
