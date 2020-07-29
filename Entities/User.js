module.exports = class User {

    constructor(data) {
        const { id, 
            privileges, 
            nickname, 
            status, 
            reputation, 
            icon, 
            onlineState, 
            deviceType, 
            groupMemberCapabilities, 
            contactListBlockedState, 
            contactListAuthState,
            charms
        } = data;

        this.Id = id;
        this.Privileges = privileges;
        this.Nickname = nickname;
        this.Status = status;
        this.Reputation = reputation;
        this.Icon = icon;
        this.OnlineState = onlineState;
        this.DeviceType = deviceType;
        this.GroupMemberCapabilities = groupMemberCapabilities;
        this.ContactListBlockState = contactListBlockedState;
        this.ContactListAuthState = contactListAuthState;
        this.Charms = charms;
    }

}