const router = require('express').Router();
const controller = require('./upload.controller');
const { auth } = require('../../middlewares/auth.middleware'); // Optional: protect upload
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Temp storage

router.post('/', auth, upload.single('image'), controller.uploadImage);

module.exports = router;
