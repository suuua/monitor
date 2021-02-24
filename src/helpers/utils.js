// @flow

/**
 * 返回一个链式调用的函数（职责链）
 * @param  {Anything} env 调用环境或待调用函数
 * @param  {Array<function>} fns 待用函数
 * @return {Function}     一个链式调用的函数
 */
export function chain(env: any, ...fns: Array<Function>) {
  return (...args: Array<any>) => {
    let bindEnv;
    if (env && typeof env === "function") {
      env.apply(bindEnv, args);
    } else {
      bindEnv = env;
    }

    for (let i = 0; i < fns.length; i++) {
      fns[i] && fns[i].apply(bindEnv, args);
    }
  };
}

/**
 * Array.prototype.includes 为es6语法，需要引入polyfill此处简单实现一个
 * @param  {Array<any>} arr  待查询列表
 * @param  {Anything} item 查询目标
 * @return {Boolean}      查询结果
 */
export function includes(arr: Array<any>, item: any) {
  if (!arr || !arr.length) {
    return false;
  }

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return true;
    }
  }

  return false;
}

export function isObjectEqual(a?: {} = {}, b?: {} = {}) {
  if (!a || !b) return a === b;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false;
  }
  return aKeys.every(key => {
    const aVal = a[key];
    const bVal = b[key];
    // check nested equality
    if (typeof aVal === "object" && typeof bVal === "object") {
      return isObjectEqual(aVal, bVal);
    }
    return String(aVal) === String(bVal);
  });
}

/* istanbul ignore next */
export function assertDevConsole(consoleType: string, msg: string) {
  if (process.env.NODE_ENV === "development") {
    console[consoleType](msg);
  }
}

/* istanbul ignore next */
export function warn(msg: string) {
  assertDevConsole("warn", `[monitor] ${msg}`);
}

export function isFunction(fn: any) {
  return typeof fn === "function";
}
