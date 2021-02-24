import GlobalErrorCollector from '@/collector/globalErrorCollector.js';
import Collector from '@/collector/base.js';
import { ExtractInfo } from '@/helpers/info.js';
//import Monitor from '@D/Monitor.js';
//const GlobalErrorCollector = Monitor.GlobalErrorCollector;

describe('GlobalErrorCollector report global error', () => {

  it('GlobalErrorCollector: inherit base collector', () => {
    let globalErrorCollector = new GlobalErrorCollector();
    expect(globalErrorCollector instanceof Collector).toEqual(true);
  });
  /**
   * TODO 全局抛出错误会导致测试框架不执行
   */
  // it('Report run time error', (done) => {
  //   let errMsg = 'tester globalErrorCollector';
  //   setTimeout(() => {
  //     done.fail('uncatch run time error');
  //   }, 500);
  //   globalErrorCollector.reporter = function (info) {
  //     if (isEmptyReport(info)) {
  //       done.fail('run time has a empty report');
  //     } else {
  //       done();
  //     }
  //   };
  // });

  it('GlobalErrorCollector: Report script/link load error', () => {
    let globalErrorCollector = new GlobalErrorCollector()
    let spy1 = jasmine.createSpy('spy1')
    let spy2 = jasmine.createSpy('spy2')
    let spy3 = jasmine.createSpy('spy3')

    let elm = loadScriptError();
    globalErrorCollector.reporter = spy1;
    return tp().then(() => {
      expect(spy1).toHaveBeenCalledWith(jasmine.any(ExtractInfo), jasmine.anything())

      let elm = loadLinkError();
      globalErrorCollector.reporter = spy2;
      return tp();
    }).then(() => {
      expect(spy2).toHaveBeenCalledWith(jasmine.any(ExtractInfo), jasmine.anything())

      let elm = loadImgError()
      return tp();
    }).then(() => {
      expect(spy3).not.toHaveBeenCalled()
    });
  });

  it('GlobalErrorCollector: Report promise uncatch error', () => {
    let globalErrorCollector = new GlobalErrorCollector()
    let spy1 = jasmine.createSpy('spy1')
    globalErrorCollector.reporter = spy1
    promiseError();
    return tp().then(() => {
      expect(spy1).toHaveBeenCalledWith(jasmine.any(ExtractInfo), jasmine.anything())
    });
  });

});

function tp() { 
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, 1000)
  }); 
}

function promiseError() {
  return new Promise(() => { throw new Error('test') });
}

function loadScriptError() {
  let elm = document.createElement('script');
  elm.src = '/error-uri';
  document.body.appendChild(elm);
  return elm;
}

function loadLinkError() {
  let elm = document.createElement('link');
  elm.rel = 'stylesheet'
  elm.href = '/error-uri2';
  document.body.appendChild(elm);
  return elm;
}

function loadImgError() {
  let elm = document.createElement('img');
  elm.src = '/error-uri3';
  document.body.appendChild(elm);
  return elm;
}

function isEmptyReport(report) {
  let str = JSON.stringify(report);
  return !str || str === '{}';
}