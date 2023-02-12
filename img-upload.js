const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const SharpMulter = require("sharp-multer");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: ['http://86.59.230.107:3002','http://localhost:3002']
};

const storage = SharpMulter({
  destination: (req, file, callback) => callback(null, "public/img"),
  imageOptions: {
    fileFormat: "jpg",
    quality: 80,
    resize: { width: 500, height: 500 },
  },
});
const upload = multer({ storage });

// middleware settings
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/upload", upload.single("avatar"), async (req, res) => {
  console.log(req.file);
  return res.json("File Uploaded Successfully!");
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/upload.html"));
});

app.listen(3001, () => {
  console.log(`Server is running on port ${3001}`);
});
