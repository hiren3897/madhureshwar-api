const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 5MB
  },
});

const mediaStore = new AWS.MediaStore({
  endpoint: 'https://ck0um04jwgjjk6.data.mediastore.eu-west-2.amazonaws.com',
  accessKeyId: 'youraccesskeyid',
  secretAccessKey: 'yoursecretaccesskey',
});

app.post('/files', upload.single('file'), async (req, res) => {
  const file = req.file;
  const fileName = req.body.fileName;

  const params = {
    Path: fileName,
    ContentType: file.mimetype,
  };

  try {
    const result = await mediaStore.createObject(params).promise();
    res.json({ message: 'File uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.get('/files/:fileName', async (req, res) => {
  const fileName = req.params.fileName;

  const params = {
    Path: fileName,
  };

  try {
    const result = await mediaStore.getObject(params).promise();
    res.set('Content-Type', result.ContentType);
    res.send(result.Body);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'File not found' });
  }
});

app.put('/files/:fileName', upload.single('file'), async (req, res) => {
  const file = req.file;
  const fileName = req.params.fileName;

  const params = {
    Path: fileName,
    ContentType: file.mimetype,
  };

  try {
    const result = await mediaStore.putObject(params).promise();
    res.json({ message: 'File updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update file' });
  }
});

app.delete('/files/:fileName', async (req, res) => {
  const fileName = req.params.fileName;

  const params = {
    Path: fileName,
  };

  try {
    const result = await mediaStore.deleteObject(params).promise();
    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
