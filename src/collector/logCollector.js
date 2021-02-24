/**
 * 手动添加的一些日志点的上报，通过重写console来捕获日志
 * @author zc
 * @flow
 */

import Collector from "./base";
import { assertDevConsole } from "../helpers/utils";
// import { chain } from '../helpers/utils.js';

const g = window;

export default class LogCollector extends Collector {
  level: number;
  constructor(opt: CollectorConfig = {}) {
    super(opt);
    this.level = opt.level || 0;
    // this.__reactConsole();
  }

  /**
   * 不应该使用console.log 去提交日志，因为console.log会在控制台打印日志
   */
  log(msg: string) {
    const level = LogCollector.LEVEL_LOG;
    if (this.level <= level) {
      this.__report(this.createExtractInfo(msg), { level });
    }
  }

  info(msg: string) {
    const level = LogCollector.LEVEL_INFO;
    if (this.level <= level) {
      this.__report(this.createExtractInfo(msg), { level });
    }
  }

  warn(msg: string) {
    const level = LogCollector.LEVEL_WARN;
    if (this.level <= level) {
      this.__report(this.createExtractInfo(msg), { level });
    }
  }

  error(msg: string) {
    const level = LogCollector.LEVEL_ERROR;
    if (this.level <= level) {
      this.__report(this.createExtractInfo(msg), { level });
    }
  }

  static get LEVEL_LOG() {
    return 1;
  }
  static get LEVEL_INFO() {
    return 2;
  }
  static get LEVEL_WARN() {
    return 3;
  }
  static get LEVEL_ERROR() {
    return 4;
  }
}
