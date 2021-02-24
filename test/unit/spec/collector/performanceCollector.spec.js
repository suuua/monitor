import PerformanceCollector from '@/collector/performanceCollector.js';
import Collector from '@/collector/base.js';
import { ExtractInfo } from '@/helpers/info.js';
// import Monitor from '@D/Monitor.js';
// const PerformanceCollector = Monitor.PerformanceCollector;

describe('PerformanceCollector report web performance', () => {

  it('PerformanceCollector: inherit base collector', () => {
    let performanceCollector = new PerformanceCollector();
    expect(performanceCollector instanceof Collector).toEqual(true);
  });

  /**
   * 这里没有 针对load事件里面的程序进行单元测试，因为执行测试用例时页面已经onload
   */
  it('PerformanceCollector: report ', () => {
    let fn1 = jasmine.createSpy('fn1');
    let performanceCollector = new PerformanceCollector({
      reporter: fn1
    });
    expect(fn1).toHaveBeenCalledWith(
      jasmine.objectContaining(new ExtractInfo(JSON.stringify({
        timing: window.performance.timing,
        effectiveType: window.navigator.connection.effectiveType,
        rtt: window.navigator.connection.rtt
      }))),
      jasmine.objectContaining({
        from: jasmine.any(PerformanceCollector)
      })
    );
  });
});