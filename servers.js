const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('resourceFile'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
