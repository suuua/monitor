/**
 * 采集全局的报错信息
 * @author zc
 * @flow
 */

import Collector from "./base";
import { chain, includes } from "../helpers/utils";
const g = window;

export default class GlobalErrorCollector extends Collector {
  collect: Array<"runtime" | "resource" | "rejection">;
  constructor(opt: CollectorConfig = {}) {
    super(opt);
    this.collect = opt.collect || ["runtime", "resource", "rejection"];
    this.__addHandler();
  }
  __addHandler() {
    /**
     * run time error
     * https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
     * onerror 相较于addEventListener有更好的兼容性，并且资源加载失败的错误信息无法通过onerror捕获
     * 当加载自不同域的脚本中发生语法错误时，为避免信息泄露 语法错误的细节将不会报告，而是抛出script error
     */
    /* istanbul ignore else */
    if (includes(this.collect, "runtime")) {
      g.onerror = chain(
        (message, filename, lineNumber, columnNumber, error) => {
          this.__report(
            this.createExtractInfo({
              message,
              filename,
              lineNumber,
              columnNumber,
              error
            }),
            { source: "error" }
          );
        },
        g.onerror && g.onerror.bind(g)
      );
    }

    /**
     * Source load fail error
     * https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
     * 不会冒泡所以要在事件捕获阶段捕获，并且捕获到的是一个Event对象的实例，而不是ErrorEvent
     *
     * 这一块需要考虑下是否有必要，如果上报的话在用户网络情况不好时会产生大量的错误
     */
    /* istanbul ignore else */
    if (includes(this.collect, "resource")) {
      g.addEventListener(
        "error",
        e => {
          let elm: Element = e.srcElement;
          if (isCatchSourceElm(elm)) {
            let sourceInfo = collectSourceElmInfo(elm);
            this.__report(
              this.createExtractInfo({
                message: `source error [${sourceInfo.url}] `
              }),
              { source: "error:source" }
            );
          }
        },
        true
      );
    }

    /**
     * Promise uncatch error
     */
    /* istanbul ignore else */
    if (includes(this.collect, "rejection")) {
      g.addEventListener("unhandledrejection", e => {
        // e.reason from promise uncatch error
        this.__report(this.createExtractInfo(e.reason), {
          source: "unhandledrejection"
        });
      });
    }
  }
}

function isCatchSourceElm(elm: Element) {
  return elm instanceof HTMLScriptElement || elm instanceof HTMLLinkElement;
}

function collectSourceElmInfo(elm: Element) {
  let report = {};
  if (elm instanceof HTMLScriptElement) {
    report.url = elm.src;
  } else if (elm instanceof HTMLLinkElement) {
    report.url = elm.href;
  }
  return report;
}
