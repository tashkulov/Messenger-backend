const express = require('express');
const { sendMessage, editMessage, deleteMessage } = require('../controllers/messageController');
const authenticateJWT = require('../config/auth');

const router = express.Router();

router.post('/send', authenticateJWT, sendMessage);
router.put('/edit', authenticateJWT, editMessage);
router.delete('/delete', authenticateJWT, deleteMessage);

module.exports = router;
