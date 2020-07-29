// Entities
const User = require('./Entities/User');

// Enums
const ClientEvents = require('./Enums/ClientEvents');
const Devices = require('./Enums/Devices');

// Socket Connections
const SocketConnection = require('./SocketConnections/SocketConnection');
const ClientConnection = require('./SocketConnections/ClientConnection');

// Root
const Client = require('./Client');

module.exports = {
    User,

    ClientEvents,
    Devices,

    SocketConnection,
    ClientConnection,

    Client
}