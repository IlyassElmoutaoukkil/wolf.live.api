const IPacket = require("./IPacket");

module.exports = class MessageGroupSubscribe extends IPacket {

    /**
     * Subscribe Universally to All Group Messages
     */
    constructor() {
        super();

        this.Command = 'message group subscribe';
        this.Headers = {
            version: 4
        };
    }
}