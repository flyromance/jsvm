export default class Stack {
  private stack: never[] = [];
  private length = this.stack.length;

  /**
   * 入栈一个元素
   *
   * @param {(never[] | never)} params
   * @memberof Stack
   */
  public push(params: never[] | never): void {
    if (Array.isArray(params)) this.stack.push(...params);
    else this.stack.push(params);
  }

  /**
   * 出栈一个元素并返回
   *
   * @returns {never}
   * @memberof Stack
   */
  public pop(): never {
    return this.stack.pop()!;
  }

  /**
   * 清空栈
   *
   * @memberof Stack
   */
  public clear(): void {
    this.stack = [];
  }

  /**
   * 返回栈顶元素
   *
   * @returns {never}
   * @memberof Stack
   */
  public peek(): never {
    return this.stack[this.length - 1];
  }

  /**
   *  查找一个元素，如果找到返回该元素举例栈顶的偏移量，未找到返回-1
   *
   * @param {never} param
   * @returns {number}
   * @memberof Stack
   */
  public search(param: never): number {
    const index = this.stack.indexOf(param);
    if (index === -1) return -1;
    return this.stack.length - index - 1;
  }
}
