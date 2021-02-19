import tokenizer from './tokenizer';
import parser from './parser';
import transformer from './transformer';

export function calculate(input: string) {
    const tokens = tokenizer(input);
    const parsed = parser(tokens);
    if (parsed) {
        const transformed = transformer(parsed);
        return transformed.valueOf();
    }
}