import Monitor from '@/index.js';

const Collector = Monitor.Collector;
const GlobalErrorCollector = Monitor.GlobalErrorCollector;
const LogCollector = Monitor.LogCollector;
const PerformanceCollector = Monitor.PerformanceCollector;

describe('Monitor', () => {
  it('Monitor: initalize all collect', () => {
    const options = {
      globalError: {
        collect: ['runtime', 'resource', 'rejection']
      },
      log: {
        level: 1,
      },
      performance: {}
    };
    const monitor = new Monitor(options);

    expect(monitor.globalErrorCollector instanceof GlobalErrorCollector).toEqual(true);
    expect(monitor.globalErrorCollector).toEqual(jasmine.objectContaining(options.globalError));

    expect(monitor.logCollector instanceof LogCollector).toEqual(true);
    expect(monitor.logCollector).toEqual(jasmine.objectContaining(options.log));

    expect(monitor.performanceCollector instanceof PerformanceCollector).toEqual(true);
  });
});