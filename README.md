### 使用方法
- 把js代码用Babylon转换成ast
- let vm = new jsvm.Vm({})
- vm.execute(ast)

### 原理
- 遍历ast节点，根据不同的节点类型，进行处理
  - Program
  - VariableDeclaration
  - FunctionDeclaration
  - Identifier
  - Literal
  - ExpressionStatement
  - BlockStatement
  - callexpression
  - ...
- 作用域链用原型链模拟！！！