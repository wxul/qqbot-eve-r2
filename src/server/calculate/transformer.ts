import { ParsedNode, ParsedNodeType } from './parser';
import { TreeNumber, TreeFactory, TreeNode } from './node';

/**
 * 转换器，parser生成的AST并不是很有利于使用，所以转换为更直观的树结构
 */
export default function transformer(root: ParsedNode) {
    return transformerE(root.children[0] as ParsedNode);

    /**
     * E   ->  T Ex
     * children[0]: T
     * children[1]: Ex
     */
    function transformerE(E: ParsedNode) {
        let p = E; // pointer
        let T1 = p.children[0] as ParsedNode;
        let T1_result = transformerT(T1); // 左侧

        let resultP: TreeNode = T1_result;

        /**
         * Ex  ->  + T Ex
         * Ex  ->  - T Ex
         */
        while ((p.children[1] as ParsedNode).children.length > 0) {
            let Ex = p.children[1] as ParsedNode;
            let op = Ex.operator; // 操作符 +-
            let T2 = Ex.children[0] as ParsedNode;
            let T2_result = transformerT(T2); // 右侧

            resultP = TreeFactory.create(op || '', resultP, T2_result);

            p = p.children[1] as ParsedNode;
        }

        return resultP;
    }

    /**
     * T   ->  F Tx
     * children[0]: F
     * children[1]: Tx
     */
    function transformerT(T: ParsedNode) {
        let p = T; // pointer
        let F1 = p.children[0] as ParsedNode;
        let F1_result = transformerF(F1); // 左侧

        let resultP: TreeNode = F1_result;

        /**
         * Tx  ->  * F Tx
         * Tx  ->  / F Tx
         * Tx  ->  null
         */
        while ((p.children[1] as ParsedNode).children.length > 0) {
            let Tx = p.children[1] as ParsedNode;
            let op = Tx.operator; // 操作符 */
            let F2 = Tx.children[0] as ParsedNode;
            let F2_result = transformerF(F2); // 右侧

            resultP = TreeFactory.create(op || '', resultP, F2_result);

            // 递归
            p = p.children[1] as ParsedNode;
        }

        return resultP;
    }

    /**
     * F   ->  number
     * F   ->  (E)
     */
    function transformerF(F: ParsedNode) {
        let value = F.children[0];
        if (typeof value === 'number') {
            // return value;
            return new TreeNumber(value);
        } else {
            return transformerE(value);
        }
    }
}
