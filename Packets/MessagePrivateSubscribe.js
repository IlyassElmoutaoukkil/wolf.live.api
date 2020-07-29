const IPacket = require("./IPacket");

module.exports = class MessagePrivateSubscribe extends IPacket {

    /**
     * Subscribe Universally to Private Messages
     */
    constructor() {
        super();

        this.Command = 'message private subscribe';
        this.Headers = {
            version: 4
        };
    }
}