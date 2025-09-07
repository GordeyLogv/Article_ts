import { compare, hash } from 'bcryptjs';

import { PersonRole } from './common/enums/roles.enum.js';
import { PersonPersistence } from '../common/databaseService/entities/person.persistence.js';
import { IPerson } from './person.entity.interface.js';

export class Person implements IPerson {
    private _email: string;
    private _password: string;
    private _role: PersonRole;
    private _age: number;
    private _nickname: string;
    private _createdAt: Date;

    constructor(email: string, nickname: string, age: number, hashPassword?: string) {
        this._email = email;
        this._nickname = nickname;
        this._age = age;

        this._role = PersonRole.USER;
        this._createdAt = new Date();

        if (hashPassword) {
            this._password = hashPassword;
        }
    }

    public async setPassword(password: string, salt: number): Promise<void> {
        this._password = await hash(password, salt);
    }

    public async comparePassword(password: string): Promise<boolean> {
        return await compare(password, this._password);
    }

    public toPersistence(): PersonPersistence {
        return {
            email: this._email,
            password: this._password,
            role: this._role,
            age: this._age,
            nickname: this._nickname,
            createdAt: this._createdAt,
        };
    }
}
