/**
 * An error to state that the provided user does not exist in database
 * 
 * @class UserNotFound
 * @extends {Error}
 */
export class UserNotFoundError extends Error {
    /**
     * Creates an instance of UserNotFound
     * 
     * @memberof UserNotFound
     */
    constructor(userName: string) {
        super(`User ${userName} not found in database`);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * An error to state that the provided user already exists in database so it cannot be registered
 * 
 * @class UserAlreadyExistsError
 * @extends {Error}
 */
export class UserAlreadyExistsError extends Error {
    /**
     * Creates an instance of UserAlreadyExistsError
     * 
     * @memberof UserAlreadyExistsError
     */
    constructor(userName: string) {
        super(`User ${userName} already exists in database`);

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * An error to state that the user typed in an incorrect password
 * 
 * @class InvalidPassword
 * @extends {Error}
 */
export class InvalidPasswordError extends Error {
    /**
     * Creates an instance of InvalidPassword
     * 
     * @memberof InvalidPassword
     */
    constructor() {
        super("Password is not correct");

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * An error to state that the passwords provided for registration are not equal
 * 
 * @class InvalidPasswordConfirmation
 * @extends {Error}
 */
export class InvalidPasswordConfirmationError extends Error {
    /**
     * Creates an instance of InvalidPasswordConfirmation
     * 
     * @memberof InvalidPasswordConfirmation
     */
    constructor() {
        super("Password and password confirmation are not the same");

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * An error to state that the authorization token provided by the user was not correct
 * 
 * @class TokenVerificationError
 * @extends {Error}
 */
export class TokenVerificationError extends Error {
    /**
     * Creates an instance of TokenVerificationError
     * 
     * @memberof TokenVerificationError
     */
    constructor() {
        super("Token verification failed");

        Object.setPrototypeOf(this, new.target.prototype);
    }
}