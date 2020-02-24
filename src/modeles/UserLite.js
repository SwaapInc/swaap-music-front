class UserLite {
    constructor(user) {
        this.id = user.id;
        this.pseudo = user.username;
        this.firstname = user.firstname;
        this.name = user.name;
        this.avatar = user.avatar;
    }
}

export default UserLite