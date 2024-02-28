const express = require('express');
const multer = require('multer');
const app = express();
const port = 4000;

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the directory where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage });

// Handle file uploads
app.post('/upload', upload.single('resourceFile'), (req, res) => {
  res.json({ message: 'File uploaded successfully' });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
