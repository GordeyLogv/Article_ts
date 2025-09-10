import { IPersonPersistence } from '../common/databaseService/entities/person.persistence.js';

export interface IPerson {
    setPassword: (password: string, salt: number) => Promise<void>;
    comparePassword: (password: string) => Promise<boolean>;
    toPersistence: () => IPersonPersistence;
}
