var express = require("express");
var app = express();
const mysql = require("mysql2");
var data = [];
const moment = require("moment");
const cors = require('cors');
const corsOptions = {
  origin: 'http://86.59.230.107:3002',
};

app.use(cors(corsOptions));


// Connect db
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "event_handler",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }
  console.log("Connected as id " + connection.threadId);
});

// function getTheData() {
//   data = []
//   return new Promise((resolve) => {
//     connection.query("SELECT * FROM t_events ORDER BY kezdete", (error, results) => {
//       if (error) throw error;
//       // var data = [];
//       results.forEach((result) => {
//         data.push({
//           id: result.id,
//           cim: result.cim,
//           reszletek: result.reszletek,
//           kezdete: moment(result.kezdete).format('YYYY-MM-DD HH:mm'),
//           vege: moment(result.vege).format('YYYY-MM-DD HH:mm'),
//           file_url: result.file_url,
//           // file_name: result.file_name,
//         });
//       });
//       cim = data[0].cim;
//       resolve(data);
//     });
//   });
// }

async function getTheData() {
  data = [];
  return new Promise((resolve) => {
    connection.query(
      "SELECT * FROM t_events ORDER BY kezdete",
      (error, results) => {
        if (error) throw error;
        if (!results || !results.length) {
          resolve([]);
          return;
        }
        results.forEach((result) => {
          data.push({
            id: result.id,
            cim: result.cim,
            reszletek: result.reszletek,
            kezdete: moment(result.kezdete).format("YYYY-MM-DD HH:mm"),
            vege: moment(result.vege).format("YYYY-MM-DD HH:mm"),
            file_url: result.file_url,
          });
        });
        resolve(data);
      }
    );
  });
}

// set the view engine to ejs
app.set("view engine", "ejs");

// Some array
var mascots = [
  { name: "Sammy", organization: "DigitalOcean", birth_year: 2012 },
  { name: "Tux", organization: "Linux", birth_year: 1996 },
  { name: "Moby Dock", organization: "Docker", birth_year: 2013 },
];

// Css, Js
app.use(express.static(__dirname + "/public"));

// index page
app.get("/", async function (req, res) {
  await getTheData();

  var tagline =
    "No programming concept is complete without a cute animal mascot.";

  res.header("obj", JSON.stringify(data)); //use encrypted token
  res.render("pages/index", {
    data: data,
    mascots: mascots,
    tagline: tagline,
    /* stringData: JSON.stringify(data) */
  });
});

// about page
app.get("/about", function (req, res) {
  res.render("pages/about");
});

app.listen(3002);
console.log("Server is listening on port 3002");
