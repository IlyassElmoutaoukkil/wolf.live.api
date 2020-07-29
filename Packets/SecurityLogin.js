const IPacket = require("./IPacket");
const Devices = require('../Enums/Devices');
const md5 = require('md5');

module.exports = class SecurityLogin extends IPacket {

    /**
     * 
     * @param {string} email 
     * @param {string} password 
     * @param {Devices} device 
     */
    constructor(email, password, device) {
        super();
        
        this.Command = 'security login';

        this.Headers = {
            version: 2
        };
        
        this.Body = {
            deviceTypeId: device,
            type: 'email',
            username: email,
            password: md5(password),
            md5Password: true
        };
    }
}