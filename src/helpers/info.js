/**
 * Extract the error info from Error/ErrorEvent/String/Object
 * @author zc
 * @version 0.0.1
 * @flow
 */
import { isObjectEqual } from "./utils";

export class ExtractInfo {
  lineno: number;
  colno: number;
  message: string;
  fileName: string;
  stack: string;
  /**
   * constructor
   * @param  {Error|ErrorEvent|ExtractInfo|Object|String} info 错误信息
   */
  constructor(info: any = {}) {
    if (typeof info === "object") {
      // Error.prototype.lineNumber and Error.prototype.fileName is not standard
      this.lineno = info.lineNumber || info.lineno;
      this.colno = info.columnNumber || info.colno;
      this.message = info.message;
      // URL of the script where the error was raised
      this.fileName = info.fileName || info.filename;
      this.stack = info.stack || (info.error && info.error.stack);
    } else if (typeof info === "string") {
      this.message = info;
    }
  }
}

/**
 * 对比两个错误
 * @param  {ExtractInfo}  e1
 * @param  {ExtractInfo}  e2
 * @return {Boolean}
 */
export function isSameEEI(e1: ExtractInfo, e2: ExtractInfo) {
  return isObjectEqual(e1, e2);
}
