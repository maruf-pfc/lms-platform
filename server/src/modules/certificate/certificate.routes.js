const express = require('express');
const router = express.Router({ mergeParams: true });
const certificateController = require('./certificate.controller');
const { auth } = require('../../middlewares/auth.middleware');

router.post('/generate', auth, certificateController.generateCertificate);
router.get('/my', auth, certificateController.getMyCertificates);
router.get('/:id', certificateController.getCertificateById); // Public or protected? Maybe public for verification

module.exports = router;
