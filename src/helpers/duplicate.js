/**
 * 用于对重复出现的错误进行去重，在一定时间内不重复收集
 * @author zc
 * @flow
 */
import { ExtractInfo, isSameEEI } from "./info";

interface QueueItem {
  eei: ExtractInfo;
  t: number;
}

export default class Duplicate {
  timeLimit: number;
  __queue: Array<QueueItem | null>;
  constructor({ timeLimit = 10 * 1000 }: { timeLimit?: number } = {}) {
    // 限流多长时间不重复
    this.timeLimit = timeLimit;
    // 存储旧信息的队列，中间可能会存在空条目 TODO 先观察下，后续再考虑需不需要使用优先队列
    this.__queue = [];
  }
  /**
   * isDuplicate 是否是重复消息
   * @param  {ExtractInfo} eei 待校验
   * @return {Boolean}
   */
  isDuplicate(eei: ExtractInfo) {
    if (!eei) return false;
    let clone = new ExtractInfo(eei);
    // let qlen = this.__queue.length
    let emptySeat = -1;
    function setEmptySeat(i: number) {
      if (emptySeat < 0) emptySeat = i;
    }
    // 在比较过程中会进行简单的清理

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
    let includes = -1;
    for (let i = 0; i < this.__queue.length; i++) {
      let item = this.__queue[i];
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
        this.__queue[emptySeat] = { eei: clone, t: +new Date() };
      } else {
        this.__queue.push({ eei: clone, t: +new Date() });
      }
    }

    return includes > -1;
  }
  __isTimeout(item: QueueItem) {
    return new Date() - item.t > this.timeLimit;
  }
}
