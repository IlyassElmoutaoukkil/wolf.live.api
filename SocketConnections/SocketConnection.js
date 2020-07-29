const socket = require('socket.io-client');

/**
 * Base Socket.IO Wrapper Class
 */
module.exports = class SocketConnection {

    /**
     * Create a new SocketConnection
     * @param {string} serverUrl The URL used to connect to WOLF's Servers
     * @param {string} token The token associated with the User/Session
     * @param {string} device The device being used for the session
     */
    constructor(serverUrl, token, device) {
        this.ServerUrl = serverUrl;
        this.Token = token;
        this.Device = device;

        this.Socket = socket(`${this.ServerUrl}?token=${this.Token}&device=${this.Device}`, {
            transports: [
                'websocket'
            ],
            autoConnect: false
        });
    }
}