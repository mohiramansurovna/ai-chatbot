import { MessageRole } from "./messages.model";

export class Message{
    id:number;
    sessionId:number;
    role:MessageRole;
    content:string
    createdAt:Date;

    constructor(data:Message){
        Object.assign(this,data)
    }
}