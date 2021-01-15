import { GroupMessage, MessageChain } from 'mirai-ts/dist/types/message-type';
import config from 'config';

const DEBUG = !!process.env['DEBUG'];
const gid = config.get<number>('debugLimit.groupId');

export async function reply(msg: GroupMessage, msgChain: string | MessageChain, quote?: boolean): Promise<void> {
    if (DEBUG) {
        if (msg.sender.group.id === gid) {
            return await msg.reply(msgChain, quote);
        }
    } else {
        return await msg.reply(msgChain, quote);
    }
}
