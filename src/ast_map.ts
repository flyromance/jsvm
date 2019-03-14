import * as ESTree from "estree";
import CONSTANT_TABLE from "./constant_table";
import Scope from "./scope";
import Break_Signal from "./break_signal";
// import Stack from './stack';

/**
 * @description 语法节点对应的执行映射类
 * @description 可以使用for of，TS会翻译为for
 *
 * @export
 * @class AST_Map
 */
export default class AST_Map extends Break_Signal {
  protected WalkCount: number = 0;
  // protected ObjectPropertyAuxiliaryStack = new Stack();

  constructor() {
    super();
  }

  /**
   * @description 递归解释执行AST的分步函数
   *
   * @param {ESTree.Node} node
   * @param {Scope} scope
   * @returns
   * @memberof AST_Map
   */
  walk(node: ESTree.Node, scope: Scope, ...args: any[]) {
    this.WalkCount++;
    return this[node.type as string](node, scope, ...args);
  }

  /**
   * @description AST的根节点 从此处开始执行 body包含一系列的语句
   *
   * @param {ESTree.Program} program
   * @param {Scope} scope
   * @memberof AST_Map
   */
  Program(program: ESTree.Program, scope: Scope) {
    for (const node of program.body) this.walk(node, scope);
  }

  /**
   * @description 标识符 返回可操作的空间位，若不存在该标识符则抛出错误
   *
   * @param {ESTree.Identifier} node
   * @param {Scope} scope
   * @returns
   * @memberof AST_Map
   */
  Identifier(node: ESTree.Identifier, scope: Scope) {
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
  Literal(node: ESTree.Literal, scope: Scope): any {
    return (<ESTree.RegExpLiteral>node).regex
      ? new RegExp((<ESTree.RegExpLiteral>node).regex.pattern, (<ESTree.RegExpLiteral>node).regex.flags)
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
  BlockStatement(block: ESTree.BlockStatement, scope: Scope) {
    // @todo 此处可以判定是否需要创建作用域，需要Scope内部支持
    let new_scope = new Scope("block", scope);
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
  EmptyStatement(node: ESTree.EmptyStatement, scope: Scope) {
    /* do nothing */
  }

  /**
   * @description debugger语句
   *
   * @param {ESTree.DebuggerStatement} node
   * @param {Scope} scope
   * @memberof AST_Map
   */
  DebuggerStatement(node: ESTree.DebuggerStatement, scope: Scope) {
    debugger;
  }

  /**
   * @description 一个表达式语句，内部包含一个表达式，直接执行内部的表达式
   *
   * @param {ESTree.ExpressionStatement} node
   * @param {Scope} scope
   * @memberof AST_Map
   */
  ExpressionStatement(node: ESTree.ExpressionStatement, scope: Scope) {
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
  ReturnStatement(node: ESTree.ReturnStatement, scope: Scope) {
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
  LabeledStatement(node: ESTree.LabeledStatement, scope: Scope) {
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
  BreakStatement(node: ESTree.BreakStatement, scope: Scope) {
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
  ContinueStatement(node: ESTree.ContinueStatement, scope: Scope) {
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
  IfStatement(node: ESTree.IfStatement, scope: Scope) {
    if (this.walk(node.test, scope)) return this.walk(node.consequent, scope);
    else if (node.alternate) return this.walk(node.alternate, scope);
  }

  /**
   * @description switch语句，多分支判断语句
   *
   * @param {ESTree.SwitchStatement} node
   * @param {Scope} scope
   * @returns
   * @memberof AST_Map
   */
  SwitchStatement(node: ESTree.SwitchStatement, scope: Scope) {
    // 执行discriminant(Expression)得到运算结果，将结果挨个与cases中的SwitchCase中的test执行结果比对(使用严格等于)
    // 若存在第n个SwitchCase的test执行结果与discriminant的结果匹配，则执行此SwitchStatement中的consequent([ Statement ])
    // 若该SwitchStatement中的consequent存在break语句，则跳过后续执行，直接return
    // 若该SwitchStatement中的consequent不存在break语句，则执行第n+1个SwitchCase
    // 循环执行以上两个步骤到default(test==null)语句
    // 若不存在，则执行default(test==null)语句
    const discriminant = this.walk(node.discriminant, scope);
    const new_scope = new Scope("switch", scope);

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
        } else if (this.isContinueSignal(result) || this.isReturnSignal(result)) {
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
  SwitchCase(node: ESTree.SwitchCase, scope: Scope) {
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
  WithStatement(node: ESTree.WithStatement, scope: Scope) {
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
  ThrowStatement(node: ESTree.ThrowStatement, scope: Scope) {
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
  TryStatement(node: ESTree.TryStatement, scope: Scope) {
    // 如果handler是null那么finalizer必然存在
    try {
      return this.walk(node.block, new Scope("try", scope));
    } catch (err) {
      if (node.handler) {
        const param = <ESTree.Identifier>node.handler.param;
        const new_scope = new Scope("catch", scope);
        new_scope.const(param.name, err);
        return this.walk(node.handler, new_scope);
      } else {
        throw err;
      }
    } finally {
      if (node.finalizer) {
        // 增加了判断 如果finally中有返回信号才返回 否则不返回
        const result = this.walk(node.finalizer, new Scope("finally", scope));
        if (this.isReturnSignal(result)) return result;
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
  CatchClause(node: ESTree.CatchClause, scope: Scope) {
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
  WhileStatement(node: ESTree.WhileStatement, scope: Scope) {
    while (this.walk(node.test, scope)) {
      const new_scope = new Scope("while", scope);
      const result = this.walk(node.body, new_scope);

      if (this.isBreakSignal(result)) {
        break;
      } else if (this.isContinueSignal(result)) {
        continue;
      } else if (this.isReturnSignal(result)) {
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
  DoWhileStatement(node: ESTree.DoWhileStatement, scope: Scope) {
    do {
      const new_scope = new Scope("dowhile", scope);
      const result = this.walk(node.body, new_scope);
      if (this.isBreakSignal(result)) {
        break;
      } else if (this.isContinueSignal(result)) {
        continue;
      } else if (this.isReturnSignal(result)) {
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
  ForStatement(node: ESTree.ForStatement, scope: Scope) {
    // @todo 以下获取循环初始化变量的代码可能是无用的
    const initKeys: string[] = [];
    if (node.init && node.init.type && node.init.type === "VariableDeclaration" && node.init.kind === "let") {
      node.init.declarations.forEach(vd => {
        if ((<ESTree.Identifier>vd.id).name) initKeys.push((<ESTree.Identifier>vd.id).name);
      });
    }

    for (
      const new_scope = new Scope("for", scope), init_val = node.init ? this.walk(node.init, new_scope) : null;
      node.test ? this.walk(node.test, new_scope) : true;
      node.update ? this.walk(node.update, new_scope) : void 0
    ) {
      const bodyScope = new Scope("for_body", new_scope);
      const result = this.walk(node.body, bodyScope);

      // @todo 循环复制变量到当前循环体的作用域中可能是无用的
      // initKeys.forEach(key => bodyScope.let(key, new_scope[key]));
      initKeys.forEach(key => bodyScope.let(key, new_scope.__get__(key)));

      if (this.isBreakSignal(result)) {
        break;
      } else if (this.isContinueSignal(result)) {
        continue;
      } else if (this.isReturnSignal(result)) {
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
  ForInStatement(node: ESTree.ForInStatement, scope: Scope) {
    let kind = "var",
      name;
    if (node.left.type === "Identifier") {
      name = node.left.name;
    } else {
      const decl = (<ESTree.VariableDeclaration>node.left).declarations[0];
      name = (<ESTree.Identifier>decl.id).name;
      kind = (<ESTree.VariableDeclaration>node.left).kind;
    }

    for (const value in this.walk(node.right, scope)) {
      const new_scope = new Scope("forin", scope);
      new_scope[kind](name, value);
      const result = this.walk(node.body, new_scope);
      if (this.isBreakSignal(result)) {
        break;
      } else if (this.isContinueSignal(result)) {
        continue;
      } else if (this.isReturnSignal(result)) {
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
  FunctionDeclaration(node: ESTree.FunctionDeclaration, scope: Scope) {
    // FunctionDeclaration和FunctionExpression的唯一不同是FunctionDeclaration中的id(函数名标识符)
    // 不能为null(当函数为export default function中的函数时，可以为空)，而FunctionExpression的id可以为null
    // 当前实现：id如果为空，直接抛出语法异常
    const func = this.FunctionExpression(<any>node, scope);

    let name = "";
    if (node && node.id && node.id.name) name = node.id.name;
    else throw new SyntaxError("Function must have a name as its identifier");

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
  FunctionExpression(node: ESTree.FunctionExpression, scope: Scope) {
    const self = this;
    const func = function(...args) {
      const new_scope = new Scope("function", scope);
      for (let i = 0; i < node.params.length; i++) {
        const { name } = <ESTree.Identifier>node.params[i];
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
  VariableDeclaration(node: ESTree.VariableDeclaration, scope: Scope) {
    const kind = node.kind;
    for (const declartor of node.declarations) {
      // 声明const类型没有初始化抛出异常
      if (kind === "const" && !declartor.init) throw new SyntaxError("Missing initializer in const declaration");

      const { name } = <ESTree.Identifier>declartor.id;

      const value = declartor.init === null ? CONSTANT_TABLE.NON_EXISTENT_INIT : this.walk(declartor.init!, scope);
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
  VariableDeclarator(node: ESTree.VariableDeclarator, scope: Scope) {
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
  ThisExpression(node: ESTree.ThisExpression, scope: Scope) {
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
  ArrayExpression(node: ESTree.ArrayExpression, scope: Scope) {
    const target = [];
    // scope.const('[[TARGET]]', target);
    node.elements.forEach(item => {
      target.push(this.walk(item, scope, target) as never);
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
  ObjectExpression(node: ESTree.ObjectExpression, scope: Scope) {
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
  Property(
    node: ESTree.Property,
    scope: Scope,
    target: Object,
    auxiliaryGetterMap: Object,
    auxiliarySetterMap: Object
  ) {
    // 注释的部分取决于ObjectExpression的实现方式
    const kind = node.kind;
    // const object = {};
    let key;
    if (node.key.type === "Literal") {
      key = node.key.value;
    } else if (node.key.type === "Identifier") {
      key = node.key.name;
    } else {
      throw new Error("Key of object must be Literal or Identifier, please check your code of ObjectExpression");
    }

    // const target = scope.__get__('[[TARGET]]');
    const value = this.walk(node.value, scope);
    if (kind === "init") {
      // object[key] = value
      target[key] = value;
    } else if (kind === "set") {
      // Object.defineProperty(object, key, { set: value });
      // Object.defineProperty(target, key, { set: value });
      auxiliarySetterMap[key] = value;
    } else if (kind === "get") {
      // Object.defineProperty(object, key, { get: value });
      // Object.defineProperty(target, key, { get: value });
      auxiliaryGetterMap[key] = value;
    } else {
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
  SpreadElement(node: ESTree.SpreadElement, scope: Scope, target: Object) {
    // const target = scope.__get__('[[TARGET]]');
    const param = this.walk(node.argument, scope);

    if (Array.isArray(target)) {
      if (param[Symbol.iterator] && typeof param[Symbol.iterator] === "function") {
        const iterator = param[Symbol.iterator]();
        let pointer;
        while (!(pointer = iterator.next()).done) {
          target.push(pointer.value);
        }
      } else {
        throw TypeError(`${param} is not iterable`);
      }
    } else if (typeof target === "object") {
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
  UnaryExpression(node: ESTree.UnaryExpression, scope: Scope) {
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
          if (!scope.__has_variable_in_chain__(node.argument.name)) return "undefined";
          return typeofFunc(that.walk(node.argument, scope));
        } else if (node.argument.type === "MemberExpression") {
          const { object, property, computed } = node.argument;
          if (computed) {
            return typeofFunc(that.walk(object, scope)[that.walk(property, scope)]);
          } else {
            return typeofFunc(that.walk(object, scope)[(<ESTree.Identifier>property).name]);
          }
        } else {
          return typeofFunc(that.walk(node.argument, scope));
        }
      },
      delete: () => {
        if (node.argument.type === "MemberExpression") {
          const { object, property, computed } = node.argument;
          if (computed) {
            return delete this.walk(object, scope)[this.walk(property, scope)];
          } else {
            return delete this.walk(object, scope)[(<ESTree.Identifier>property).name];
          }
        } else if (node.argument.type === "Identifier") {
          // 如果参数节点类型为一个标识符，则表明是要删除作用域中声明的变量，此处按照严格模式报错
          throw new SyntaxError("Uncaught SyntaxError: Delete of an unqualified identifier in strict mode.");
        } else {
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
  UpdateExpression(node: ESTree.UpdateExpression, scope: Scope) {
    const { prefix, operator } = node;

    if (node.argument.type === "Identifier") {
      const { name } = node.argument;
      // if (!scope.__has_variable_in_chain__(name)) throw new ReferenceError(`[name] is not defined`);
      let variable = scope.__get__(name);
      if (operator === "++") {
        // return prefix ? ++scope[name] : scope[name]++;
        scope.__set__(name, variable + 1);
        return prefix ? ++variable : variable++;
      } else {
        // return prefix ? --scope[name] : scope[name]--;
        scope.__set__(name, variable - 1);
        return prefix ? --variable : variable--;
      }
    } else if (node.argument.type === "MemberExpression") {
      const argument = node.argument;
      const object = this.walk(argument.object, scope);
      let property = argument.computed
        ? this.walk(argument.property, scope)
        : (<ESTree.Identifier>argument.property).name;

      if (operator === "++") {
        return prefix ? ++object[property] : object[property]++;
      } else {
        return prefix ? --object[property] : object[property]--;
      }
    } else {
      // @todo 待验证是否有必要下列代码
      let temp = this.walk(node.argument, scope);
      if (operator === "++") {
        return prefix ? ++temp : temp++;
      } else {
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
  BinaryExpression(node: ESTree.BinaryExpression, scope: Scope) {
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
  AssignmentExpression(node: ESTree.AssignmentExpression, scope: Scope) {
    let $var: {
      $set(value: any);
      $get(): any;
    };

    if (node.left.type === "Identifier") {
      const { name } = node.left;
      $var = {
        $set(value: any) {
          scope.__set__(name, value);
        },
        $get(): any {
          return scope.__get__(name);
        }
      };
    } else if (node.left.type === "MemberExpression") {
      const left = node.left;
      const object = this.walk(left.object, scope);
      let property = left.computed ? this.walk(left.property, scope) : (<ESTree.Identifier>left.property).name;
      $var = {
        $set(value: any) {
          object[property] = value;
        },
        $get() {
          return object[property];
        }
      };
    } else {
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
  LogicalExpression(node: ESTree.LogicalExpression, scope: Scope) {
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
  MemberExpression(node: ESTree.MemberExpression, scope: Scope) {
    const { object, property, computed } = node;
    if (computed) {
      return this.walk(object, scope)[this.walk(property, scope)];
    } else {
      return this.walk(object, scope)[(<ESTree.Identifier>property).name];
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
  ConditionalExpression(node: ESTree.ConditionalExpression, scope: Scope) {
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
  CallExpression(node: ESTree.CallExpression, scope: Scope) {
    const args = node.arguments.map(arg => this.walk(arg, scope));

    if (node.callee.type === "MemberExpression") {
      const object = this.walk(node.callee.object, scope);
      // console.log('object: ', object);
      const funcName = node.callee.computed
        ? this.walk(node.callee.property, scope)
        : (<ESTree.Identifier>node.callee.property).name;
      // console.log('funcName: ', funcName);
      return object[funcName](...args);
    } else {
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
  NewExpression(node: ESTree.NewExpression, scope: Scope) {
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
  SequenceExpression(node: ESTree.SequenceExpression, scope: Scope) {
    let last;
    for (const expr of node.expressions) {
      last = this.walk(expr, scope);
    }
    return last;
  }

  // class相关
  ClassDeclaration(node: ESTree.ClassDeclaration, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ClassExpression(node: ESTree.ClassExpression, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ClassBody(node: ESTree.ClassBody, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  Super(node: ESTree.Super, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  MethodDefinition(node: ESTree.MethodDefinition, scope: Scope) {
    throw `${node.type} 未实现`;
  }

  // 模板字符串
  TemplateLiteral(node: ESTree.TemplateLiteral, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  TemplateElement(node: ESTree.TemplateElement, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  TaggedTemplateExpression(node: ESTree.TaggedTemplateExpression, scope: Scope) {
    throw `${node.type} 未实现`;
  }

  // 解构
  ObjectPattern(node: ESTree.ObjectPattern, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  AssignmentPattern(node: ESTree.AssignmentPattern, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ArrayPattern(node: ESTree.ArrayPattern, scope: Scope) {
    throw `${node.type} 未实现`;
  }

  // 其它
  RestElement(node: ESTree.RestElement, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  MetaProperty(node: ESTree.MetaProperty, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  AwaitExpression(node: ESTree.AwaitExpression, scope: Scope) {
    throw `${node.type} 未实现`;
  }

  ForOfStatement(node: ESTree.ForOfStatement, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  YieldExpression(node: ESTree.YieldExpression, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ArrowFunctionExpression(node: ESTree.ArrowFunctionExpression, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  AssignmentProperty(node: ESTree.AssignmentProperty, scope: Scope) {
    throw `${node.type} 未实现`;
  }

  // import相关
  ImportDeclaration(node: ESTree.ImportDeclaration, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ImportSpecifier(node: ESTree.ImportSpecifier, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ImportDefaultSpecifier(node: ESTree.ImportDefaultSpecifier, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ImportNamespaceSpecifier(node: ESTree.ImportNamespaceSpecifier, scope: Scope) {
    throw `${node.type} 未实现`;
  }

  // export相关
  ExportSpecifier(node: ESTree.ExportSpecifier, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ExportNamedDeclaration(node: ESTree.ExportNamedDeclaration, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ExportDefaultDeclaration(node: ESTree.ExportDefaultDeclaration, scope: Scope) {
    throw `${node.type} 未实现`;
  }
  ExportAllDeclaration(node: ESTree.ExportAllDeclaration, scope: Scope) {
    throw `${node.type} 未实现`;
  }
}
