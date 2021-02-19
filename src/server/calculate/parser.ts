import { Token, TokenType } from './tokenizer';
import { InvalidExpressionException } from './errors';

// 简单的可使用递归下降的四则运算文法
// S   ->  E
// E   ->  T Ex
// Ex  ->  + T Ex
// Ex  ->  - T Ex
// Ex  ->  null
// T   ->  F Tx
// Tx  ->  * F Tx
// Tx  ->  / F Tx
// Tx  ->  null
// F   ->  number
// F   ->  -number
// F   ->  (E)

/**
 * 语法分析，四则运算的分析需要用到文法分析，相关内容可以参考 https://zhuanlan.zhihu.com/p/24035780
 * @param tokens
 */
export default function parser(tokens: Token[]) {
    let index = 0;

    function next() {
        return tokens[index++];
    }

    let root = new ParsedNode(ParsedNodeType.S);
    let p = root;

    let token = next();

    if (E() && !next()) {
        return root;
    } else {
        return false;
    }

    // 根据文法扩写

    /**
     * E   ->  T Ex
     */
    function E() {
        let node = new ParsedNode(ParsedNodeType.E);
        p.children.push(node);
        p = node;
        if (T()) {
            p = node;
            return Ex();
        } else {
            return false;
        }
    }

    /**
     * Ex  ->  + T Ex
     * Ex  ->  - T Ex
     * Ex  ->  null
     */
    function Ex(): any {
        let node = new ParsedNode(ParsedNodeType.Ex);
        p.children.push(node);
        p = node;
        if (token && (token.value === '+' || token.value === '-')) {
            p.operator = token.value;
            token = next();
            if (T()) {
                p = node;
                return Ex();
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * T   ->  F Tx
     */
    function T() {
        let node = new ParsedNode(ParsedNodeType.T);
        p.children.push(node);
        p = node;
        if (F()) {
            p = node;
            return Tx();
        } else {
            return false;
        }
    }

    /**
     * Tx  ->  * F Tx
     * Tx  ->  / F Tx
     * Tx  ->  null
     */
    function Tx(): any {
        let node = new ParsedNode(ParsedNodeType.Tx);
        p.children.push(node);
        p = node;
        if (token && (token.value === '*' || token.value === '/')) {
            p.operator = token.value;
            token = next();
            if (F()) {
                p = node;
                return Tx();
            } else {
                return false;
            }
        }
        return true;
    }

    /**
     * F   ->  number
     * F   ->  -number
     * F   ->  (E)
     */
    function F() {
        let node = new ParsedNode(ParsedNodeType.F);
        p.children.push(node);
        p = node;
        if (token && token.value === '(') {
            token = next();
            if (!E()) {
                return false;
            } else if (!token || token.value !== ')') {
                // return false;
                throw new InvalidExpressionException(token?.value || '(none)');
            }
            token = next();
            return true;
        } else if (token && isNumberValue(token.value)) {
            p.children.push(Number(token.value));
            token = next();
            return true;
        } else if (token && token.value === '-') {
            token = next();
            if (!isNumberValue(token.value)) {
                throw new InvalidExpressionException(token?.value || '(none)');
            }
            p.children.push(0 - Number(token.value));
            token = next();
            return true;
        }
        // return false;
        throw new InvalidExpressionException(token?.value || '(none)');
    }

    function isNumberValue(num: string) {
        return /^[0-9]+(\.[0-9]+)?$/.test(num);
    }
}

export enum ParsedNodeType {
    S = 'root',
    E = '表达式',
    Ex = '加减表达式',
    T = '项',
    Tx = '乘除项',
    F = '因子',
}

export class ParsedNode {
    type: ParsedNodeType;
    operator?: string;
    children: (ParsedNode | number)[];

    constructor(type: ParsedNodeType, operator?: string) {
        this.type = type;
        this.operator = operator;
        this.children = [];
    }
}
