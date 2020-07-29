const SocketConnection = require("./SocketConnection");

/**
 * ClientSide (NON-ADMIN) Connection to WOLF
 */
module.exports = class ClientConnection extends SocketConnection {

    /**
     * 
     * @param {string} serverUrl The URL used to connect to WOLF's Servers
     * @param {string} token The token associated with the User/Session
     * @param {string} device The device being used for the session
     */
    constructor(serverUrl, token, device) {
        super(serverUrl, token, device);
    }
}