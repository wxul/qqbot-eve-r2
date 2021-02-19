import { InvalidExpressionException } from "./errors";

/**
 * 树节点基类
 */
export abstract class TreeNode {
    children: TreeNode[];
    parentNode?: TreeNode;

    constructor(...args: TreeNode[]) {
        this.children = args.slice(0);
    }

    abstract valueOf(): number;
    abstract toString(): string;
}

/**
 * 叶子节点，叶子节点都是数字
 */
export class TreeNumber extends TreeNode {
    private _num: number;

    constructor(value: number) {
        super();
        this._num = value;
    }

    valueOf(): number {
        return this._num;
    }

    toString(): string {
        return `${this._num}`;
    }
}

/**
 * 操作符节点基类
 */
export abstract class TreeOperator extends TreeNode {
    constructor(...args: TreeNode[]) {
        super(...args);
    }
}

/**
 * 加
 */
export class TreeOperatorAdd extends TreeOperator {
    constructor(left: TreeNode, right: TreeNode) {
        super(left, right);
    }

    valueOf(): number {
        const [l, r] = this.children;
        return l.valueOf() + r.valueOf();
    }

    toString(): string {
        const [l, r] = this.children;
        return `add(${l.toString()},${r.toString()})`;
    }
}

/**
 * 减
 */
export class TreeOperatorMinus extends TreeOperator {
    constructor(left: TreeNode, right: TreeNode) {
        super(left, right);
    }

    valueOf(): number {
        const [l, r] = this.children;
        return l.valueOf() - r.valueOf();
    }

    toString(): string {
        const [l, r] = this.children;
        return `minus(${l.toString()},${r.toString()})`;
    }
}

/**
 * 乘
 */
export class TreeOperatorTimes extends TreeOperator {
    constructor(left: TreeNode, right: TreeNode) {
        super(left, right);
    }

    valueOf(): number {
        const [l, r] = this.children;
        return l.valueOf() * r.valueOf();
    }

    toString(): string {
        const [l, r] = this.children;
        return `times(${l.toString()},${r.toString()})`;
    }
}

/**
 * 除
 */
export class TreeOperatorDiv extends TreeOperator {
    constructor(left: TreeNode, right: TreeNode) {
        super(left, right);
    }

    valueOf(): number {
        const [l, r] = this.children;
        return l.valueOf() / r.valueOf();
    }

    toString(): string {
        const [l, r] = this.children;
        return `div(${l.toString()},${r.toString()})`;
    }
}

/**
 * 简单的工厂
 */
export class TreeFactory {
    static create(operator: string, ...args: TreeNode[]) {
        switch (operator) {
            case '+':
                return new TreeOperatorAdd(args[0], args[1]);
            case '-':
                return new TreeOperatorMinus(args[0], args[1]);
            case '*':
                return new TreeOperatorTimes(args[0], args[1]);
            case '/':
                return new TreeOperatorDiv(args[0], args[1]);
            default:
                throw new InvalidExpressionException('不支持的操作符')
        }
    }
}
