export function priceFormat(num: number) {
    let _n = num;
    let d = 2;
    let unit = '';
    if (_n > 100000000) {
        _n /= 100000000;
        d = 3;
        unit = '亿';
    } else if (_n > 10000) {
        _n /= 10000;
        d = 3;
        unit = '万';
    }
    d = _n % 1 === 0 ? 0 : d;
    return `${_n.toFixed(d)}${unit}`;
}
