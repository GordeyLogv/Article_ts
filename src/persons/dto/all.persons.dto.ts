import { PersonInfoModel, PersonModel } from '@prisma/client';

export class PersonsDto {
    id: number;
    nickname: string;
    age: number;

    constructor(data: PersonModel & { personInfo: PersonInfoModel }) {
        this.id = data.id;
        this.nickname = data.personInfo.nickname;
        this.age = data.personInfo.age;
    }
}
