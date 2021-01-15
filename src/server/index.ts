import Mirai from 'mirai-ts';
import { GroupMessage } from 'mirai-ts/dist/types/message-type';
import { ImageService } from './service/image';
import { reply } from './reply';
import config from 'config';
import { AbstractChatService } from './serverType';
import { RollService } from './service/roll';
import { QueryService } from './service/query';

interface PrefixConfig {
    [K: string]: string;
}

const prefixConfig = config.get<PrefixConfig>('prefixConfig');

export type ChatServiceOptions = {
    DEBUG?: boolean;
    prefix: string[];
};

export type ChatService = {
    keyword: string;
    service: AbstractChatService;
};

export class ChatServer {
    private _bot: Mirai;
    private _prefix: string[];
    private _servMap: Map<string, AbstractChatService> = new Map();
    constructor(mirai: Mirai, options: ChatServiceOptions) {
        this._servMap = new Map();
        this._bot = mirai;
        this._prefix = options.prefix;

        this.use('i', new ImageService(mirai.api));
        this.use('r', new RollService());
        this.use('s', new QueryService());
    }

    use(key: string, serv: AbstractChatService) {
        this._servMap.set(key, serv);
    }

    run(msg: GroupMessage) {
        const matched = this.findPrefix(msg.plain);
        if (matched) {
            const { key, content } = matched;
            const srv = this._servMap.get(key);
            srv?.run(msg, content);
        }
    }

    startWith(text: string) {
        for (let i = 0; i < this._prefix.length; i++) {
            if (text.startsWith(this._prefix[i])) {
                return text.replace(this._prefix[i], '');
            }
        }
        return false;
    }

    findPrefix(text: string) {
        const matched = this.startWith(text);
        if (matched) {
            for (let i of this._servMap.keys()) {
                if (matched.startsWith(i)) {
                    return {
                        key: i,
                        content: matched.replace(i, ''),
                    };
                }
            }
        }
        return false;
    }

    async helper(msg: GroupMessage) {
        const content = '使用帮助：\n' + `输入 ${this._prefix[0]}${prefixConfig['query']} 三钛 查询价格\n` + `输入 ${this._prefix[0]}${prefixConfig['roll']} 1-1000 进行无聊的roll点看人品`;
        return await reply(msg, content);
    }
}
