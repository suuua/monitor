/**
 * @author zc
 * @standard https://www.w3.org/TR/navigation-timing/
 * @flow
 *
 * 目前这里是把整个timing丢到服务器上去
 *
 * DNS = timing.domainLookupStart - timing.domainLookupEnd
 *
 * HTTP链接建立时间；当为https时，存在一个属性名为secureConnectionStart指的是ssl/tls建立的开始时间
 * connect = timing.connectStart - timing.connectEnd;
 *
 * requestReponse = timing.responseEnd  - timing.requestStart
 *
 * dom 加载到domContentLoaded的触发时间
 * domLoaded = timing.domContentLoadedEventStart  - timing.domLoading
 *
 * domContentLoadedEvent的执行时间
 * domContentLoadedEvent = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart
 *
 * dom完成时间，包括dom子资源的加载
 * domComplete = timing.domComplete - timing.domLoading
 *
 * loadevent 执行时间
 * loadEvent = timing.loadEventEnd - timing.loadEventStart
 *
 * 白屏时间 用responseEnd还是domLoading呢
 * firstScreen = timing.domLoading - timing.navigationStart
 *
 * 输入ur到触发domContentLoaded的时间
 * domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart
 *
 * 输入ur到触发loaded的时间
 * loaded = timing.loadEventEnd  - timing.navigationStart
 */

import Collector from "./base.js";

const g = window;

export default class PerformanceCollector extends Collector {
  constructor(opt?: CollectorConfig) {
    super(opt);
    this.__addHandler();
  }
  __addHandler() {
    let report = () => {
      this.__report(
        this.createExtractInfo({
          message: JSON.stringify({
            timing: g.performance.timing,
            // chrome > 61 Experiment
            effectiveType:
              g.navigator.connection && g.navigator.connection.effectiveType,
            rtt: g.navigator.connection && g.navigator.connection.rtt
          })
        })
      );
    };
    /* istanbul ignore else */
    if (document.readyState === "complete") {
      report();
    } else {
      // TODO 这里用window.onload 还是 document.onreadystatechange 呢
      g.addEventListener("load", report);
    }
  }
}
