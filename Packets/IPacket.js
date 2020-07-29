const ClientEvents = require('../Enums/ClientEvents');
const Client = require('../Client');

module.exports = class IPacket {
    
    constructor() {
        this.Command = {};
        this.Headers = {};
        this.Body = {};
    }

    formatPacket() {
        return {
            headers: this.Headers,
            body: this.Body
        }
    }

    /**
     * Send this packet using a specified client
     * @param {Client} client The client that should send the packet
     * @param {(...data: any[]) => void} callback A callback if data needs to be returned
     */
    sendPacket(client, callback) {
        client.emit(ClientEvents.packet_sending, this);

        var handleTimeout = () => {
            client.emit(ClientEvents.packet_timeout);
        }

        var handleDisconnect = (responseCallback, timeoutToClear) => {
            client.emit(ClientEvents.packet_failed, this);

            if (timeoutToClear) {
                clearTimeout(timeoutToClear);
            }

            if (responseCallback) {
                responseCallback({ code: 1006 });
            }
        }

        if (callback) {
            let timeout = setTimeout(handleTimeout.bind(this), 20000);

            let disconnectHandler = handleDisconnect.bind(this, callback, timeout);

            client.Connection.Socket.once('disconnect', disconnectHandler);

            client.Connection.Socket.emit(this.Command, this.formatPacket(), response => {
                callback(response);

                clearTimeout(timeout);
                client.Connection.Socket.off('disconnect', disconnectHandler);
            });
        }

        client.Connection.Socket.emit(this.Command, this.formatPacket());
    }

    send(client) {
        return new Promise((resolve, reject) => {
            this.sendPacket(client, response => {
                if (response.code >= 200 && response.code <= 299) {
                    resolve(response.body);
                } else {
                    reject(response);
                }
            })
        })
    }
}