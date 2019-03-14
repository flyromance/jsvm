export default class Scope {
    private __type__;
    private __variables__;
    private __parent__;
    private __function_parent__;
    private __children__;
    /**
     * @description 创建一个Scope作用域对象，非root类型的Scope必须提供一个父级Scope，且该父级Scope的原型链顶端必为root类型的Scope
     *
     * @param {string} type
     * @param {object} parent
     * @param {(Scope | Scope[])} children
     * @memberof Scope
     */
    constructor(type: string, parent: Scope | null | undefined, children?: Scope | Scope[]);
    /**
     * @description 工厂模式创建非root类型的Scope
     *
     * @param {string} type
     * @param {(Scope | object)} parent
     * @param {(Scope | Scope[])} children
     * @returns {Scope}
     * @memberof Scope
     */
    private __create_child_scope__;
    /**
     * @description 给当前作用域添加子作用域
     *
     * @param {(Scope | Scope[])} children
     * @memberof Scope
     */
    private __add_children__;
    /**
     * @description 判断 当前作用域链 是否拥有某个变量
     *
     * @param {string} variable_name
     * @returns {boolean}
     * @memberof Scope
     */
    __has_variable_in_chain__(variable_name: string): boolean;
    /**
     * @description 判断 当前作用域 内是否拥有某个变量
     *
     * @param {string} variable_name
     * @returns {boolean}
     * @memberof Scope
     */
    __has_variable__(variable_name: string): boolean;
    /**
     * @description 根据变量名判断该变量在当前作用域的声明类型
     *
     * @param {string} variable_name
     * @returns {('var' | 'let' | 'const' | 'function' | undefined)}
     * @memberof Scope
     */
    __get_dec_type__(variable_name: string): "var" | "let" | "const" | "function" | undefined;
    /**
     * @description 根据变量名获取变量值
     *
     * @param {string} variable_name
     * @returns
     * @memberof Scope
     */
    __get__(variable_name: string): any;
    /**
     * @description 根据变量名设置变量的值
     *
     * @param {string} variable_name
     * @param {*} value
     * @returns
     * @memberof Scope
     */
    __set__(variable_name: string, value: any): any;
    /**
     * @description 删除作用域中的变量
     *
     * @param {string} variable_name
     * @returns
     * @memberof Scope
     */
    __remove__(variable_name: string): boolean;
    /**
     * @description 在当前scope声明一个var类型的变量
     *
     * @param {string} variable_name
     * @param {*} value
     * @memberof Scope
     */
    var(variable_name: string, value: any, getter_callback?: Function, setter_callback?: Function): void;
    /**
     * @description 在当前scope声明函数
     *
     * @param {string} function_name
     * @param {Function} func
     * @memberof Scope
     */
    function(function_name: string, func: Function, getter_callback?: Function, setter_callback?: Function): void;
    /**
     * @description 在当前作用域声明一个let类型的变量
     *
     * @param {string} variable_name
     * @param {*} value
     * @returns
     * @memberof Scope
     */
    let(variable_name: string, value: any, getter_callback?: Function, setter_callback?: Function): void;
    /**
     * @description 在当前作用域声明一个const类型的变量
     *
     * @param {string} variable_name
     * @param {*} value
     * @memberof Scope
     */
    const(variable_name: string, value: any, getter_callback?: Function): void;
    /**
     * @description 找出一个Scope的最近父级Function类型的Scope
     *
     * @param {(Scope | null)} scope
     * @returns {(Scope | null)}
     * @memberof Scope
     */
    private __find_parent_function_scope__;
    /**
     * @description 块级的声明，如const let
     *
     * @param {('const' | 'let')} dec_type
     * @param {string} variable_name
     * @param {*} value
     * @returns
     * @memberof Scope
     */
    private __block_declaration__;
    /**
     * @description 函数作用域的声明，如 var 和 function
     *
     * @param {('function' | 'var')} dec_type
     * @param {string} variable_name
     * @param {*} value
     * @returns
     * @memberof Scope
     */
    private __function_declaration__;
}
