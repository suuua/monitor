/**
 * 收集器的基类
 * @author zc
 * @flow
 *
 * TODO  一些mvvm框架内部捕获的错误
 * TODO  针对一些频繁的错误去重?
 */

import { warn } from "../helpers/utils";
import Reporter from "../reporter/base";
import { ExtractInfo } from "../helpers/info.js";
import Duplicate from "../helpers/duplicate";

export default class Collector {
  reporter: void | Reporter | reporterFn;
  beforeReport: void | reporterFn;
  __duplicate: Duplicate;
  constructor({ reporter, beforeReport }: CollectorConfig = {}) {
    this.reporter = reporter;
    this.beforeReport = beforeReport;
    // 控制重复错误的提交频率
    this.__duplicate = new Duplicate();
  }
  __report(eei: ExtractInfo, ext: {} = {}) {
    let extinfos: { from: Collector } = {
      ...ext,
      from: this
    };
    if (this.reporter && !this.__duplicate.isDuplicate(eei)) {
      // 防止reporter途中抛出错误导致循环不停的上报错误
      try {
        // TODO beforeReport can abort process
        this.beforeReport && this.beforeReport(eei, extinfos);
        /* istanbul ignore else */
        if (typeof this.reporter === "function") {
          this.reporter(eei, extinfos);
        } else if (this.reporter instanceof Reporter) {
          this.reporter.addReport(eei, extinfos);
        }
      } catch (_) {
        /* istanbul ignore next */
        process.env.NODE_ENV !== "production" && warn(_);
      }
    }
  }
  createExtractInfo(info: any) {
    return new ExtractInfo(info);
  }
}
