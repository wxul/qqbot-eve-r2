import { GroupMessage } from 'mirai-ts/dist/types/message-type';
import { AbstractChatService } from '../serverType';
import { reply } from '../reply';
import axios, { AxiosRequestConfig } from 'axios';
import { request } from '../utils/download';
import { priceFormat } from '../utils/format';

interface SearchNameData {
    typeid: number;
    typename: string;
}

interface PriceData {
    max: number;
    min: number;
    volume: number;
}

interface PriceResponseData {
    all: PriceData;
    buy: PriceData;
    sell: PriceData;
}

interface PriceResultData {
    name: string;
    maxBuy: number;
    minSell: number;
    buyVolumn: number;
}

export class QueryService extends AbstractChatService {
    private api: string = 'https://www.ceve-market.org/api';
    private searchname: string = '/searchname';
    private query: string = '/market/region/10000002/type/{TypeId}.json';

    constructor() {
        super();
    }
    async run(msg: GroupMessage, content: string) {
        if (content && content.trim()) {
            const good = content.trim();
            const list = await this.searchName(good);
            if (list && list.length > 0) {
                const result = await this.queryPrice(list);
                const parsedResult = this.parse(result);
                if (parsedResult) {
                    reply(msg, parsedResult);
                }
            } else {
                reply(msg, `没有查到物品: ${good}`);
            }
        }
    }

    async searchName(name: string) {
        try {
            const param = new URLSearchParams();
            param.append('name', name);
            const res = await axios.post(this.api + this.searchname, param, {
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                },
                responseType: 'json',
            });
            if (res?.data) {
                return res.data as SearchNameData[];
            }
        } catch (error) {}
    }

    async querySinglePrice(id: number) {
        try {
            const url = (this.api + this.query).replace('{TypeId}', `${id}`);
            const res = await request<PriceResponseData>(url, {
                responseType: 'json',
            });
            if (res) {
                return res;
            }
        } catch (error) {}
    }

    async queryPrice(ids: SearchNameData[]) {
        let result: PriceResultData[] = [];
        for (let i = 0; i < ids.length; i++) {
            const res = await this.querySinglePrice(ids[i].typeid);
            if (res) {
                result.push({
                    name: ids[i].typename,
                    maxBuy: res.buy.max,
                    minSell: res.sell.min,
                    buyVolumn: res.buy.volume,
                });
            }
        }
        return result;
    }

    parse(prices: PriceResultData[]) {
        if (!prices || prices.length === 0) return null;
        // sort
        let _p = prices.sort((a, b) => {
            return a.name.length - b.name.length;
        });
        let str = '名称\t\t\t最低出售\t\t最高收购\r\n';
        _p.forEach((p) => {
            str += `${p.name}: \t${priceFormat(p.minSell)} \t${priceFormat(p.maxBuy)}\r\n`;
        });
        return str;
    }
}
