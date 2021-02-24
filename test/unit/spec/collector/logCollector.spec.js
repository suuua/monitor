import LogCollector from '@/collector/logCollector.js';
import Collector from '@/collector/base.js';

// import Monitor from '@D/Monitor.js';
// const LogCollector = Monitor.LogCollector;

describe('LogCollector', () => {

  it('LogCollector: inherit base collector', () => {
    let logCollector = new LogCollector();
    expect(logCollector instanceof Collector).toEqual(true);
  });

  it('LogCollector: Report with log level', () => {
    let logCollector = new LogCollector({ level: LogCollector.LEVEL_LOG });

    let fn1 = jasmine.createSpy('fn1');
    logCollector.reporter = fn1;
    logCollector.log('1');
    logCollector.info('2');
    logCollector.warn('3');
    logCollector.error('4');
    expect(fn1).toHaveBeenCalledTimes(4);
    
    let fn2 = jasmine.createSpy('fn2');
    logCollector.level = LogCollector.LEVEL_INFO;
    logCollector.reporter = fn2;
    logCollector.log('5');
    logCollector.info('6');
    logCollector.warn('7');
    logCollector.error('8');
    expect(fn2).toHaveBeenCalledTimes(3);
    
    let fn3 = jasmine.createSpy('fn3');
    logCollector.level = LogCollector.LEVEL_WARN;
    logCollector.reporter = fn3;
    logCollector.log('9');
    logCollector.info('10');
    logCollector.warn('11');
    logCollector.error('12');
    expect(fn3).toHaveBeenCalledTimes(2);

    let fn4 = jasmine.createSpy('fn4');
    logCollector.level = LogCollector.LEVEL_ERROR;
    logCollector.reporter = fn4;
    logCollector.log('13');
    logCollector.info('14');
    logCollector.warn('15');
    logCollector.error('16');
    expect(fn4).toHaveBeenCalledTimes(1);
    expect(fn4).toHaveBeenCalledWith(jasmine.objectContaining({
      message: '16'
    }), jasmine.objectContaining({
        from: jasmine.any(LogCollector)
    }));

  });
});