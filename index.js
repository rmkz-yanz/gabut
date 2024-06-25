const express = require('express');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware untuk body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware untuk menyediakan akses ke direktori uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Konfigurasi multer untuk menyimpan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const title = req.body.title;
        const fileExtension = path.extname(file.originalname);
        const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, sanitizedTitle + fileExtension);
    }
});

const upload = multer({ storage: storage });

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route untuk menangani upload
app.post('/upload.html', upload.single('mp3'), (req, res) => {
    const title = req.body.title;
    const mp3File = req.file;

    if (!mp3File) {
        return res.status(400).send('No files were uploaded.');
    }

    const fileUrl = `/uploads/${mp3File.filename}`;

    res.send(`File uploaded successfully!<br>Title: ${title}<br>File: <a href="${fileUrl}" target="_blank">${fileUrl}</a>`);
});

// Membuat folder uploads jika belum ada
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
