import Mirai, { Logger, MiraiApiHttpConfig, MessageType } from 'mirai-ts';
import config from 'config';
import { ChatServer } from './server';

const QQ = config.get<number>('QQ');
const prefix = config.get<string[]>('prefix');
const mahConfig = config.get<MiraiApiHttpConfig>('consoleConfig');

// debug
const DEBUG = !!process.env['DEBUG'];

const mirai = new Mirai(mahConfig);
const log = new Logger('[eve-bot]');
async function app() {
    // 登录 QQ
    await mirai.link(QQ);

    const server = new ChatServer(mirai, {
        DEBUG: DEBUG,
        prefix: prefix,
    });

    // 对收到的消息进行处理
    // message 本质相当于同时绑定了 FriendMessage GroupMessage TempMessage
    // 你也可以单独对某一类消息进行监听
    // console.log("on message");
    mirai.on('message', (msg) => {
        // log.info(msg);
        // 复读
        //   msg.reply(msg.messageChain);

        if (msg.type === 'GroupMessage') {
            // mirai.api.memberList(msg.sender.group.id).then((res) => {
            //     console.log('members:::', res.length);
            // });
            //
            if (msg.isAt()) {
                server.helper(msg);
            } else {
                server.run(msg);
            }
        }
    });

    // 调用 mirai-ts 封装的 mirai-api-http 发送指令
    // log.print('init', 'send command help');
    // const data = await mirai.api.command.send("help", []);
    // console.log('帮助信息:' + data);

    // 处理各种事件类型
    // 事件订阅说明（名称均与 mirai-api-http 中事件名一致）
    // https://github.com/RedBeanN/node-mirai/blob/master/event.md
    // console.log("on other event");
    // https://github.com/project-mirai/mirai-api-http/blob/master/EventType.md#群消息撤回
    // mirai.on("GroupRecallEvent", ({ operator }) => {
    //   const text = `${operator.memberName} 撤回了一条消息，并拜托你不要再发色图了。`;
    //   console.log(text);
    //   mirai.api.sendGroupMessage(text, operator.group.id);
    // });

    // 开始监听
    mirai.listen();
    // 可传入回调函数对监听的函数进行处理，如：
    // mirai.listen((msg: any) => {
    //     log.info(msg);
    // });
}

app();
