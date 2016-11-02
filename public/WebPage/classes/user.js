class User {
    constructor(email, username, password) {
        this.email = email;
        this.username = username;
	      this.password = password;
    }

    get username() {
        return this.username;
    }

    get email() {
        return this.email;
    }

	  get password() {
		    return this.password;
	  }

    set username(newUsername) {
	      this.username = newUsername;
    }

	  set password(newPassword) {
		    this.password = newPassword;
	  }
}
