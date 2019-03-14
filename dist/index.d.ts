import * as ESTree from "estree";
import Scope from "./scope";
import AST_Map from "./ast_map";
export { Scope };
/**
 * @description VM主类
 *
 * @export
 * @class VM
 * @extends {AST_Map}
 */
export default class VM extends AST_Map {
    private __context__;
    private __callstack__;
    private __inject_vars__;
    /**
     * @description 创建一个JS VM的实例
     *
     * @param {object} context
     * @param {object} [args]
     * @memberof VM
     */
    constructor(context: object, args?: object);
    /**
     * @description JS VM创建之后的初始化
     *
     * @private
     * @param {object} context
     * @param {object} [args]
     * @memberof VM
     */
    private init;
    /**
     * @description 注入全局对象的内部方法
     *
     * @private
     * @memberof VM
     */
    private ___inject_global_variable__;
    /**
     * @description 执行AST代码
     *
     * @param {ESTree.Node} ast
     * @returns {*}
     * @memberof VM
     */
    execute(ast: ESTree.Node): any;
    /**
     * @description 在当前VM实例的顶级作用域上以var形式注入变量
     *
     * @param {Object} args
     * @memberof VM
     */
    inject(args: Object): void;
    /**
     * @description 获取当前VM实例的顶级作用域
     *
     * @returns {Scope}
     * @memberof VM
     */
    getRootScope(): Scope;
    /**
     * @description 在提供的Scope中运行给定的AST代码
     *
     * @param {Scope} scope
     * @param {ESTree.Node} ast
     * @returns {*}
     * @memberof VM
     */
    runInScope(scope: Scope, ast: ESTree.Node): any;
    /**
     * @description 通过变量名获取在当前JSVM实例顶级作用域上的值
     *
     * @param {string} name
     * @returns {*}
     * @memberof VM
     */
    getVariable(name: string): any;
    /**
     * @description 重置当前VM，作用域还原
     *
     * @memberof VM
     */
    reset(): void;
}
