export class User_account {
    username: string;
    password: string;
    email: string;
    verificationCode: string;
    accountStatus: string;
    accountType: string;
    accountState: string;

    constructor(
        username: string,
        password: string,
        email: string,
        verificationCode: string,
        accountStatus: string,
        accountType: string,
        accountState: string
    ) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.verificationCode = verificationCode;
        this.accountStatus = accountStatus;
        this.accountType = accountType;
        this.accountState = accountState;
    }
}