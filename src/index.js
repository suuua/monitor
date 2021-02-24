// @flow
import Reporter from "./reporter/base.js";
import FileReporter from "./reporter/fileReporter.js";
import Collector from "./collector/base.js";
import GlobalErrorCollector from "./collector/globalErrorCollector.js";
import LogCollector from "./collector/logCollector.js";
import PerformanceCollector from "./collector/performanceCollector.js";

// edit by run build
const version = "0.0.1";

export default function Monitor({
  globalError,
  log,
  performance
}: MonitorConfig = {}) {
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
