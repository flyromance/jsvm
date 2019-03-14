(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["jsvm"] = factory();
	else
		root["jsvm"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ast_map.ts":
/*!************************!*\
  !*** ./src/ast_map.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const constant_table_1 = __webpack_require__(/*! ./constant_table */ "./src/constant_table.ts");
const scope_1 = __webpack_require__(/*! ./scope */ "./src/scope.ts");
const break_signal_1 = __webpack_require__(/*! ./break_signal */ "./src/break_signal.ts");
// import Stack from './stack';
/**
 * @description 语法节点对应的执行映射类
 * @description 可以使用for of，TS会翻译为for
 *
 * @export
 * @class AST_Map
 */
class AST_Map extends break_signal_1.default {
    // protected ObjectPropertyAuxiliaryStack = new Stack();
    constructor() {
        super();
        this.WalkCount = 0;
    }
    /**
     * @description 递归解释执行AST的分步函数
     *
     * @param {ESTree.Node} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    walk(node, scope, ...args) {
        this.WalkCount++;
        return this[node.type](node, scope, ...args);
    }
    /**
     * @description AST的根节点 从此处开始执行 body包含一系列的语句
     *
     * @param {ESTree.Program} program
     * @param {Scope} scope
     * @memberof AST_Map
     */
    Program(program, scope) {
        for (const node of program.body)
            this.walk(node, scope);
    }
    /**
     * @description 标识符 返回可操作的空间位，若不存在该标识符则抛出错误
     *
     * @param {ESTree.Identifier} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    Identifier(node, scope) {
        return scope.__get__(node.name);
    }
    /**
     * @description 字面量 直接返回
     *
     * @param {ESTree.Literal} node
     * @param {Scope} scope
     * @returns {*}
     * @memberof AST_Map
     */
    Literal(node, scope) {
        return node.regex
            ? new RegExp(node.regex.pattern, node.regex.flags)
            : node.value;
    }
    /**
     * @description 块声明 包含一系列的语句， 大括号{}包含的语句
     *
     * @param {ESTree.BlockStatement} block
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    BlockStatement(block, scope) {
        // @todo 此处可以判定是否需要创建作用域，需要Scope内部支持
        let new_scope = new scope_1.default("block", scope);
        for (const node of block.body) {
            const result = this.walk(node, new_scope);
            if (this.isBreakSignal(result) || this.isContinueSignal(result) || this.isReturnSignal(result)) {
                return result;
            }
        }
    }
    /**
     * @description 空的语句，例如一个 ;
     *
     * @param {ESTree.EmptyStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    EmptyStatement(node, scope) {
        /* do nothing */
    }
    /**
     * @description debugger语句
     *
     * @param {ESTree.DebuggerStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    DebuggerStatement(node, scope) {
        debugger;
    }
    /**
     * @description 一个表达式语句，内部包含一个表达式，直接执行内部的表达式
     *
     * @param {ESTree.ExpressionStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    ExpressionStatement(node, scope) {
        this.walk(node.expression, scope);
    }
    /**
     * @description return语句， 如果参数为表达式，则继续执行
     *
     * @param {ESTree.ReturnStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ReturnStatement(node, scope) {
        return this.createReturnSignal(node.argument ? this.walk(node.argument, scope) : undefined);
    }
    /**
     * @todo 未实现，待调研，底层语言可使用goto实现
     * @description 标签标记语法, 非常罕见的一个JavaScript语法 参见：{@link https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/label}
     *
     * @param {ESTree.LabeledStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    LabeledStatement(node, scope) {
        throw `${node.type} 未实现`;
    }
    /**
     * @description break语句，跳出当前正在执行的循环体或者switch
     * @description 配合LabeledStatement可以实现非当前执行体的跳出，但该功能目前未实现
     *
     * @param {ESTree.BreakStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    BreakStatement(node, scope) {
        return this.createBreakSignal();
    }
    /**
     * @description continue语句，跳出本次循环
     * @description 配合LabeledStatement可以实现非当前执行体的当次跳出，但该功能目前未实现
     *
     * @param {ESTree.ContinueStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ContinueStatement(node, scope) {
        return this.createContinueSignal();
    }
    /**
     * @description if 语句，首先判断test条件是否成立，如果成立执行consequent，否则执行alternate
     * 作用域在子集的BlockStatement中创建
     *
     * @param {ESTree.IfStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    IfStatement(node, scope) {
        if (this.walk(node.test, scope))
            return this.walk(node.consequent, scope);
        else if (node.alternate)
            return this.walk(node.alternate, scope);
    }
    /**
     * @description switch语句，多分支判断语句
     *
     * @param {ESTree.SwitchStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    SwitchStatement(node, scope) {
        // 执行discriminant(Expression)得到运算结果，将结果挨个与cases中的SwitchCase中的test执行结果比对(使用严格等于)
        // 若存在第n个SwitchCase的test执行结果与discriminant的结果匹配，则执行此SwitchStatement中的consequent([ Statement ])
        // 若该SwitchStatement中的consequent存在break语句，则跳过后续执行，直接return
        // 若该SwitchStatement中的consequent不存在break语句，则执行第n+1个SwitchCase
        // 循环执行以上两个步骤到default(test==null)语句
        // 若不存在，则执行default(test==null)语句
        const discriminant = this.walk(node.discriminant, scope);
        const new_scope = new scope_1.default("switch", scope);
        let matched = false;
        for (const $case of node.cases) {
            // 进行匹配相应的 case
            if (!matched && (!$case.test || discriminant === this.walk($case.test, new_scope))) {
                matched = true;
            }
            if (matched) {
                const result = this.walk($case, new_scope);
                if (this.isBreakSignal(result)) {
                    break;
                }
                else if (this.isContinueSignal(result) || this.isReturnSignal(result)) {
                    return result;
                }
            }
        }
    }
    /**
     * @description switch 的 case 语句
     *
     * @param {ESTree.SwitchCase} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    SwitchCase(node, scope) {
        // test == null的case为default语句
        // SwitchCase不单独创建作用域，共享Switch创建的作用域
        for (const stmt of node.consequent) {
            const result = this.walk(stmt, scope);
            if (this.isBreakSignal(result) || this.isContinueSignal(result) || this.isReturnSignal(result)) {
                return result;
            }
        }
    }
    /**
     * @description with 语句， ES5严格模式下会被禁用
     * 实现目标为严格模式，取消with语句支持 2018.06.25
     *
     * @param {ESTree.WithStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    WithStatement(node, scope) {
        // 按照原则此处的Scope类型应该为with，但是声明为with需要修改
        // const new_scope = new Scope('function', scope);
        // const injectObj = this.walk(node.object, scope);
        // Object.keys(injectObj).forEach(key => {
        //     new_scope.var(key, injectObj[key]);
        // });
        // this.walk(node.body, new_scope);
        throw SyntaxError("Strict mode code may not include a with statement");
    }
    /**
     * @description throw 语句
     *
     * @param {ESTree.ThrowStatement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    ThrowStatement(node, scope) {
        throw this.walk(node.argument, scope);
    }
    /**
     * @description try catch finally结构语句
     *
     * @param {ESTree.TryStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    TryStatement(node, scope) {
        // 如果handler是null那么finalizer必然存在
        try {
            return this.walk(node.block, new scope_1.default("try", scope));
        }
        catch (err) {
            if (node.handler) {
                const param = node.handler.param;
                const new_scope = new scope_1.default("catch", scope);
                new_scope.const(param.name, err);
                return this.walk(node.handler, new_scope);
            }
            else {
                throw err;
            }
        }
        finally {
            if (node.finalizer) {
                // 增加了判断 如果finally中有返回信号才返回 否则不返回
                const result = this.walk(node.finalizer, new scope_1.default("finally", scope));
                if (this.isReturnSignal(result))
                    return result;
            }
        }
    }
    /**
     * @description catch子句
     *
     * @param {ESTree.CatchClause} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    CatchClause(node, scope) {
        return this.walk(node.body, scope);
    }
    /**
     * @description while语句
     *
     * @param {ESTree.WhileStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    WhileStatement(node, scope) {
        while (this.walk(node.test, scope)) {
            const new_scope = new scope_1.default("while", scope);
            const result = this.walk(node.body, new_scope);
            if (this.isBreakSignal(result)) {
                break;
            }
            else if (this.isContinueSignal(result)) {
                continue;
            }
            else if (this.isReturnSignal(result)) {
                return result;
            }
        }
    }
    /**
     * @description do while 语句
     *
     * @param {ESTree.DoWhileStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    DoWhileStatement(node, scope) {
        do {
            const new_scope = new scope_1.default("dowhile", scope);
            const result = this.walk(node.body, new_scope);
            if (this.isBreakSignal(result)) {
                break;
            }
            else if (this.isContinueSignal(result)) {
                continue;
            }
            else if (this.isReturnSignal(result)) {
                return result;
            }
        } while (this.walk(node.test, scope));
    }
    /**
     * @description for 循环语句
     *
     * @param {ESTree.ForStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ForStatement(node, scope) {
        // @todo 以下获取循环初始化变量的代码可能是无用的
        const initKeys = [];
        if (node.init && node.init.type && node.init.type === "VariableDeclaration" && node.init.kind === "let") {
            node.init.declarations.forEach(vd => {
                if (vd.id.name)
                    initKeys.push(vd.id.name);
            });
        }
        for (const new_scope = new scope_1.default("for", scope), init_val = node.init ? this.walk(node.init, new_scope) : null; node.test ? this.walk(node.test, new_scope) : true; node.update ? this.walk(node.update, new_scope) : void 0) {
            const bodyScope = new scope_1.default("for_body", new_scope);
            const result = this.walk(node.body, bodyScope);
            // @todo 循环复制变量到当前循环体的作用域中可能是无用的
            // initKeys.forEach(key => bodyScope.let(key, new_scope[key]));
            initKeys.forEach(key => bodyScope.let(key, new_scope.__get__(key)));
            if (this.isBreakSignal(result)) {
                break;
            }
            else if (this.isContinueSignal(result)) {
                continue;
            }
            else if (this.isReturnSignal(result)) {
                return result;
            }
        }
    }
    /**
     * @description for in 语句
     *
     * @param {ESTree.ForInStatement} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ForInStatement(node, scope) {
        let kind = "var", name;
        if (node.left.type === "Identifier") {
            name = node.left.name;
        }
        else {
            const decl = node.left.declarations[0];
            name = decl.id.name;
            kind = node.left.kind;
        }
        for (const value in this.walk(node.right, scope)) {
            const new_scope = new scope_1.default("forin", scope);
            new_scope[kind](name, value);
            const result = this.walk(node.body, new_scope);
            if (this.isBreakSignal(result)) {
                break;
            }
            else if (this.isContinueSignal(result)) {
                continue;
            }
            else if (this.isReturnSignal(result)) {
                return result;
            }
        }
    }
    /**
     * @description 函数声明
     *
     * @param {ESTree.FunctionDeclaration} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    FunctionDeclaration(node, scope) {
        // FunctionDeclaration和FunctionExpression的唯一不同是FunctionDeclaration中的id(函数名标识符)
        // 不能为null(当函数为export default function中的函数时，可以为空)，而FunctionExpression的id可以为null
        // 当前实现：id如果为空，直接抛出语法异常
        const func = this.FunctionExpression(node, scope);
        let name = "";
        if (node && node.id && node.id.name)
            name = node.id.name;
        else
            throw new SyntaxError("Function must have a name as its identifier");
        scope.function(name, func);
    }
    /**
     * @description 函数表达式，几乎和函数声明的逻辑一致
     *
     * @param {ESTree.FunctionExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    FunctionExpression(node, scope) {
        const self = this;
        const func = function (...args) {
            const new_scope = new scope_1.default("function", scope);
            for (let i = 0; i < node.params.length; i++) {
                const { name } = node.params[i];
                new_scope.var(name, args[i]);
            }
            new_scope.const("this", this);
            new_scope.const("arguments", arguments);
            // 在当前函数环境注入函数名称
            let name = "";
            if (node && node.id && node.id.name) {
                name = node.id.name;
                new_scope.function(name, func);
            }
            const result = self.walk(node.body, new_scope);
            if (self.isReturnSignal(result)) {
                return result.data;
            }
        };
        return func;
    }
    /**
     * @description 变量声明语句
     *
     * @param {ESTree.VariableDeclaration} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    VariableDeclaration(node, scope) {
        const kind = node.kind;
        for (const declartor of node.declarations) {
            // 声明const类型没有初始化抛出异常
            if (kind === "const" && !declartor.init)
                throw new SyntaxError("Missing initializer in const declaration");
            const { name } = declartor.id;
            const value = declartor.init === null ? constant_table_1.default.NON_EXISTENT_INIT : this.walk(declartor.init, scope);
            scope[kind](name, value);
        }
    }
    /**
     * @description 变量声明的子节点，暂时没有用到，该节点的相关实现都写在了VariableDeclaration节点中
     *
     * @param {ESTree.VariableDeclarator} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    VariableDeclarator(node, scope) {
        // VariableDeclarator的父节点类型必为VariableDeclaration，相关操作已经在VariableDeclaration中直接执行了，本函数并没有调用
    }
    /**
     * @description this 语句 ES5规定在非严格模式下，this为global对象或者所属的对象，在严格模式下，只能是null或者所属对象
     * @description 小程序目前打开ES6转译ES5就会默认启用严格模式，所以此处没有找到this直接返回null
     *
     * @param {ESTree.ThisExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ThisExpression(node, scope) {
        return scope.__has_variable_in_chain__("this") ? scope.__get__("this") : null;
    }
    /**
     * @description 数组表达式 []
     *
     * @param {ESTree.ArrayExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ArrayExpression(node, scope) {
        const target = [];
        // scope.const('[[TARGET]]', target);
        node.elements.forEach(item => {
            target.push(this.walk(item, scope, target));
        });
        // scope.__remove__('[[TARGET]]');
        return target;
    }
    /**
     * @description {} 对象表达式，循环遍历属性值并赋值为一个对象属性，最后返回该对象
     *
     * @param {ESTree.ObjectExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ObjectExpression(node, scope) {
        // 方案 1：在当前Scope注入一个变量名唯一的目标object，其他property节点添加属性到该Object，然后取出该值，在当前Scope删除后返回该值，避免使用Object.assign
        const target = {};
        const auxiliaryGetterMap = {};
        const auxiliarySetterMap = {};
        // scope.const('[[TARGET]]', target);
        node.properties.forEach(property => this.walk(property, scope, target, auxiliaryGetterMap, auxiliarySetterMap));
        // scope.__remove__('[[TARGET]]');
        const getterKeys = Object.keys(auxiliaryGetterMap);
        const setterKeys = Object.keys(auxiliarySetterMap);
        if (getterKeys.length !== 0 || setterKeys.length !== 0) {
            const keys = [...new Set(getterKeys.concat(...setterKeys))];
            for (let i = 0; i < keys.length; i++) {
                Object.defineProperty(target, keys[i], { set: auxiliarySetterMap[keys[i]], get: auxiliaryGetterMap[keys[i]] });
            }
        }
        return target;
        // 方案 2：直接使用Object.assign合并各个字句返回的对象
        // return Object.assign({}, ...node.properties.map(property => this.walk(property, scope)));
    }
    /**
     * @description ObjectExpression节点中properties的类型
     *
     * @param {ESTree.Property} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    Property(node, scope, target, auxiliaryGetterMap, auxiliarySetterMap) {
        // 注释的部分取决于ObjectExpression的实现方式
        const kind = node.kind;
        // const object = {};
        let key;
        if (node.key.type === "Literal") {
            key = node.key.value;
        }
        else if (node.key.type === "Identifier") {
            key = node.key.name;
        }
        else {
            throw new Error("Key of object must be Literal or Identifier, please check your code of ObjectExpression");
        }
        // const target = scope.__get__('[[TARGET]]');
        const value = this.walk(node.value, scope);
        if (kind === "init") {
            // object[key] = value
            target[key] = value;
        }
        else if (kind === "set") {
            // Object.defineProperty(object, key, { set: value });
            // Object.defineProperty(target, key, { set: value });
            auxiliarySetterMap[key] = value;
        }
        else if (kind === "get") {
            // Object.defineProperty(object, key, { get: value });
            // Object.defineProperty(target, key, { get: value });
            auxiliaryGetterMap[key] = value;
        }
        else {
            throw new Error("声明对象的属性必须为初始化，getter或者setter，请检查你对象声明的表达式");
        }
        // return object;
    }
    /**
     * @description  ...展开语法，当前为实验性实现
     *
     * @param {ESTree.SpreadElement} node
     * @param {Scope} scope
     * @memberof AST_Map
     */
    SpreadElement(node, scope, target) {
        // const target = scope.__get__('[[TARGET]]');
        const param = this.walk(node.argument, scope);
        if (Array.isArray(target)) {
            if (param[Symbol.iterator] && typeof param[Symbol.iterator] === "function") {
                const iterator = param[Symbol.iterator]();
                let pointer;
                while (!(pointer = iterator.next()).done) {
                    target.push(pointer.value);
                }
            }
            else {
                throw TypeError(`${param} is not iterable`);
            }
        }
        else if (typeof target === "object") {
            // Object.keys(param).forEach(key => target[key] = param[key]);
            Object.assign(target, param);
        }
    }
    /**
     * @todo delete操作符实现的比较有争议，需要重构
     * @description 一元运算符表达式
     *
     * @param {ESTree.UnaryExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    UnaryExpression(node, scope) {
        const that = this;
        const typeofFunc = variable => typeof variable;
        return {
            "-": () => -this.walk(node.argument, scope),
            "+": () => +this.walk(node.argument, scope),
            "!": () => !this.walk(node.argument, scope),
            "~": () => ~this.walk(node.argument, scope),
            void: () => void this.walk(node.argument, scope),
            typeof: () => {
                if (node.argument.type === "Identifier") {
                    if (!scope.__has_variable_in_chain__(node.argument.name))
                        return "undefined";
                    return typeofFunc(that.walk(node.argument, scope));
                }
                else if (node.argument.type === "MemberExpression") {
                    const { object, property, computed } = node.argument;
                    if (computed) {
                        return typeofFunc(that.walk(object, scope)[that.walk(property, scope)]);
                    }
                    else {
                        return typeofFunc(that.walk(object, scope)[property.name]);
                    }
                }
                else {
                    return typeofFunc(that.walk(node.argument, scope));
                }
            },
            delete: () => {
                if (node.argument.type === "MemberExpression") {
                    const { object, property, computed } = node.argument;
                    if (computed) {
                        return delete this.walk(object, scope)[this.walk(property, scope)];
                    }
                    else {
                        return delete this.walk(object, scope)[property.name];
                    }
                }
                else if (node.argument.type === "Identifier") {
                    // 如果参数节点类型为一个标识符，则表明是要删除作用域中声明的变量，此处按照严格模式报错
                    throw new SyntaxError("Uncaught SyntaxError: Delete of an unqualified identifier in strict mode.");
                }
                else {
                    // @todo 除了参数类型为成员表达式和标识符外，其他一律返回true，需要验证是否正确
                    return true;
                }
            }
        }[node.operator]();
    }
    /**
     * @description ++ --更新表达式
     *
     * @param {ESTree.UpdateExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    UpdateExpression(node, scope) {
        const { prefix, operator } = node;
        if (node.argument.type === "Identifier") {
            const { name } = node.argument;
            // if (!scope.__has_variable_in_chain__(name)) throw new ReferenceError(`[name] is not defined`);
            let variable = scope.__get__(name);
            if (operator === "++") {
                // return prefix ? ++scope[name] : scope[name]++;
                scope.__set__(name, variable + 1);
                return prefix ? ++variable : variable++;
            }
            else {
                // return prefix ? --scope[name] : scope[name]--;
                scope.__set__(name, variable - 1);
                return prefix ? --variable : variable--;
            }
        }
        else if (node.argument.type === "MemberExpression") {
            const argument = node.argument;
            const object = this.walk(argument.object, scope);
            let property = argument.computed
                ? this.walk(argument.property, scope)
                : argument.property.name;
            if (operator === "++") {
                return prefix ? ++object[property] : object[property]++;
            }
            else {
                return prefix ? --object[property] : object[property]--;
            }
        }
        else {
            // @todo 待验证是否有必要下列代码
            let temp = this.walk(node.argument, scope);
            if (operator === "++") {
                return prefix ? ++temp : temp++;
            }
            else {
                return prefix ? --temp : temp--;
            }
        }
    }
    /**
     * @description 二元运算符表达式
     *
     * @param {ESTree.BinaryExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    BinaryExpression(node, scope) {
        return {
            "==": (a, b) => a == b,
            "!=": (a, b) => a != b,
            "===": (a, b) => a === b,
            "!==": (a, b) => a !== b,
            "<": (a, b) => a < b,
            "<=": (a, b) => a <= b,
            ">": (a, b) => a > b,
            ">=": (a, b) => a >= b,
            "<<": (a, b) => a << b,
            ">>": (a, b) => a >> b,
            ">>>": (a, b) => a >>> b,
            "+": (a, b) => a + b,
            "-": (a, b) => a - b,
            "*": (a, b) => a * b,
            "/": (a, b) => a / b,
            "%": (a, b) => a % b,
            "|": (a, b) => a | b,
            "^": (a, b) => a ^ b,
            "&": (a, b) => a & b,
            in: (a, b) => a in b,
            instanceof: (a, b) => a instanceof b
        }[node.operator](this.walk(node.left, scope), this.walk(node.right, scope));
    }
    /**
     * @todo 实现存在问题 需要重构
     * @description 赋值表达式
     *
     * @param {ESTree.AssignmentExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    AssignmentExpression(node, scope) {
        let $var;
        if (node.left.type === "Identifier") {
            const { name } = node.left;
            $var = {
                $set(value) {
                    scope.__set__(name, value);
                },
                $get() {
                    return scope.__get__(name);
                }
            };
        }
        else if (node.left.type === "MemberExpression") {
            const left = node.left;
            const object = this.walk(left.object, scope);
            let property = left.computed ? this.walk(left.property, scope) : left.property.name;
            $var = {
                $set(value) {
                    object[property] = value;
                },
                $get() {
                    return object[property];
                }
            };
        }
        else {
            throw `赋值表达式的左边的类型只能是Identifier或者MemberExpression，此处显然不正确`;
        }
        return {
            "=": v => ($var.$set(v), v),
            "+=": v => ($var.$set($var.$get() + v), $var.$get()),
            "-=": v => ($var.$set($var.$get() - v), $var.$get()),
            "*=": v => ($var.$set($var.$get() * v), $var.$get()),
            "/=": v => ($var.$set($var.$get() / v), $var.$get()),
            "%=": v => ($var.$set($var.$get() % v), $var.$get()),
            "<<=": v => ($var.$set($var.$get() << v), $var.$get()),
            ">>=": v => ($var.$set($var.$get() >> v), $var.$get()),
            ">>>=": v => ($var.$set($var.$get() >>> v), $var.$get()),
            "|=": v => ($var.$set($var.$get() | v), $var.$get()),
            "^=": v => ($var.$set($var.$get() ^ v), $var.$get()),
            "&=": v => ($var.$set($var.$get() & v), $var.$get())
        }[node.operator](this.walk(node.right, scope));
    }
    /**
     * @description || 和 && 的逻辑表达式
     *
     * @param {ESTree.LogicalExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    LogicalExpression(node, scope) {
        return {
            "||": () => this.walk(node.left, scope) || this.walk(node.right, scope),
            "&&": () => this.walk(node.left, scope) && this.walk(node.right, scope)
        }[node.operator]();
    }
    /**
     * @description . 成员运算符
     *
     * @param {ESTree.MemberExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    MemberExpression(node, scope) {
        const { object, property, computed } = node;
        if (computed) {
            return this.walk(object, scope)[this.walk(property, scope)];
        }
        else {
            return this.walk(object, scope)[property.name];
        }
    }
    /**
     * @description ? : 三元运算符表达式
     *
     * @param {ESTree.ConditionalExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    ConditionalExpression(node, scope) {
        return this.walk(node.test, scope) ? this.walk(node.consequent, scope) : this.walk(node.alternate, scope);
    }
    /**
     * @description 调用表达式
     *
     * @param {ESTree.CallExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    CallExpression(node, scope) {
        const args = node.arguments.map(arg => this.walk(arg, scope));
        if (node.callee.type === "MemberExpression") {
            const object = this.walk(node.callee.object, scope);
            // console.log('object: ', object);
            const funcName = node.callee.computed
                ? this.walk(node.callee.property, scope)
                : node.callee.property.name;
            // console.log('funcName: ', funcName);
            return object[funcName](...args);
        }
        else {
            // console.log(node.callee);
            // const this_val = scope.__get__('this');
            // return this.walk(node.callee, scope).apply(this_val || null, args)
            return this.walk(node.callee, scope)(...args);
        }
    }
    /**
     * @todo 实现是否存在问题有待商榷
     * @description new 运算符表达式
     *
     * @param {ESTree.NewExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    NewExpression(node, scope) {
        const func = this.walk(node.callee, scope);
        const args = node.arguments.map(arg => this.walk(arg, scope));
        return new (func.bind.apply(func, [null].concat(args)))();
        // return new func(...args);
    }
    /**
     * @description , 逗号运算符组成的序列表达式
     *
     * @param {ESTree.SequenceExpression} node
     * @param {Scope} scope
     * @returns
     * @memberof AST_Map
     */
    SequenceExpression(node, scope) {
        let last;
        for (const expr of node.expressions) {
            last = this.walk(expr, scope);
        }
        return last;
    }
    // class相关
    ClassDeclaration(node, scope) {
        throw `${node.type} 未实现`;
    }
    ClassExpression(node, scope) {
        throw `${node.type} 未实现`;
    }
    ClassBody(node, scope) {
        throw `${node.type} 未实现`;
    }
    Super(node, scope) {
        throw `${node.type} 未实现`;
    }
    MethodDefinition(node, scope) {
        throw `${node.type} 未实现`;
    }
    // 模板字符串
    TemplateLiteral(node, scope) {
        throw `${node.type} 未实现`;
    }
    TemplateElement(node, scope) {
        throw `${node.type} 未实现`;
    }
    TaggedTemplateExpression(node, scope) {
        throw `${node.type} 未实现`;
    }
    // 解构
    ObjectPattern(node, scope) {
        throw `${node.type} 未实现`;
    }
    AssignmentPattern(node, scope) {
        throw `${node.type} 未实现`;
    }
    ArrayPattern(node, scope) {
        throw `${node.type} 未实现`;
    }
    // 其它
    RestElement(node, scope) {
        throw `${node.type} 未实现`;
    }
    MetaProperty(node, scope) {
        throw `${node.type} 未实现`;
    }
    AwaitExpression(node, scope) {
        throw `${node.type} 未实现`;
    }
    ForOfStatement(node, scope) {
        throw `${node.type} 未实现`;
    }
    YieldExpression(node, scope) {
        throw `${node.type} 未实现`;
    }
    ArrowFunctionExpression(node, scope) {
        throw `${node.type} 未实现`;
    }
    AssignmentProperty(node, scope) {
        throw `${node.type} 未实现`;
    }
    // import相关
    ImportDeclaration(node, scope) {
        throw `${node.type} 未实现`;
    }
    ImportSpecifier(node, scope) {
        throw `${node.type} 未实现`;
    }
    ImportDefaultSpecifier(node, scope) {
        throw `${node.type} 未实现`;
    }
    ImportNamespaceSpecifier(node, scope) {
        throw `${node.type} 未实现`;
    }
    // export相关
    ExportSpecifier(node, scope) {
        throw `${node.type} 未实现`;
    }
    ExportNamedDeclaration(node, scope) {
        throw `${node.type} 未实现`;
    }
    ExportDefaultDeclaration(node, scope) {
        throw `${node.type} 未实现`;
    }
    ExportAllDeclaration(node, scope) {
        throw `${node.type} 未实现`;
    }
}
exports.default = AST_Map;


/***/ }),

/***/ "./src/break_signal.ts":
/*!*****************************!*\
  !*** ./src/break_signal.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description 程序中中断信号相关实现，包含break，continue和return
 *
 * @export
 * @class Break_Signal
 */
class Break_Signal {
    /**
     * @description 供Map继承使用，单独创建实例没有意义
     *
     * @memberof Break_Signal
     */
    constructor() {
        this.BREAK_SIGNAL = {};
        this.CONTINUE_SIGNAL = {};
        this.RETURN_SIGNAL = {};
    }
    /**
     * @description 创建一个break信号
     *
     * @protected
     * @returns
     * @memberof Break_Signal
     */
    createBreakSignal() {
        return this.BREAK_SIGNAL;
    }
    /**
     * @description 创建一个continue信号
     *
     * @protected
     * @returns {object}
     * @memberof Break_Signal
     */
    createContinueSignal() {
        return this.CONTINUE_SIGNAL;
    }
    /**
     * @description 创建一个return信号
     *
     * @protected
     * @param {*} data
     * @returns {object}
     * @memberof Break_Signal
     */
    createReturnSignal(data) {
        return { signal: this.RETURN_SIGNAL, data };
    }
    /**
     * @description 判断当前信号是否是break信号
     *
     * @protected
     * @param {*} signal
     * @returns {boolean}
     * @memberof Break_Signal
     */
    isBreakSignal(signal) {
        return signal === this.BREAK_SIGNAL;
    }
    /**
     * @description 判断当前信号是否是continue信号
     *
     * @protected
     * @param {*} signal
     * @returns {boolean}
     * @memberof Break_Signal
     */
    isContinueSignal(signal) {
        return signal === this.CONTINUE_SIGNAL;
    }
    /**
     * @description 判断当前信号是否是return信号
     *
     * @protected
     * @param {*} signal
     * @returns {boolean}
     * @memberof Break_Signal
     */
    isReturnSignal(signal) {
        return signal ? signal.signal === this.RETURN_SIGNAL : false;
    }
}
exports.default = Break_Signal;


/***/ }),

/***/ "./src/constant_table.ts":
/*!*******************************!*\
  !*** ./src/constant_table.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const NON_EXISTENT_INIT = {};
exports.default = {
    NON_EXISTENT_INIT
};


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const scope_1 = __webpack_require__(/*! ./scope */ "./src/scope.ts");
exports.Scope = scope_1.default;
const ast_map_1 = __webpack_require__(/*! ./ast_map */ "./src/ast_map.ts");
/**
 * @description VM主类
 *
 * @export
 * @class VM
 * @extends {AST_Map}
 */
class VM extends ast_map_1.default {
    /**
     * @description 创建一个JS VM的实例
     *
     * @param {object} context
     * @param {object} [args]
     * @memberof VM
     */
    constructor(context, args) {
        super();
        this.__context__ = new scope_1.default("root", null, []);
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
    init(context, args) {
        this.__context__ = new scope_1.default("root", null, []);
        this.__callstack__ = [];
        this.__context__.const("this", context);
        // 将剩余需要注入的参数注入到rootScope中
        if (args)
            Object.keys(args).forEach(prop => this.__context__.var(prop, args[prop]));
        this.___inject_global_variable__();
    }
    /**
     * @description 注入全局对象的内部方法
     *
     * @private
     * @memberof VM
     */
    ___inject_global_variable__() {
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
    execute(ast) {
        if (typeof ast === "string")
            ast = JSON.parse(ast);
        return this.walk(ast, this.__context__);
    }
    /**
     * @description 在当前VM实例的顶级作用域上以var形式注入变量
     *
     * @param {Object} args
     * @memberof VM
     */
    inject(args) {
        if (args)
            Object.keys(args).forEach(prop => this.__context__.var(prop, args[prop]));
    }
    /**
     * @description 获取当前VM实例的顶级作用域
     *
     * @returns {Scope}
     * @memberof VM
     */
    getRootScope() {
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
    runInScope(scope, ast) {
        if (scope instanceof scope_1.default) {
            if (typeof ast === "string")
                ast = JSON.parse(ast);
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
    getVariable(name) {
        return this.__context__.__get__(name);
    }
    /**
     * @description 重置当前VM，作用域还原
     *
     * @memberof VM
     */
    reset() {
        const this_var = this.__context__.__get__("this");
        this.__context__ = new scope_1.default("root", null, []);
        this.__callstack__ = [];
        this.__context__.const("this", this_var);
        // 将剩余需要注入的参数注入到rootScope中
        if (this.__inject_vars__) {
            Object.keys(this.__inject_vars__).forEach(prop => this.__context__.var(prop, this.__inject_vars__ && this.__inject_vars__[prop]));
        }
        this.___inject_global_variable__();
    }
}
exports.default = VM;


/***/ }),

/***/ "./src/scope.ts":
/*!**********************!*\
  !*** ./src/scope.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const constant_table_1 = __webpack_require__(/*! ./constant_table */ "./src/constant_table.ts");
class Scope {
    /**
     * @description 创建一个Scope作用域对象，非root类型的Scope必须提供一个父级Scope，且该父级Scope的原型链顶端必为root类型的Scope
     *
     * @param {string} type
     * @param {object} parent
     * @param {(Scope | Scope[])} children
     * @memberof Scope
     */
    constructor(type, parent, children) {
        this.__type__ = "block";
        this.__variables__ = new Map();
        this.__parent__ = null;
        this.__function_parent__ = null;
        this.__children__ = [];
        // 如果type是root则通过本类型创建，并将所有parent（context）的属性复制到prototype上
        if (type === "root") {
            this.__type__ = type;
            this.__variables__ = new Map();
            this.__parent__ = parent;
            // if (parent) {
            // }
            // Object.keys(parent).forEach(key => {
            //     Scope.prototype[key] = parent[key];
            // });
            // @todo 需要评估是否有必要，可能导致内存泄漏
            // if(children) this.__add_children__(children);
            return this;
        }
        // 如果类型不是root则通工厂模式（Object.Create）来创建对象并添加属性
        return this.__create_child_scope__(type, parent, children);
    }
    /**
     * @description 工厂模式创建非root类型的Scope
     *
     * @param {string} type
     * @param {(Scope | object)} parent
     * @param {(Scope | Scope[])} children
     * @returns {Scope}
     * @memberof Scope
     */
    __create_child_scope__(type, parent, children) {
        const scope = Object.create(parent || null);
        scope.__type__ = type;
        scope.__variables__ = new Map();
        scope.__parent__ = parent;
        scope.__function_parent__ = null;
        scope.__children__ = children || [];
        // @todo 需要评估是否有必要，可能导致内存泄漏
        // if (parent instanceof Scope) {
        //     parent.__add_children__(scope);
        // }
        return scope;
    }
    /**
     * @description 给当前作用域添加子作用域
     *
     * @param {(Scope | Scope[])} children
     * @memberof Scope
     */
    __add_children__(children) {
        if (children) {
            Array.isArray(children) ? this.__children__.push(...children) : this.__children__.push(children);
            // this.__children__.push(Array.isArray(children) ? (...children) : children);
        }
    }
    /**
     * @description 判断 当前作用域链 是否拥有某个变量
     *
     * @param {string} variable_name
     * @returns {boolean}
     * @memberof Scope
     */
    __has_variable_in_chain__(variable_name) {
        return this[variable_name] !== undefined;
    }
    /**
     * @description 判断 当前作用域 内是否拥有某个变量
     *
     * @param {string} variable_name
     * @returns {boolean}
     * @memberof Scope
     */
    __has_variable__(variable_name) {
        return this.__variables__.has(variable_name);
    }
    /**
     * @description 根据变量名判断该变量在当前作用域的声明类型
     *
     * @param {string} variable_name
     * @returns {('var' | 'let' | 'const' | 'function' | undefined)}
     * @memberof Scope
     */
    __get_dec_type__(variable_name) {
        return this[variable_name].decType;
    }
    /**
     * @description 根据变量名获取变量值
     *
     * @param {string} variable_name
     * @returns
     * @memberof Scope
     */
    __get__(variable_name) {
        // console.log('variable_name: ', variable_name);
        // console.log('variable_value: ', this[variable_name]);
        const variable = this[variable_name];
        if (variable)
            return variable.value;
        throw new ReferenceError(`${variable_name} is not defined`);
    }
    /**
     * @description 根据变量名设置变量的值
     *
     * @param {string} variable_name
     * @param {*} value
     * @returns
     * @memberof Scope
     */
    __set__(variable_name, value) {
        const variable = this[variable_name];
        if (variable) {
            if (variable.decType === "const")
                throw new TypeError("Assignment to constant variable.");
            variable.value = value;
            return variable.value;
        }
        throw new ReferenceError(`${variable_name} is not defined`);
    }
    /**
     * @description 删除作用域中的变量
     *
     * @param {string} variable_name
     * @returns
     * @memberof Scope
     */
    __remove__(variable_name) {
        const variable = this[variable_name];
        if (variable) {
            return delete this[variable_name] && this.__variables__.delete(variable_name);
        }
        return false;
    }
    /**
     * @description 在当前scope声明一个var类型的变量
     *
     * @param {string} variable_name
     * @param {*} value
     * @memberof Scope
     */
    var(variable_name, value, getter_callback, setter_callback) {
        this.__function_declaration__("var", variable_name, value, getter_callback, setter_callback);
    }
    /**
     * @description 在当前scope声明函数
     *
     * @param {string} function_name
     * @param {Function} func
     * @memberof Scope
     */
    function(function_name, func, getter_callback, setter_callback) {
        this.__function_declaration__("function", function_name, func, getter_callback, setter_callback);
    }
    /**
     * @description 在当前作用域声明一个let类型的变量
     *
     * @param {string} variable_name
     * @param {*} value
     * @returns
     * @memberof Scope
     */
    let(variable_name, value, getter_callback, setter_callback) {
        this.__block_declaration__("let", variable_name, value, getter_callback, setter_callback);
    }
    /**
     * @description 在当前作用域声明一个const类型的变量
     *
     * @param {string} variable_name
     * @param {*} value
     * @memberof Scope
     */
    const(variable_name, value, getter_callback) {
        // const声明没有初始化的错误处理在Map层实现，该层无法准确判断
        this.__block_declaration__("const", variable_name, value, getter_callback);
    }
    /**
     * @description 找出一个Scope的最近父级Function类型的Scope
     *
     * @param {(Scope | null)} scope
     * @returns {(Scope | null)}
     * @memberof Scope
     */
    __find_parent_function_scope__(scope) {
        if (scope) {
            const sType = scope.__parent__ ? scope.__parent__.__type__ : null;
            if (sType === "function" || sType === "root")
                return scope.__parent__ || null;
            return scope.__find_parent_function_scope__(scope.__parent__);
        }
        return null;
    }
    /**
     * @description 块级的声明，如const let
     *
     * @param {('const' | 'let')} dec_type
     * @param {string} variable_name
     * @param {*} value
     * @returns
     * @memberof Scope
     */
    __block_declaration__(dec_type, variable_name, value, getter_callback, setter_callback) {
        if (this.__variables__.has(variable_name)) {
            throw new SyntaxError(`Uncaught SyntaxError: Identifier '${variable_name}' has already been declared`);
        }
        const variable = {
            decType: dec_type,
            value: value === constant_table_1.default.NON_EXISTENT_INIT ? undefined : value
        };
        this.__variables__.set(variable_name, variable);
        const _this = this;
        let set = value => {
            const originalValueObj = _this[variable_name];
            originalValueObj.value = value;
            _this.__variables__.set(variable_name, originalValueObj);
            if (setter_callback && typeof setter_callback === "function")
                setter_callback();
            return originalValueObj;
        };
        if (dec_type === "const") {
            set = value => {
                throw new TypeError("Assignment to constant variable");
            };
        }
        Object.defineProperty(this, variable_name, {
            configurable: true,
            enumerable: true,
            // value,
            // writable: true,
            get() {
                if (getter_callback && typeof getter_callback === "function")
                    getter_callback();
                return _this.__variables__.get(variable_name);
            },
            set
        });
        return variable;
    }
    /**
     * @description 函数作用域的声明，如 var 和 function
     *
     * @param {('function' | 'var')} dec_type
     * @param {string} variable_name
     * @param {*} value
     * @returns
     * @memberof Scope
     */
    __function_declaration__(dec_type, variable_name, value, getter_callback, setter_callback) {
        const existing_variable = this.__variables__.get(variable_name);
        if (existing_variable) {
            const decType = existing_variable.decType;
            if (decType === "let" || decType === "const")
                throw SyntaxError(`Uncaught SyntaxError: Identifier '${variable_name}' has already been declared`);
            // 处理重复声明时 并没有赋值的情况
            if (value !== constant_table_1.default.NON_EXISTENT_INIT) {
                existing_variable.decType = dec_type;
                existing_variable.value = value;
            }
            return existing_variable;
        }
        else {
            if (this.__type__ === "function" || this.__type__ === "root") {
                const variable = {
                    decType: dec_type,
                    value: value === constant_table_1.default.NON_EXISTENT_INIT ? undefined : value
                };
                this.__variables__.set(variable_name, variable);
                const _this = this;
                Object.defineProperty(this, variable_name, {
                    configurable: true,
                    enumerable: true,
                    // value,
                    // writable: true,
                    get() {
                        if (getter_callback && typeof getter_callback === "function")
                            getter_callback();
                        return _this.__variables__.get(variable_name);
                    },
                    set(value) {
                        const originalValueObj = _this[variable_name];
                        originalValueObj.value = value;
                        _this.__variables__.set(variable_name, originalValueObj);
                        if (setter_callback && typeof setter_callback === "function")
                            setter_callback();
                        return originalValueObj;
                    }
                });
                return variable;
            }
            else {
                if (!this.__function_parent__) {
                    this.__function_parent__ = this.__find_parent_function_scope__(this);
                }
                if (this.__function_parent__) {
                    const variable = this.__function_parent__.__function_declaration__(dec_type, variable_name, value, getter_callback, setter_callback);
                    if (variable) {
                        this.__variables__.set(variable_name, variable);
                        return variable;
                    }
                    throw new Error(`执行器内部错误，上层function作用域返回一个空的变量`);
                }
                else {
                    throw new Error(`执行器内部错误，无法找到一个合适的作用域声明${dec_type}类型的变量`);
                }
            }
        }
    }
}
exports.default = Scope;


/***/ })

/******/ });
});
//# sourceMappingURL=jsvm.js.map