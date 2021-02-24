'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

/**
 * 返回一个链式调用的函数（职责链）
 * @param  {Anything} env 调用环境或待调用函数
 * @param  {Array<function>} fns 待用函数
 * @return {Function}     一个链式调用的函数
 */
function chain(env) {
  for (var _len = arguments.length, fns = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    fns[_key - 1] = arguments[_key];
  }

  return function () {
    var bindEnv;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (env && typeof env === "function") {
      env.apply(bindEnv, args);
    } else {
      bindEnv = env;
    }

    for (var i = 0; i < fns.length; i++) {
      fns[i] && fns[i].apply(bindEnv, args);
    }
  };
}
/**
 * Array.prototype.includes 为es6语法，需要引入polyfill此处简单实现一个
 * @param  {Array<any>} arr  待查询列表
 * @param  {Anything} item 查询目标
 * @return {Boolean}      查询结果
 */

function includes(arr, item) {
  if (!arr || !arr.length) {
    return false;
  }

  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === item) {
      return true;
    }
  }

  return false;
}
function isObjectEqual() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (!a || !b) return a === b;
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key]; // check nested equality

    if (_typeof(aVal) === "object" && _typeof(bVal) === "object") {
      return isObjectEqual(aVal, bVal);
    }

    return String(aVal) === String(bVal);
  });
}
/* istanbul ignore next */

function assertDevConsole(consoleType, msg) {
  if (process.env.NODE_ENV === "development") {
    console[consoleType](msg);
  }
}
/* istanbul ignore next */

function warn(msg) {
  assertDevConsole("warn", "[monitor] ".concat(msg));
}
function isFunction(fn) {
  return typeof fn === "function";
}

var ExtractInfo =
/**
 * constructor
 * @param  {Error|ErrorEvent|ExtractInfo|Object|String} info 错误信息
 */
function ExtractInfo() {
  var info = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, ExtractInfo);

  if (_typeof(info) === "object") {
    // Error.prototype.lineNumber and Error.prototype.fileName is not standard
    this.lineno = info.lineNumber || info.lineno;
    this.colno = info.columnNumber || info.colno;
    this.message = info.message; // URL of the script where the error was raised

    this.fileName = info.fileName || info.filename;
    this.stack = info.stack || info.error && info.error.stack;
  } else if (typeof info === "string") {
    this.message = info;
  }
};
/**
 * 对比两个错误
 * @param  {ExtractInfo}  e1
 * @param  {ExtractInfo}  e2
 * @return {Boolean}
 */

function isSameEEI(e1, e2) {
  return isObjectEqual(e1, e2);
}

var Reporter =
/*#__PURE__*/
function () {
  /**
   * 构造函数
   * @param  {Function} options.submit 提交方法，接收一个报告，例如用于提交报告到服务器
   */
  function Reporter() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$submit = _ref.submit,
        submit = _ref$submit === void 0 ? function () {} : _ref$submit;

    _classCallCheck(this, Reporter);

    this.submit = submit;
  }

  _createClass(Reporter, [{
    key: "addReport",
    value: function addReport(eei, ext) {
      return this;
    }
  }]);

  return Reporter;
}();

var Duplicate =
/*#__PURE__*/
function () {
  function Duplicate() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$timeLimit = _ref.timeLimit,
        timeLimit = _ref$timeLimit === void 0 ? 10 * 1000 : _ref$timeLimit;

    _classCallCheck(this, Duplicate);

    // 限流多长时间不重复
    this.timeLimit = timeLimit; // 存储旧信息的队列，中间可能会存在空条目 TODO 先观察下，后续再考虑需不需要使用优先队列

    this.__queue = [];
  }
  /**
   * isDuplicate 是否是重复消息
   * @param  {ExtractInfo} eei 待校验
   * @return {Boolean}
   */


  _createClass(Duplicate, [{
    key: "isDuplicate",
    value: function isDuplicate(eei) {
      if (!eei) return false;
      var clone = new ExtractInfo(eei); // let qlen = this.__queue.length

      var emptySeat = -1;

      function setEmptySeat(i) {
        if (emptySeat < 0) emptySeat = i;
      } // 在比较过程中会进行简单的清理
      // let includes = this.__queue.findIndex((item, i) => {
      //   if (item) {
      //     if (this.__isTimeout(item)) {
      //       this.__queue[i] = null
      //       setEmptySeat(i)
      //       return false
      //     } else if (isSameEEI(item.eei, eei)) {
      //       item.t = +new Date()
      //       return true
      //     } else {
      //       return false
      //     }
      //   } else {
      //     setEmptySeat(i)
      //     return false
      //   }
      // })
      // for Compatibility


      var includes = -1;

      for (var i = 0; i < this.__queue.length; i++) {
        var item = this.__queue[i];

        if (item) {
          if (this.__isTimeout(item)) {
            this.__queue[i] = null;
            setEmptySeat(i);
          } else if (isSameEEI(item.eei, eei)) {
            item.t = +new Date();
            includes = i;
            break;
          }
        } else {
          setEmptySeat(i);
        }
      }

      if (includes < 0) {
        if (emptySeat > -1) {
          this.__queue[emptySeat] = {
            eei: clone,
            t: +new Date()
          };
        } else {
          this.__queue.push({
            eei: clone,
            t: +new Date()
          });
        }
      }

      return includes > -1;
    }
  }, {
    key: "__isTimeout",
    value: function __isTimeout(item) {
      return new Date() - item.t > this.timeLimit;
    }
  }]);

  return Duplicate;
}();

var Collector =
/*#__PURE__*/
function () {
  function Collector() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        reporter = _ref.reporter,
        beforeReport = _ref.beforeReport;

    _classCallCheck(this, Collector);

    this.reporter = reporter;
    this.beforeReport = beforeReport; // 控制重复错误的提交频率

    this.__duplicate = new Duplicate();
  }

  _createClass(Collector, [{
    key: "__report",
    value: function __report(eei) {
      var ext = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var extinfos = _objectSpread({}, ext, {
        from: this
      });

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
  }, {
    key: "createExtractInfo",
    value: function createExtractInfo(info) {
      return new ExtractInfo(info);
    }
  }]);

  return Collector;
}();

var LogCollector =
/*#__PURE__*/
function (_Collector) {
  _inherits(LogCollector, _Collector);

  function LogCollector() {
    var _this;

    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, LogCollector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LogCollector).call(this, opt));
    _this.level = opt.level || 0; // this.__reactConsole();

    return _this;
  }
  /**
   * 不应该使用console.log 去提交日志，因为console.log会在控制台打印日志
   */


  _createClass(LogCollector, [{
    key: "log",
    value: function log(msg) {
      var level = LogCollector.LEVEL_LOG;

      if (this.level <= level) {
        this.__report(this.createExtractInfo(msg), {
          level: level
        });
      }
    }
  }, {
    key: "info",
    value: function info(msg) {
      var level = LogCollector.LEVEL_INFO;

      if (this.level <= level) {
        this.__report(this.createExtractInfo(msg), {
          level: level
        });
      }
    }
  }, {
    key: "warn",
    value: function warn$$1(msg) {
      var level = LogCollector.LEVEL_WARN;

      if (this.level <= level) {
        this.__report(this.createExtractInfo(msg), {
          level: level
        });
      }
    }
  }, {
    key: "error",
    value: function error(msg) {
      var level = LogCollector.LEVEL_ERROR;

      if (this.level <= level) {
        this.__report(this.createExtractInfo(msg), {
          level: level
        });
      }
    }
  }], [{
    key: "LEVEL_LOG",
    get: function get() {
      return 1;
    }
  }, {
    key: "LEVEL_INFO",
    get: function get() {
      return 2;
    }
  }, {
    key: "LEVEL_WARN",
    get: function get() {
      return 3;
    }
  }, {
    key: "LEVEL_ERROR",
    get: function get() {
      return 4;
    }
  }]);

  return LogCollector;
}(Collector);

var g$1 = window;

var PerformanceCollector =
/*#__PURE__*/
function (_Collector) {
  _inherits(PerformanceCollector, _Collector);

  function PerformanceCollector(opt) {
    var _this;

    _classCallCheck(this, PerformanceCollector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PerformanceCollector).call(this, opt));

    _this.__addHandler();

    return _this;
  }

  _createClass(PerformanceCollector, [{
    key: "__addHandler",
    value: function __addHandler() {
      var _this2 = this;

      var report = function report() {
        _this2.__report(_this2.createExtractInfo({
          message: JSON.stringify({
            timing: g$1.performance.timing,
            // chrome > 61 Experiment
            effectiveType: g$1.navigator.connection && g$1.navigator.connection.effectiveType,
            rtt: g$1.navigator.connection && g$1.navigator.connection.rtt
          })
        }));
      };
      /* istanbul ignore else */


      if (document.readyState === "complete") {
        report();
      } else {
        // TODO 这里用window.onload 还是 document.onreadystatechange 呢
        g$1.addEventListener("load", report);
      }
    }
  }]);

  return PerformanceCollector;
}(Collector);

var g$2 = window;

var GlobalErrorCollector =
/*#__PURE__*/
function (_Collector) {
  _inherits(GlobalErrorCollector, _Collector);

  function GlobalErrorCollector() {
    var _this;

    var opt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, GlobalErrorCollector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(GlobalErrorCollector).call(this, opt));
    _this.collect = opt.collect || ["runtime", "resource", "rejection"];

    _this.__addHandler();

    return _this;
  }

  _createClass(GlobalErrorCollector, [{
    key: "__addHandler",
    value: function __addHandler() {
      var _this2 = this;

      /**
       * run time error
       * https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror
       * onerror 相较于addEventListener有更好的兼容性，并且资源加载失败的错误信息无法通过onerror捕获
       * 当加载自不同域的脚本中发生语法错误时，为避免信息泄露 语法错误的细节将不会报告，而是抛出script error
       */

      /* istanbul ignore else */
      if (includes(this.collect, "runtime")) {
        g$2.onerror = chain(function (message, filename, lineNumber, columnNumber, error) {
          _this2.__report(_this2.createExtractInfo({
            message: message,
            filename: filename,
            lineNumber: lineNumber,
            columnNumber: columnNumber,
            error: error
          }), {
            source: "error"
          });
        }, g$2.onerror && g$2.onerror.bind(g$2));
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
        g$2.addEventListener("error", function (e) {
          var elm = e.srcElement;

          if (isCatchSourceElm(elm)) {
            var sourceInfo = collectSourceElmInfo(elm);

            _this2.__report(_this2.createExtractInfo({
              message: "source error [".concat(sourceInfo.url, "] ")
            }), {
              source: "error:source"
            });
          }
        }, true);
      }
      /**
       * Promise uncatch error
       */

      /* istanbul ignore else */


      if (includes(this.collect, "rejection")) {
        g$2.addEventListener("unhandledrejection", function (e) {
          // e.reason from promise uncatch error
          _this2.__report(_this2.createExtractInfo(e.reason), {
            source: "unhandledrejection"
          });
        });
      }
    }
  }]);

  return GlobalErrorCollector;
}(Collector);

function isCatchSourceElm(elm) {
  return elm instanceof HTMLScriptElement || elm instanceof HTMLLinkElement;
}

function collectSourceElmInfo(elm) {
  var report = {};

  if (elm instanceof HTMLScriptElement) {
    report.url = elm.src;
  } else if (elm instanceof HTMLLinkElement) {
    report.url = elm.href;
  }

  return report;
}

var hasFile = "File" in window;

var FileReporter =
/*#__PURE__*/
function (_Reporter) {
  _inherits(FileReporter, _Reporter);

  function FileReporter() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        submit = _ref.submit,
        _ref$maxSize = _ref.maxSize,
        maxSize = _ref$maxSize === void 0 ? 5 * 1024 : _ref$maxSize,
        _ref$fileName = _ref.fileName,
        fileName = _ref$fileName === void 0 ? "log" : _ref$fileName;

    _classCallCheck(this, FileReporter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(FileReporter).call(this, {
      submit: submit
    }));
    _this.fileName = fileName; // Bytes

    _this.maxSize = maxSize;
    _this.__currentSize = 0;
    _this.__fileText = "";
    return _this;
  }

  _createClass(FileReporter, [{
    key: "addReport",
    value: function addReport(report, ext) {
      var preText = "";
      if (!report || !hasFile) return this; // for view log file

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

  }, {
    key: "computeSize",
    value: function computeSize(str) {
      var size = 0;
      var len = str.length;

      for (var i = 0; i < len; i++) {
        // charCodeAt 在多字节字符只能返回第一个字节的值
        var code = str.codePointAt(i); // https://en.wikipedia.org/wiki/UTF-8#Byte_order_mark  https://tools.ietf.org/html/rfc3629 网站使用的 utf-8 编码

        if (code <= 0x7f) {
          size += 1;
        } else if (code <= 0x7ff) {
          size += 2;
        } else if (code <= 0xffff) {
          size += 3;
        } else if (code <= 0x10ffff) {
          size += 4;
        } // https://en.wikipedia.org/wiki/UTF-16  js内部表示以utf-16编码
        // if (code <= 0xFFFF) {
        //   size += 2;
        // } else {
        //   size += 4;
        // }

      }

      return size;
    }
  }, {
    key: "addText",
    value: function addText(text) {
      var size = this.computeSize(text);

      if (this.__currentSize + size > this.maxSize) {
        this.__submit();
      }

      this.__fileText += text;
      this.__currentSize += this.computeSize(text);
      return this;
    }
  }, {
    key: "clearText",
    value: function clearText() {
      this.__fileText = "";
      this.__currentSize = 0;
      return this;
    }
  }, {
    key: "forceSubmit",
    value: function forceSubmit() {
      this.__fileText && isFunction(this.submit) && this.submit(this.__generateFile());
      return this;
    }
  }, {
    key: "__submit",
    value: function __submit() {
      isFunction(this.submit) && this.submit(this.__generateFile());
      this.clearText();
    }
  }, {
    key: "__generateFile",
    value: function __generateFile(text) {
      var fileName = typeof this.fileName === "function" ? this.fileName() : typeof this.fileName === "string" ? this.fileName : "log.".concat(+new Date());
      return new File([text || this.__fileText], "".concat(fileName, ".txt"), {
        type: "text/plain"
      });
    }
  }, {
    key: "currentSize",
    get: function get() {
      return this.__currentSize;
    }
  }, {
    key: "currentFileText",
    get: function get() {
      return this.__fileText;
    }
  }]);

  return FileReporter;
}(Reporter);

var version = "0.0.2";
function Monitor() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      globalError = _ref.globalError,
      log = _ref.log,
      performance = _ref.performance;

  this.globalErrorCollector = new GlobalErrorCollector(globalError);
  this.logCollector = new LogCollector(log);
  this.performanceCollector = new PerformanceCollector(performance);
}
Monitor.version = version;
Monitor.Collector = Collector;
Monitor.GlobalErrorCollector = GlobalErrorCollector;
Monitor.LogCollector = LogCollector;
Monitor.PerformanceCollector = PerformanceCollector;
Monitor.Reporter = Reporter;
Monitor.FileReporter = FileReporter;

module.exports = Monitor;
