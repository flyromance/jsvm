import CONSTANT_TABLE from "./constant_table";

export default class Scope {
  private __type__: string = "block";
  private __variables__: Map<string, { decType: string; value: any }> = new Map();
  private __parent__: Scope | null | undefined = null;
  private __function_parent__: Scope | null = null;
  private __children__: Scope[] = [];

  /**
   * @description 创建一个Scope作用域对象，非root类型的Scope必须提供一个父级Scope，且该父级Scope的原型链顶端必为root类型的Scope
   *
   * @param {string} type
   * @param {object} parent
   * @param {(Scope | Scope[])} children
   * @memberof Scope
   */
  constructor(type: string, parent: Scope | null | undefined, children?: Scope | Scope[]) {
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
  private __create_child_scope__(type: string, parent: Scope | null | undefined, children?: Scope | Scope[]): Scope {
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
  private __add_children__(children: Scope | Scope[]): void {
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
  public __has_variable_in_chain__(variable_name: string): boolean {
    return this[variable_name] !== undefined;
  }

  /**
   * @description 判断 当前作用域 内是否拥有某个变量
   *
   * @param {string} variable_name
   * @returns {boolean}
   * @memberof Scope
   */
  public __has_variable__(variable_name: string): boolean {
    return this.__variables__.has(variable_name);
  }

  /**
   * @description 根据变量名判断该变量在当前作用域的声明类型
   *
   * @param {string} variable_name
   * @returns {('var' | 'let' | 'const' | 'function' | undefined)}
   * @memberof Scope
   */
  public __get_dec_type__(variable_name: string): "var" | "let" | "const" | "function" | undefined {
    return this[variable_name].decType;
  }

  /**
   * @description 根据变量名获取变量值
   *
   * @param {string} variable_name
   * @returns
   * @memberof Scope
   */
  public __get__(variable_name: string) {
    // console.log('variable_name: ', variable_name);
    // console.log('variable_value: ', this[variable_name]);
    const variable = this[variable_name];
    if (variable) return variable.value;
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
  public __set__(variable_name: string, value: any) {
    const variable = this[variable_name];
    if (variable) {
      if (variable.decType === "const") throw new TypeError("Assignment to constant variable.");
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
  public __remove__(variable_name: string) {
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
  public var(variable_name: string, value: any, getter_callback?: Function, setter_callback?: Function) {
    this.__function_declaration__("var", variable_name, value, getter_callback, setter_callback);
  }

  /**
   * @description 在当前scope声明函数
   *
   * @param {string} function_name
   * @param {Function} func
   * @memberof Scope
   */
  public function(function_name: string, func: Function, getter_callback?: Function, setter_callback?: Function) {
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
  public let(variable_name: string, value: any, getter_callback?: Function, setter_callback?: Function) {
    this.__block_declaration__("let", variable_name, value, getter_callback, setter_callback);
  }

  /**
   * @description 在当前作用域声明一个const类型的变量
   *
   * @param {string} variable_name
   * @param {*} value
   * @memberof Scope
   */
  public const(variable_name: string, value: any, getter_callback?: Function) {
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
  private __find_parent_function_scope__(scope: Scope | undefined | null): Scope | null {
    if (scope) {
      const sType = scope.__parent__ ? scope.__parent__.__type__ : null;
      if (sType === "function" || sType === "root") return scope.__parent__ || null;
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
  private __block_declaration__(
    dec_type: "const" | "let",
    variable_name: string,
    value: any,
    getter_callback?: Function,
    setter_callback?: Function
  ) {
    if (this.__variables__.has(variable_name)) {
      throw new SyntaxError(`Uncaught SyntaxError: Identifier '${variable_name}' has already been declared`);
    }

    const variable = {
      decType: dec_type,
      value: value === CONSTANT_TABLE.NON_EXISTENT_INIT ? undefined : value
    };
    this.__variables__.set(variable_name, variable);

    const _this = this;
    let set = value => {
      const originalValueObj = _this[variable_name];
      originalValueObj.value = value;
      _this.__variables__.set(variable_name, originalValueObj);

      if (setter_callback && typeof setter_callback === "function") setter_callback();
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
        if (getter_callback && typeof getter_callback === "function") getter_callback();
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
  private __function_declaration__(
    dec_type: "function" | "var",
    variable_name: string,
    value: any,
    getter_callback?: Function,
    setter_callback?: Function
  ) {
    const existing_variable = this.__variables__.get(variable_name);
    if (existing_variable) {
      const decType = existing_variable.decType;
      if (decType === "let" || decType === "const")
        throw SyntaxError(`Uncaught SyntaxError: Identifier '${variable_name}' has already been declared`);

      // 处理重复声明时 并没有赋值的情况
      if (value !== CONSTANT_TABLE.NON_EXISTENT_INIT) {
        existing_variable.decType = dec_type;
        existing_variable.value = value;
      }

      return existing_variable;
    } else {
      if (this.__type__ === "function" || this.__type__ === "root") {
        const variable = {
          decType: dec_type,
          value: value === CONSTANT_TABLE.NON_EXISTENT_INIT ? undefined : value
        };
        this.__variables__.set(variable_name, variable);

        const _this = this;
        Object.defineProperty(this, variable_name, {
          configurable: true,
          enumerable: true,
          // value,
          // writable: true,
          get() {
            if (getter_callback && typeof getter_callback === "function") getter_callback();
            return _this.__variables__.get(variable_name);
          },
          set(value) {
            const originalValueObj = _this[variable_name];
            originalValueObj.value = value;
            _this.__variables__.set(variable_name, originalValueObj);

            if (setter_callback && typeof setter_callback === "function") setter_callback();
            return originalValueObj;
          }
        });
        return variable;
      } else {
        if (!this.__function_parent__) {
          this.__function_parent__ = this.__find_parent_function_scope__(this);
        }
        if (this.__function_parent__) {
          const variable = this.__function_parent__.__function_declaration__(
            dec_type,
            variable_name,
            value,
            getter_callback,
            setter_callback
          );
          if (variable) {
            this.__variables__.set(variable_name, variable);
            return variable;
          }
          throw new Error(`执行器内部错误，上层function作用域返回一个空的变量`);
        } else {
          throw new Error(`执行器内部错误，无法找到一个合适的作用域声明${dec_type}类型的变量`);
        }
      }
    }
  }
}
