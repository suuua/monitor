// @flow
import type Reporter from "./reporter/base";
import type Collector from "./collector/base";
import type { ExtractInfo } from "./helpers/info";

declare type reporterFn = (ExtractInfo, ExtInfos) => any;

declare interface CollectorConfig {
  reporter?: Reporter | reporterFn;
  beforeReport?: reporterFn;
  collect?: Array<"runtime" | "resource" | "rejection">;
  level?: number;
}

declare interface MonitorConfig {
  globalError?: CollectorConfig;
  log?: CollectorConfig;
  performance?: CollectorConfig;
}

declare interface ExtInfos {
  from?: Collector;
  level?: number;
}
