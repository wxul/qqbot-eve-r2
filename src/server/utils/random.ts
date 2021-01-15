export function random(start: number, end: number) {
    if (end < start) return 0;
    return ~~(Math.random() * (end - start + 1) + start);
}
