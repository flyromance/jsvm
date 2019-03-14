export default class Stack {
    private stack;
    private length;
    /**
     * 入栈一个元素
     *
     * @param {(never[] | never)} params
     * @memberof Stack
     */
    push(params: never[] | never): void;
    /**
     * 出栈一个元素并返回
     *
     * @returns {never}
     * @memberof Stack
     */
    pop(): never;
    /**
     * 清空栈
     *
     * @memberof Stack
     */
    clear(): void;
    /**
     * 返回栈顶元素
     *
     * @returns {never}
     * @memberof Stack
     */
    peek(): never;
    /**
     *  查找一个元素，如果找到返回该元素举例栈顶的偏移量，未找到返回-1
     *
     * @param {never} param
     * @returns {number}
     * @memberof Stack
     */
    search(param: never): number;
}
