const socket = require('socket.io-client');
const Devices = require('../Enums/Devices');

/**
 * Base Socket.IO Wrapper Class
 */
module.exports = class SocketConnection {

    /**
     * Create a new SocketConnection
     * @param {string} serverUrl The URL used to connect to WOLF's Servers
     * @param {string} token The token associated with the User/Session
     * @param {Devices} device The device being used for the session
     */
    constructor(serverUrl, token, device) {
        this.ServerUrl = serverUrl;
        this.Token = token;

        switch(device) {
            case Devices.Unknown:
            case Devices.Web:
            case Devices.Bot:
            default:
                this.Device = 'web';
                break;
            case Devices.Android:
                this.Device = 'android';
                break;
            case Devices.iPad:
            case Devices.iPhone:
                this.Device = 'ios';
                break;
        }

        this.Socket = socket(`${this.ServerUrl}?token=${this.Token}&device=${this.Device}`, {
            transports: [
                'websocket'
            ],
            autoConnect: false
        });
    }
}