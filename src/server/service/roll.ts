import { GroupMessage } from 'mirai-ts/dist/types/message-type';
import { AbstractChatService } from '../serverType';
import { reply, replyAndRecall } from '../reply';
import { random } from '../utils/random';

export class RollService extends AbstractChatService {
    constructor() {
        super();
    }
    async run(msg: GroupMessage, content: string) {
        const matched = (content || '').trim().match(/^(\d+)\-(\d+)$/);
        let start = 0;
        let end = 100;
        console.log('content', matched);
        if (matched && Number(matched[1]) <= Number(matched[2])) {
            start = Number(matched[1]);
            end = Number(matched[2]);
        }
        const roll = random(start, end);
        await reply(msg, `${msg.sender.memberName}掷出了${roll}点(${start}-${end})`);
    }
}
