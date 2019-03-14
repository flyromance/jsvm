// import "babel-polyfill";
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
  private __context__: Scope;
  private __callstack__: Function[];
  private __inject_vars__: object | undefined;

  /**
   * @description 创建一个JS VM的实例
   *
   * @param {object} context
   * @param {object} [args]
   * @memberof VM
   */
  constructor(context: object, args?: object) {
    super();
    this.__context__ = new Scope("root", null, []);
    this.__callstack__ = [];
    this.__context__.const("this", context);
    this.__inject_vars__ = args;

    // 将剩余需要注入的参数注入到rootScope中
    args && this.inject(args);
    this.___inject_global_variable__();
  }

  /**
   * @description JS VM创建之后的初始化
   *
   * @private
   * @param {object} context
   * @param {object} [args]
   * @memberof VM
   */
  private init(context: object, args?: object): void {
    this.__context__ = new Scope("root", null, []);
    this.__callstack__ = [];
    this.__context__.const("this", context);

    // 将剩余需要注入的参数注入到rootScope中
    if (args) Object.keys(args).forEach(prop => this.__context__.var(prop, args[prop]));
    this.___inject_global_variable__();
  }

  /**
   * @description 注入全局对象的内部方法
   *
   * @private
   * @memberof VM
   */
  private ___inject_global_variable__(): void {
    const global = {
      console,
      setTimeout,
      setInterval,
      clearTimeout,
      clearInterval,
      encodeURI,
      encodeURIComponent,
      decodeURI,
      decodeURIComponent,
      escape,
      unescape,
      Infinity,
      NaN,
      isFinite,
      isNaN,
      parseFloat,
      parseInt,
      Object,
      Function,
      Boolean,
      Error,
      EvalError,
      RangeError,
      ReferenceError,
      SyntaxError,
      TypeError,
      URIError,
      Number,
      Math,
      undefined,
      Date,
      String,
      RegExp,
      Array,
      JSON,
      Promise,
      Symbol,
      Set,
      Map
    };

    // 注入微信的全局变量wx
    // if (wx) global.wx = wx;

    Object.keys(global).forEach(prop => this.__context__.const(prop, global[prop]));
  }

  /**
   * @description 执行AST代码
   *
   * @param {ESTree.Node} ast
   * @returns {*}
   * @memberof VM
   */
  public execute(ast: ESTree.Node): any {
    if (typeof ast === "string") ast = JSON.parse(ast);
    return this.walk(ast, this.__context__);
  }

  /**
   * @description 在当前VM实例的顶级作用域上以var形式注入变量
   *
   * @param {Object} args
   * @memberof VM
   */
  public inject(args: Object): void {
    if (args) Object.keys(args).forEach(prop => this.__context__.var(prop, args[prop]));
  }

  /**
   * @description 获取当前VM实例的顶级作用域
   *
   * @returns {Scope}
   * @memberof VM
   */
  public getRootScope(): Scope {
    return this.__context__;
  }

  /**
   * @description 在提供的Scope中运行给定的AST代码
   *
   * @param {Scope} scope
   * @param {ESTree.Node} ast
   * @returns {*}
   * @memberof VM
   */
  public runInScope(scope: Scope, ast: ESTree.Node): any {
    if (scope instanceof Scope) {
      if (typeof ast === "string") ast = JSON.parse(ast);
      return this.walk(ast, scope);
    }
    throw new Error("scope must be instance of Scope");
  }

  /**
   * @description 通过变量名获取在当前JSVM实例顶级作用域上的值
   *
   * @param {string} name
   * @returns {*}
   * @memberof VM
   */
  public getVariable(name: string): any {
    return this.__context__.__get__(name);
  }

  /**
   * @description 重置当前VM，作用域还原
   *
   * @memberof VM
   */
  public reset(): void {
    const this_var = this.__context__.__get__("this");
    this.__context__ = new Scope("root", null, []);
    this.__callstack__ = [];
    this.__context__.const("this", this_var);

    // 将剩余需要注入的参数注入到rootScope中
    if (this.__inject_vars__) {
      Object.keys(this.__inject_vars__).forEach(prop =>
        this.__context__.var(prop, this.__inject_vars__ && this.__inject_vars__[prop])
      );
    }
    this.___inject_global_variable__();
  }
}
