import { GroupMessage } from 'mirai-ts/dist/types/message-type';

export abstract class AbstractChatService {
    abstract run(msg: GroupMessage, content: string): any;
}
