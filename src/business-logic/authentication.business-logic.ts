import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { IUser } from "../database/database.interfaces";
import { AuthenticationDatabaseLogic } from "../database/logic/authentication.database-logic";

import {
    InvalidPasswordError,
    InvalidPasswordConfirmationError,
    TokenVerificationError,
    UserNotFoundError,
    UserAlreadyExistsError,
} from "../errors/authentication.errors";

/**
 * Manages authentication tasks
 * 
 * @class AuthenticationBusinessLogic
 */
export class AuthenticationBusinessLogic {
    private authenticationDatabaseLogic: AuthenticationDatabaseLogic;

    /**
     * Adds a new application user
     *
     * @param {string} userName
     * @param {string} userPassword
     * @param {string} userPasswordConfirmation
     * 
     * @memberof AuthenticationBusinessLogic
     */
    public async registerUser(userName: string, userPassword: string, userPasswordConfirmation: string) {
        const user: IUser = await this.authenticationDatabaseLogic.getUserByName(userName);

        if (user) {
            throw new UserAlreadyExistsError(userName);
        } else {
            if (userPassword === userPasswordConfirmation) {
                const encryptedPassword = await bcrypt.hash(userPassword, 10);
    
                const newUser: IUser = await this.authenticationDatabaseLogic.createUser(userName, encryptedPassword);
    
                return jwt.sign(
                    { id: newUser.id, name: newUser.name },
                    process.env.API_KEY,
                    { expiresIn: process.env.TOKEN_EXPIRATION },
                );
            } else {
                throw new InvalidPasswordConfirmationError();
            }
        }
    }

    /**
     * Gives a user access to the application
     *
     * @param {string} userName
     * @param {string} userPassword
     * 
     * @memberof AuthenticationBusinessLogic
     */
    public async loginUser(userName: string, userPassword: string) {
        const user: IUser = await this.authenticationDatabaseLogic.getUserByName(userName);

        if (user) {
            const isPasswordCorrect = await bcrypt.compare(userPassword, user.password);

            if (isPasswordCorrect) {
                return jwt.sign(
                    { id: user.id, name: user.name },
                    process.env.API_KEY,
                    { expiresIn: process.env.TOKEN_EXPIRATION },
                );
            } else {
                throw new InvalidPasswordError();
            }
        } else {
            throw new UserNotFoundError(userName);
        }
    }

    /**
     * Checks that the JWT token provided by the user is correct
     *
     * @param {string} token
     * 
     * @memberof AuthenticationBusinessLogic
     */
    public verifyToken(token: string) {
        return jwt.verify(token, process.env.API_KEY, (error) => {
            if (error) {
                throw new TokenVerificationError();
            } else {
                const decodedToken: any = jwt.decode(token);

                return decodedToken.id;
            }
        });
    }

    /**
     * Creates an instance of AuthenticationBusinessLogic
     * 
     * @param {AuthenticationDatabaseLogic} AuthenticationDatabaseLogic
     * 
     * @memberof AuthenticationBusinessLogic
     */
    constructor(AuthenticationDatabaseLogic: AuthenticationDatabaseLogic) {
        this.authenticationDatabaseLogic = AuthenticationDatabaseLogic;
    }
}