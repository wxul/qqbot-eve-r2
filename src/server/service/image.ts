import { GroupMessage } from 'mirai-ts/dist/types/message-type';
import { AbstractChatService } from '../serverType';
import { reply } from '../reply';
import { download, request } from '../utils/download';
import { Message, MiraiApiHttp } from 'mirai-ts';
import config from 'config';

export abstract class AbstractImageService {
    abstract run(msg: GroupMessage): any;
}

export class ImageService extends AbstractChatService {
    private _serv: Map<string, AbstractImageService>;
    private _botApi: MiraiApiHttp;

    constructor(botApi: MiraiApiHttp) {
        super();
        this._serv = new Map();
        this._botApi = botApi;

        this.use('来点涩图', new PhotoServiceV2());
        this.use('来点二次元', new AcgService());
        this.use('来点二次元涩图', new AcgR18Service(botApi));
    }
    use(key: string, serv: AbstractImageService) {
        this._serv.set(key, serv);
    }
    run(msg: GroupMessage, content: string) {
        const k = (content || '').trim();
        if (this._serv.has(k)) {
            this._serv.get(k)?.run(msg);
        }
    }
}

interface PhotoData {
    code: number;
    msg: string;
    pic_url: string;
}

class PhotoService extends AbstractImageService {
    private url: string = 'https://api.66mz8.com/api/rand.tbimg.php?format=json';

    async run(msg: GroupMessage) {
        const res = await request<PhotoData>(`${this.url}&${Math.random()}`);
        if (res?.code === 200 && res?.pic_url) {
            reply(msg, [Message.Image(null, res.pic_url)]);
        }
    }
}

interface PhotoV2Data {
    code: string;
    type: string;
    url: string;
}

class PhotoServiceV2 extends AbstractImageService {
    private url: string = 'https://api88.net/api/img/rand/?type=json';

    async run(msg: GroupMessage) {
        const res = await request<PhotoV2Data>(`${this.url}&t=${Math.random()}`);
        if (res?.code === 'ok' && res?.url) {
            reply(msg, [Message.Image(null, res.url)]);
        }
    }
}

interface AcgData {
    code: string;
    imgurl: string;
}

class AcgService extends AbstractImageService {
    private url: string = 'http://www.dmoe.cc/random.php?return=json';
    async run(msg: GroupMessage) {
        const res = await request<AcgData>(`${this.url}&${Math.random()}`);
        if (res?.code === '200' && res?.imgurl) {
            // await download(res.imgurl, res.imgurl.substring(res.imgurl.lastIndexOf('/') + 1));
            reply(msg, [Message.Image(null, res.imgurl)]);
        } else {
            // reply(msg, );
        }
    }
}

interface AcgR18Data {
    code: number;
    msg: string;
    data: AcgR18ImageData[];
}

interface AcgR18ImageData {
    pid: number;
    url: string;
}

class AcgR18Service extends AbstractImageService {
    private url: string = 'https://api.lolicon.app/setu/';
    private _key: string;
    private _botApi: MiraiApiHttp;

    constructor(botApi: MiraiApiHttp) {
        super();
        this._key = config.get<string>('image.r18key');
        this._botApi = botApi;
    }

    async run(msg: GroupMessage) {
        const result = (await this.getMembers(msg.sender.group.id)) as Array<any>;
        if (result && result.length >= 79) {
            reply(msg, [Message.Plain('群人数超过80不提供涩图服务'), Message.Face(178, '斜眼笑')]);
        } else {
            const res = await request<AcgR18Data>(this.url, {
                params: {
                    apikey: this._key,
                    r18: 1,
                    size1200: true,
                    t: Date.now(),
                },
            });
            msg.sender.group;
            if (res?.code === 0 && res?.data.length > 0) {
                const imgurl = res.data[0].url;
                const filename = imgurl.substring(imgurl.lastIndexOf('/') + 1);
                const path = await download(imgurl, filename);
                reply(msg, [Message.Image(null, null, filename)]);
                // reply(msg, [Message.Image(null, imgurl)]);
            } else if (res?.code === 429) {
                reply(msg, [Message.Plain('撸多伤身'), Message.Face(178, '斜眼笑')]);
            }
        }
    }

    async getMembers(groupId: number) {
        const list = await this._botApi.memberList(groupId);
        return list;
    }
}
