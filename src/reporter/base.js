/**
 * @description 用来实例化提交信息功能，后续基于此优化日志的提交，实现合并等功能
 * @author zc
 *
 * TODO  离线存储，合并上报 ...
 */

// @flow

import { warn } from "../helpers/utils";
import { ExtractInfo } from "../helpers/info";

export default class Reporter {
  submit: (...args: any) => any;
  /**
   * 构造函数
   * @param  {Function} options.submit 提交方法，接收一个报告，例如用于提交报告到服务器
   */
  constructor({
    submit = () => {}
  }: { submit?: (...args: Array<any>) => any } = {}) {
    this.submit = submit;
  }
  addReport(eei: ExtractInfo, ext: ExtInfos) {
    return this;
  }
}
