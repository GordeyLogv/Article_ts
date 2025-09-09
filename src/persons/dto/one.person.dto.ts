import { PersonInfoModel, PersonModel } from '@prisma/client';

export class PersonDto {
    id: number;
    nickname: string;
    role: string;
    age: number;
    createdAt: Date;

    constructor(data: PersonModel & { personInfo: PersonInfoModel }) {
        this.id = data.id;
        this.nickname = data.personInfo.nickname;
        this.role = data.personInfo.role;
        this.age = data.personInfo.age;
        this.createdAt = data.personInfo.createdAt;
    }
}
