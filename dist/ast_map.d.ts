import * as ESTree from "estree";
import Scope from "./scope";
import Break_Signal from "./break_signal";
/**
 * @description 语法节点对应的执行映射类
 * @description 可以使用for of，TS会翻译为for
 *
 * @export
 * @class AST_Map
 */
export default class AST_Map extends Break_Signal {
    protected WalkCount: number;
    constructor();
    /**
     * @description 递归解释执行AST的分步函数
     *
     * @param {ESTree.Node} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    walk(node: ESTree.Node, scope: Scope, ...args: any[]): any;
    /**
     * @description AST的根节点 从此处开始执行 body包含一系列的语句
     *
     * @param {ESTree.Program} program
     * @param {Scope} scope
     * @memberof AST_Map
     */
    Program(program: ESTree.Program, scope: Scope): void;
    /**
     * @description 标识符 返回可操作的空间位，若不存在该标识符则抛出错误
     *
     * @param {ESTree.Identifier} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    Identifier(node: ESTree.Identifier, scope: Scope): any;
    /**
     * @description 字面量 直接返回
     *
     * @param {ESTree.Literal} node
     * @param {Scope} scope
     * @returns {*}
     * @memberof AST_Map
     */
    Literal(node: ESTree.Literal, scope: Scope): any;
    /**
     * @description 块声明 包含一系列的语句， 大括号{}包含的语句
     *
     * @param {ESTree.BlockStatement} block
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    BlockStatement(block: ESTree.BlockStatement, scope: Scope): any;
    /**
     * @description 空的语句，例如一个 ;
     *
     * @param {ESTree.EmptyStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    EmptyStatement(node: ESTree.EmptyStatement, scope: Scope): void;
    /**
     * @description debugger语句
     *
     * @param {ESTree.DebuggerStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    DebuggerStatement(node: ESTree.DebuggerStatement, scope: Scope): void;
    /**
     * @description 一个表达式语句，内部包含一个表达式，直接执行内部的表达式
     *
     * @param {ESTree.ExpressionStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    ExpressionStatement(node: ESTree.ExpressionStatement, scope: Scope): void;
    /**
     * @description return语句， 如果参数为表达式，则继续执行
     *
     * @param {ESTree.ReturnStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ReturnStatement(node: ESTree.ReturnStatement, scope: Scope): object;
    /**
     * @todo 未实现，待调研，底层语言可使用goto实现
     * @description 标签标记语法, 非常罕见的一个JavaScript语法 参见：{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/label}
     *
     * @param {ESTree.LabeledStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    LabeledStatement(node: ESTree.LabeledStatement, scope: Scope): void;
    /**
     * @description break语句，跳出当前正在执行的循环体或者switch
     * @description 配合LabeledStatement可以实现非当前执行体的跳出，但该功能目前未实现
     *
     * @param {ESTree.BreakStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    BreakStatement(node: ESTree.BreakStatement, scope: Scope): {};
    /**
     * @description continue语句，跳出本次循环
     * @description 配合LabeledStatement可以实现非当前执行体的当次跳出，但该功能目前未实现
     *
     * @param {ESTree.ContinueStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ContinueStatement(node: ESTree.ContinueStatement, scope: Scope): object;
    /**
     * @description if 语句，首先判断test条件是否成立，如果成立执行consequent，否则执行alternate
     * 作用域在子集的BlockStatement中创建
     *
     * @param {ESTree.IfStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    IfStatement(node: ESTree.IfStatement, scope: Scope): any;
    /**
     * @description switch语句，多分支判断语句
     *
     * @param {ESTree.SwitchStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    SwitchStatement(node: ESTree.SwitchStatement, scope: Scope): any;
    /**
     * @description switch 的 case 语句
     *
     * @param {ESTree.SwitchCase} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    SwitchCase(node: ESTree.SwitchCase, scope: Scope): any;
    /**
     * @description with 语句， ES5严格模式下会被禁用
     * 实现目标为严格模式，取消with语句支持 2018.06.25
     *
     * @param {ESTree.WithStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    WithStatement(node: ESTree.WithStatement, scope: Scope): void;
    /**
     * @description throw 语句
     *
     * @param {ESTree.ThrowStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    ThrowStatement(node: ESTree.ThrowStatement, scope: Scope): void;
    /**
     * @description try catch finally结构语句
     *
     * @param {ESTree.TryStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    TryStatement(node: ESTree.TryStatement, scope: Scope): any;
    /**
     * @description catch子句
     *
     * @param {ESTree.CatchClause} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    CatchClause(node: ESTree.CatchClause, scope: Scope): any;
    /**
     * @description while语句
     *
     * @param {ESTree.WhileStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    WhileStatement(node: ESTree.WhileStatement, scope: Scope): any;
    /**
     * @description do while 语句
     *
     * @param {ESTree.DoWhileStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    DoWhileStatement(node: ESTree.DoWhileStatement, scope: Scope): any;
    /**
     * @description for 循环语句
     *
     * @param {ESTree.ForStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ForStatement(node: ESTree.ForStatement, scope: Scope): any;
    /**
     * @description for in 语句
     *
     * @param {ESTree.ForInStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ForInStatement(node: ESTree.ForInStatement, scope: Scope): any;
    /**
     * @description 函数声明
     *
     * @param {ESTree.FunctionDeclaration} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    FunctionDeclaration(node: ESTree.FunctionDeclaration, scope: Scope): void;
    /**
     * @description 函数表达式，几乎和函数声明的逻辑一致
     *
     * @param {ESTree.FunctionExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    FunctionExpression(node: ESTree.FunctionExpression, scope: Scope): (...args: any[]) => any;
    /**
     * @description 变量声明语句
     *
     * @param {ESTree.VariableDeclaration} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    VariableDeclaration(node: ESTree.VariableDeclaration, scope: Scope): void;
    /**
     * @description 变量声明的子节点，暂时没有用到，该节点的相关实现都写在了VariableDeclaration节点中
     *
     * @param {ESTree.VariableDeclarator} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    VariableDeclarator(node: ESTree.VariableDeclarator, scope: Scope): void;
    /**
     * @description this 语句 ES5规定在非严格模式下，this为global对象或者所属的对象，在严格模式下，只能是null或者所属对象
     * @description 小程序目前打开ES6转译ES5就会默认启用严格模式，所以此处没有找到this直接返回null
     *
     * @param {ESTree.ThisExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ThisExpression(node: ESTree.ThisExpression, scope: Scope): any;
    /**
     * @description 数组表达式 []
     *
     * @param {ESTree.ArrayExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ArrayExpression(node: ESTree.ArrayExpression, scope: Scope): never[];
    /**
     * @description {} 对象表达式，循环遍历属性值并赋值为一个对象属性，最后返回该对象
     *
     * @param {ESTree.ObjectExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ObjectExpression(node: ESTree.ObjectExpression, scope: Scope): {};
    /**
     * @description ObjectExpression节点中properties的类型
     *
     * @param {ESTree.Property} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    Property(node: ESTree.Property, scope: Scope, target: Object, auxiliaryGetterMap: Object, auxiliarySetterMap: Object): void;
    /**
     * @description  ...展开语法，当前为实验性实现
     *
     * @param {ESTree.SpreadElement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    SpreadElement(node: ESTree.SpreadElement, scope: Scope, target: Object): void;
    /**
     * @todo delete操作符实现的比较有争议，需要重构
     * @description 一元运算符表达式
     *
     * @param {ESTree.UnaryExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    UnaryExpression(node: ESTree.UnaryExpression, scope: Scope): number | boolean | "string" | "number" | "boolean" | "symbol" | "undefined" | "object" | "function" | undefined;
    /**
     * @description ++ --更新表达式
     *
     * @param {ESTree.UpdateExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    UpdateExpression(node: ESTree.UpdateExpression, scope: Scope): number;
    /**
     * @description 二元运算符表达式
     *
     * @param {ESTree.BinaryExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    BinaryExpression(node: ESTree.BinaryExpression, scope: Scope): any;
    /**
     * @todo 实现存在问题 需要重构
     * @description 赋值表达式
     *
     * @param {ESTree.AssignmentExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    AssignmentExpression(node: ESTree.AssignmentExpression, scope: Scope): any;
    /**
     * @description || 和 && 的逻辑表达式
     *
     * @param {ESTree.LogicalExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    LogicalExpression(node: ESTree.LogicalExpression, scope: Scope): any;
    /**
     * @description . 成员运算符
     *
     * @param {ESTree.MemberExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    MemberExpression(node: ESTree.MemberExpression, scope: Scope): any;
    /**
     * @description ? : 三元运算符表达式
     *
     * @param {ESTree.ConditionalExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ConditionalExpression(node: ESTree.ConditionalExpression, scope: Scope): any;
    /**
     * @description 调用表达式
     *
     * @param {ESTree.CallExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    CallExpression(node: ESTree.CallExpression, scope: Scope): any;
    /**
     * @todo 实现是否存在问题有待商榷
     * @description new 运算符表达式
     *
     * @param {ESTree.NewExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    NewExpression(node: ESTree.NewExpression, scope: Scope): any;
    /**
     * @description , 逗号运算符组成的序列表达式
     *
     * @param {ESTree.SequenceExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    SequenceExpression(node: ESTree.SequenceExpression, scope: Scope): any;
    ClassDeclaration(node: ESTree.ClassDeclaration, scope: Scope): void;
    ClassExpression(node: ESTree.ClassExpression, scope: Scope): void;
    ClassBody(node: ESTree.ClassBody, scope: Scope): void;
    Super(node: ESTree.Super, scope: Scope): void;
    MethodDefinition(node: ESTree.MethodDefinition, scope: Scope): void;
    TemplateLiteral(node: ESTree.TemplateLiteral, scope: Scope): void;
    TemplateElement(node: ESTree.TemplateElement, scope: Scope): void;
    TaggedTemplateExpression(node: ESTree.TaggedTemplateExpression, scope: Scope): void;
    ObjectPattern(node: ESTree.ObjectPattern, scope: Scope): void;
    AssignmentPattern(node: ESTree.AssignmentPattern, scope: Scope): void;
    ArrayPattern(node: ESTree.ArrayPattern, scope: Scope): void;
    RestElement(node: ESTree.RestElement, scope: Scope): void;
    MetaProperty(node: ESTree.MetaProperty, scope: Scope): void;
    AwaitExpression(node: ESTree.AwaitExpression, scope: Scope): void;
    ForOfStatement(node: ESTree.ForOfStatement, scope: Scope): void;
    YieldExpression(node: ESTree.YieldExpression, scope: Scope): void;
    ArrowFunctionExpression(node: ESTree.ArrowFunctionExpression, scope: Scope): void;
    AssignmentProperty(node: ESTree.AssignmentProperty, scope: Scope): void;
    ImportDeclaration(node: ESTree.ImportDeclaration, scope: Scope): void;
    ImportSpecifier(node: ESTree.ImportSpecifier, scope: Scope): void;
    ImportDefaultSpecifier(node: ESTree.ImportDefaultSpecifier, scope: Scope): void;
    ImportNamespaceSpecifier(node: ESTree.ImportNamespaceSpecifier, scope: Scope): void;
    ExportSpecifier(node: ESTree.ExportSpecifier, scope: Scope): void;
    ExportNamedDeclaration(node: ESTree.ExportNamedDeclaration, scope: Scope): void;
    ExportDefaultDeclaration(node: ESTree.ExportDefaultDeclaration, scope: Scope): void;
    ExportAllDeclaration(node: ESTree.ExportAllDeclaration, scope: Scope): void;
}
