const IPacket = require("./IPacket");

module.exports = class MessageSend extends IPacket {

    /**
     * 
     * @param {Number} recipient 
     * @param {String} message 
     * @param {Boolean} isGroup 
     */
    constructor(recipient, message, isGroup) {
        super();

        this.Command = 'message send';

        this.Headers = {
            version: 2
        };

        this.Body = {
            recipient,
            isGroup,
            data: new TextEncoder().encode(message).buffer,
            mimeType: 'text/plain'
        }
    }
}