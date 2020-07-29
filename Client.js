const { EventEmitter } = require('events');
const ClientConnection = require('./SocketConnections/ClientConnection');
const SocketConnection = require('./SocketConnections/SocketConnection');
const ClientEvents = require('./Enums/ClientEvents');
const SecurityLogin = require('./Packets/SecurityLogin');
const MessageGroupSubscribe = require('./Packets/MessageGroupSubscribe');
const MessagePrivateSubscribe = require('./Packets/MessagePrivateSubscribe');
const MessageSend = require('./Packets/MessageSend');
const Devices = require('./Enums/Devices');
const User = require('./Entities/User');

/**
 * A Client to connect to WOLF
 */
module.exports = class Client {

    /**
     * Create a new client
     * @param {string} serverUrl 
     * @param {string} token 
     * @param {string} device 
     */
    constructor(serverUrl = 'https://v3-rc.palringo.com', token = '', device = Devices.Web) {

        this.ServerUrl = serverUrl;

        if (token === '')
            token = this.generateToken();
        this.Token = token;

        this.Device = device;

        // Allow us to track and raise events
        this.Events = new EventEmitter();

        // The Socket.IO Connection to the service
        this.Connection = new ClientConnection(this.ServerUrl, this.Token, this.Device);

        this.CurrentUser = null;

        this.mapEvents(this.Connection);
    }

    /**
     * Add an event either to the internal EventEmitter or the socket.io client EventEmitter
     * @param {ClientEvents || string} event The string of the event to watch for
     * @param {(...data: any[]) => void} callback The callback to be executed when the event is raised
     * @param {boolean} internal If set to true, it will add it to the internal EventEmitter
     * @returns {Client} Returns the client object for easier looping
     */
    on(event, callback, internal = true) {
        if (internal) 
            this.Events.on(event, callback);
        else
            this.Connection.Socket.on(event, callback);
        return this;
    }

    /**
     * Add an event listener to the internal EventEmitter or the Socket.IO Client EventEmitter, to be executed only once
     * @param {ClientEvents || string} event The string of the event to watch for
     * @param {(...data: any[]) => void} callback The callback to be executed when the event is raised
     * @param {boolean} internal Returns the client object for easier looping
     * @returns {Client} Returns the client object for easier looping
     */
    once(event, callback, internal = true) {
        if (internal)
            this.Events.once(event, callback);
        else
            this.Connection.Socket.once(event, callback);
        return this;
    }

    /**
     * 
     * @param {ClientEvents || string} event Emits all events associated to the string from the Internal EventEmitter
     * @param  {...any[]} data Passes the data along to the callbacks
     */
    emit(event, ...data) {
        this.Events.emit(event, ...data);
    }

    /**
     * @returns {string} Returns a new token
     */
    generateToken() {
        var date = new Date();

        return 'WExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = (date + Math.random() * 16) % 16 | 0;
            date = Math.floor(date / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    /**
     * Maps all the internal events for socket.io to the Internal Event Emitter
     * @param {SocketConnection} socketConnection 
     */
    mapEvents(socketConnection) {
        var qm = (...events) => events.forEach(event => this.Connection.Socket.on(event, (...data) => this.Events.emit(event, ...data)));

        qm('connect', 
            'connect_error',
            'connect_timeout',
            'disconnect',
            'reconnect',
            'reconnect_attempt',
            'reconnecting',
            'reconnect_error',
            'reconnect_failed',
            'ping',
            'error',
            'pong');
    }

    /**
     * Opens the socket connection
     */
    connect() {
        this.Connection.Socket.open();
        return this;
    }

    /**
     * Login into Wolf with an Email and Password
     * @param {string} email The email for the account to login with
     * @param {string} password The password for the account to login with
     */
    login(email, password) {
        const packet = new SecurityLogin(email, password, this.Device)

        packet.send(this)
            .then((data) => {
                this.loginSuccessful(data);
            })
            .catch((error) => {
                this.emit(ClientEvents.login_failed, error);
            });
    }

    /**
     * Internal void to save Current User and Further setup bot, don't worry about calling this
     * @param {any} data 
     */
    loginSuccessful(data) {
        this.CurrentUser = new User(data.subscriber);
        this.emit(ClientEvents.login_success, this.CurrentUser);

        var gsubPacket = new MessageGroupSubscribe();
        var psubPacket = new MessagePrivateSubscribe();

        gsubPacket.send(this)
            .then(data => {
                this.emit(ClientEvents.message_group_subscribe_success)
            })
            .catch(error => {
                this.emit(ClientEvents.message_private_subscribe_failed, error);
            });

        psubPacket.send(this)
            .then(data => {
                this.emit(ClientEvents.message_private_subscribe_success);
            }).catch(error => {
                this.emit(ClientEvents.message_private_subscribe_failed, error);
            });

        this.on(ClientEvents.message_recieved, (data) => this.emit(ClientEvents.message_recieved, data), false);
    }

    sendMessage(recipient, message, isGroup) {
        var mesg = new MessageSend(recipient, message, isGroup);

        mesg.send(this)
            .then(data => {
                console.log('Message Sent', data);
            })
            .catch(error => {
                console.log(error);
            });
    }

}