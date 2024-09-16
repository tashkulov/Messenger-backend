const { Room } = require('colyseus');

class ChatRoom extends Room {
    onCreate(options) {
        this.messages = [];

        this.onMessage("message", (client, message) => {
            const newMessage = { id: `${Date.now()}-${Math.random()}`, author: client.sessionId, ...message };
            this.messages.push(newMessage);
            this.broadcast("message", newMessage);
        });

        this.onMessage("edit-message", (client, updatedMessage) => {
            const messageIndex = this.messages.findIndex(m => m.id === updatedMessage.id);
            if (messageIndex !== -1 && this.messages[messageIndex].author === client.sessionId) {
                this.messages[messageIndex].text = updatedMessage.text;
                this.broadcast("edit-message", this.messages[messageIndex]);
            }
        });

        this.onMessage("delete-message", (client, { id }) => {
            const messageIndex = this.messages.findIndex(m => m.id === id);
            if (messageIndex !== -1 && this.messages[messageIndex].author === client.sessionId) {
                const deletedMessage = this.messages.splice(messageIndex, 1)[0];
                this.broadcast("delete-message", { id: deletedMessage.id });
            }
        });
    }

    onJoin(client) {
        console.log(`${client.sessionId} присоединился к комнате`);
        client.send("init-messages", this.messages);
    }

    onLeave(client) {
        console.log(`${client.sessionId} покинул комнату`);
    }

    onDispose() {
        console.log("Комната удалена");
    }
}

module.exports = { ChatRoom };
