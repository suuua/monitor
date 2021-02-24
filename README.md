# 日志收集

日志上报

## Todo

- \*.common.js在babel下会被添加import语法，导致触发webpack的import和module.exports不能同时出现的限制，解决办法
- babel忽略此文件
- 发布为npm包
- 替换使用umd模块包，通过script标签全局引入或require

## 基本用法

## 1. collector

collector用于收集日志信息，所有的collector都继承于Collector基类，上报数据使用reporter

### 1.1 Collector基类

基类的参数使用于所有子类
Collector基类提供一个__report方法，当collector收集到日志时，会调用__report方法提交到reporter中；__report会对重复的错误进行过滤
beforeReport为一个生命周期钩子，在把日志提交到reporter之前会触发这个钩子，并提供错误信息和ext信息。

```javascript
  const beforeReport = (eei, ext) => {
    // eei 是错误信息对象，ext是由各个子类提供的信息
  }
  const collector = new Collector({
    reporter，
    beforeReport
  })
  class MyCollector extends Collector {
    constructor(opt) {
      super(opt);
      // 上报日志
      this.__report(...)
    }
  }
```

### 1.2 GlobalErrorCollector

GlobalErrorCollector，用于收集全局抛出的错误信息，包括:

- 运行时错误
- script/link 资源加载错误
- 未捕获的Promise异常

```javascript
  const globalErrorCollector = new GlobalErrorCollector({
    collect,  // ['runtime', 'resource', 'rejection'] 数组，用于指定收集哪些日志
  })
```

### 1.3 PerformanceCollector

用于收集页面performance信息

## 2. reporter

reporter用于上报收集来的日志信息，所有reporter都继承于Reporter基类

### 2.1 Reporter基类

需要提供一个submit方法用来上报日志

### 2.2 FileReporter

将日志写入一个文件，并上报

```javascript
  function submit(file) {
    // 这里接收到一个文件然后可以提交到目标服务器
  }
  const fileReporter = new FileReporter({
    submit,
    // 文件最大大小，这里的大小指的是文件的内容大小；实际文件会包含其他信息，大小可能会超过此
    maxSize: 5 * 1024,
    // 文件名称，支持函数(返回字符串)或字符串，在为字符串是会默认在后面拼接上.timestamp.txt
    fileName: 'log'
  })
```
