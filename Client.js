const { EventEmitter } = require('events');

module.exports = class Client {

    /**
     * Create a new client
     * @param {string} serverUrl 
     * @param {string} token 
     * @param {string} device 
     */
    constructor(serverUrl = 'https://v3-rc.palringo.com', token = '', device) {
        // Allow us to track and raise events
        this.Events = new EventEmitter();
    }

    /**
     * Add an event either to the internal EventEmitter or the socket.io client EventEmitter
     * @param {string} event The string of the event to watch for
     * @param {(...data: any[]) => void} callback The callback to be executed when the event is raised
     * @param {boolean} internal If set to true, it will add it to the internal EventEmitter
     */
    on(event, callback, internal = true) {
        if (internal)
            this.Events.on(event, callback);
    }

}