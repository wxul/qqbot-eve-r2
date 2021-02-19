import { InvalidNumberException, UnrecognizedCharacterException } from './errors';

/**
 * 词法分析，词法分析比较简单，可以参考 https://github.com/starkwang/the-super-tiny-compiler-cn/blob/master/super-tiny-compiler-chinese.js
 * @param input
 */
export default function tokenizer(input: string) {
    let index = 0;
    let tokens: Token[] = [];

    function isNumberStr(str: string) {
        return /^[0-9]+(\.[0-9]+)?$/.test(str);
    }

    while (index < input.length) {
        let char = input[index];

        if (char === '(' || char === ')') {
            tokens.push({
                type: TokenType.Paren,
                value: char,
            });

            index++;
            continue;
        }

        if (char === '+' || char === '-' || char === '*' || char === '/') {
            tokens.push({
                type: TokenType.Operator,
                value: char,
            });

            index++;
            continue;
        }

        if (/\s/.test(char)) {
            index++;
            continue;
        }

        if (/[0-9]/.test(char)) {
            let value = '';

            while (/[0-9\.]/.test(char)) {
                value += char;
                char = input[++index];
            }

            if (isNumberStr(value)) {
                tokens.push({
                    type: TokenType.Number,
                    value: value,
                });
            } else {
                throw new InvalidNumberException(value, index - value.length);
            }

            continue;
        }

        throw new UnrecognizedCharacterException(char, index);
    }

    return tokens;
}

export enum TokenType {
    Paren = 1,
    Number,
    Operator,
}

export interface Token {
    type: TokenType;
    value: string;
}
