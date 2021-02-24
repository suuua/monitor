/**
 * 将日志信息写为一个本地的文件上传到服务器，为了不截断日志信息，这里大小只是近似的大小
 * @author zc
 */

// @flow

import { warn, isFunction } from "../helpers/utils";
import Duplicate from "../helpers/duplicate";
import Reporter from "./base";
import Collector from "../collector/base";
import LogCollector from "../collector/logCollector";
import PerformanceCollector from "../collector/performanceCollector";
import GlobalErrorCollector from "../collector/globalErrorCollector";
import { ExtractInfo } from "../helpers/info";

const hasFile = "File" in window;

export default class FileReporter extends Reporter {
  fileName: string;
  maxSize: number;
  __currentSize: number;
  __fileText: string;
  constructor({
    submit,
    maxSize = 5 * 1024,
    fileName = "log"
  }: {
    submit?: File => any,
    maxSize: number,
    fileName: string
  } = {}) {
    super({ submit });
    this.fileName = fileName;
    // Bytes
    this.maxSize = maxSize;
    this.__currentSize = 0;

    this.__fileText = "";
  }

  addReport(report?: ExtractInfo, ext: ExtInfos) {
    let preText = "";
    if (!report || !hasFile) return this;

    // for view log file
    /* istanbul ignore next */
    if (ext.from instanceof LogCollector) {
      switch (ext.level) {
        case LogCollector.LEVEL_LOG:
          preText = "[LOG] ";
          break;
        case LogCollector.LEVEL_INFO:
          preText = "[LOG] ";
          break;
        case LogCollector.LEVEL_WARN:
          preText = "[WARN] ";
          break;
        case LogCollector.LEVEL_ERROR:
          preText = "[ERROR] ";
          break;
      }
    } else if (ext.from instanceof PerformanceCollector) {
      preText = "[PERFORMANCE] ";
    } else if (ext.from instanceof GlobalErrorCollector) {
      preText = "[ERROR] ";
    } else {
      preText = "[UNKNOWN] ";
    }

    this.addText(preText + JSON.stringify(report) + "\n");

    return this;
  }

  /**
   * 计算字符串大小， File api默认以utf-8编码
   * @param  {String} str
   * @return {Number}        大小(Bytes)
   */
  computeSize(str: string) {
    let size = 0;
    let len = str.length;
    for (let i = 0; i < len; i++) {
      // charCodeAt 在多字节字符只能返回第一个字节的值
      let code = str.codePointAt(i);
      // https://en.wikipedia.org/wiki/UTF-8#Byte_order_mark  https://tools.ietf.org/html/rfc3629 网站使用的 utf-8 编码
      if (code <= 0x7f) {
        size += 1;
      } else if (code <= 0x7ff) {
        size += 2;
      } else if (code <= 0xffff) {
        size += 3;
      } else if (code <= 0x10ffff) {
        size += 4;
      }

      // https://en.wikipedia.org/wiki/UTF-16  js内部表示以utf-16编码
      // if (code <= 0xFFFF) {
      //   size += 2;
      // } else {
      //   size += 4;
      // }
    }

    return size;
  }

  addText(text: string) {
    let size = this.computeSize(text);
    if (this.__currentSize + size > this.maxSize) {
      this.__submit();
    }
    this.__fileText += text;
    this.__currentSize += this.computeSize(text);
    return this;
  }

  clearText() {
    this.__fileText = "";
    this.__currentSize = 0;
    return this;
  }

  forceSubmit() {
    this.__fileText &&
      isFunction(this.submit) &&
      this.submit(this.__generateFile());
    return this;
  }

  __submit() {
    isFunction(this.submit) && this.submit(this.__generateFile());
    this.clearText();
  }

  __generateFile(text?: string) {
    let fileName =
      typeof this.fileName === "function"
        ? this.fileName()
        : typeof this.fileName === "string"
        ? this.fileName
        : `log.${+new Date()}`;
    return new File([text || this.__fileText], `${fileName}.txt`, {
      type: "text/plain"
    });
  }

  get currentSize() {
    return this.__currentSize;
  }
  get currentFileText() {
    return this.__fileText;
  }
}
