import { chain, includes, isObjectEqual } from "@/helpers/utils.js"

describe('utils', () => {
  it('chain: call the function one by one', () => {
    let spy1 = jasmine.createSpy('spy1');
    let spy2 = jasmine.createSpy('spy2');
    let spy3 = jasmine.createSpy('spy3');
    let env = { i: 2 };
    let fn1 = function () { spy3(this.i) }
    let runner = chain(spy1, spy2, undefined);
    runner('hello');
    expect(spy1).toHaveBeenCalledWith('hello');
    expect(spy2).toHaveBeenCalledWith('hello');
   
    runner = chain(env, spy1, spy2, fn1);
    runner();
    expect(spy3).toHaveBeenCalledWith(2);
  });

  it('includes: ', () => {
    let arr = [1, 2, 3, 4];
    expect(includes(arr, 3)).toEqual(true);
    expect(includes(arr, 5)).toEqual(false);
    expect(includes([], 5)).toEqual(false);
    expect(includes(null, 5)).toEqual(false);
  });

  it('isObjectEqual: compare Object', () => {
    let a = null;
    let b = null;
    expect(isObjectEqual(a, b)).toEqual(true)

    a = null
    b = undefined
    expect(isObjectEqual(a, b)).toEqual(false)

    let t = new Date()
    a = { a: 1, b: { c: 2 }, d: [3, 4, 5], t: t }
    b = { a: 1, b: { c: 2 }, d: [3, 4, 5], t: t }
    expect(isObjectEqual(a, b)).toEqual(true)

    b = { a: 1, b: { c: 2 }, d: [3, 4, 2], t: t }
    expect(isObjectEqual(a, b)).toEqual(false)

    b = { a: 1, b: { c: 2 }, d: [3, 4, 6] }
    expect(isObjectEqual(a, b)).toEqual(false)


  });
});