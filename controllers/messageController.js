const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { text, recipient } = req.body;
        const message = new Message({
            text,
            sender: req.user.id,
            recipient
        });
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Error sending message' });
    }
};

// Edit a message
exports.editMessage = async (req, res) => {
    try {
        const { messageId, newText } = req.body;
        const message = await Message.findById(messageId);
        if (message.sender !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to edit' });
        }
        message.text = newText;
        await message.save();
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Error editing message' });
    }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.body;
        const message = await Message.findById(messageId);
        if (message.sender !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to delete' });
        }
        await message.remove();
        res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting message' });
    }
};
