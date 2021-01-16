import { GroupMessage, MessageChain } from 'mirai-ts/dist/types/message-type';
import config from 'config';
import { MessageResult } from './serverType';
import { Message, MiraiApiHttp } from 'mirai-ts';

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

export async function replyAndRecall(api: MiraiApiHttp, msg: GroupMessage, msgChain: string | MessageChain, quote?: boolean) {
    let msgList: MessageChain = typeof msgChain === 'string' ? [Message.Plain(msgChain)] : msgChain.slice(0);
    // msgList.push(Message.Plain('十秒后撤回'));
    const result = ((await reply(msg, msgList, quote)) as unknown) as MessageResult;
    if (result?.code === 0 && result?.msg === 'success' && result?.messageId) {
        setTimeout(() => {
            api.recall(result.messageId);
        }, 10000);
    }
}
