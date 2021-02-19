import { GroupMessage } from 'mirai-ts/dist/types/message-type';
import { AbstractChatService } from '../serverType';
import { reply, replyAndRecall } from '../reply';
import { calculate } from '../calculate/compile';
import { Message } from 'mirai-ts';

export class CalculateService extends AbstractChatService {
    constructor() {
        super();
    }
    async run(msg: GroupMessage, content: string) {
        try {
            const result = calculate((content || '').trim());
            if (result) {
                await reply(msg, [Message.At(msg.sender.id), Message.Plain(' ' + result.toString())]);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
