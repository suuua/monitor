import Duplicate from '@/helpers/duplicate'
import { ExtractInfo } from '@/helpers/info'

describe('Duplicate:', () => {
  it('Use to judge duplicate error', () => {
    let duplicate = new Duplicate()

    let eei1 = new ExtractInfo({
      lineno: 1,
      colno: 10,
      message: 'sync Error',
      stack: '[xxxxx 1:10]: aaabbbccc',
      fileName: 'xxx.js'
    })
    let eei2 = new ExtractInfo(eei1)
    expect(duplicate.isDuplicate()).toEqual(false)
    expect(duplicate.isDuplicate(eei1)).toEqual(false)
    expect(duplicate.isDuplicate(eei2)).toEqual(true)

    eei2 = new ExtractInfo({
      lineno: 1,
      colno: 10,
      message: 'script Error',
      fileName: 'xxx.js'
    })
    expect(duplicate.isDuplicate(eei2)).toEqual(false)

    eei2 = new ExtractInfo(eei2)
    expect(duplicate.isDuplicate(eei2)).toEqual(true)

    eei1 = new ExtractInfo(eei1)
    expect(duplicate.isDuplicate(eei1)).toEqual(true)

  })

  it('limit same error with timeout', () => {
    let timeLimit = 500
    let duplicate = new Duplicate({ timeLimit })
    let eei1 = new ExtractInfo({
      lineno: 1,
      colno: 10,
      message: 'sync Error',
      stack: '[xxxxx 1:10]: aaabbbccc',
      fileName: 'xxx.js'
    })
    let eei2 = new ExtractInfo({
      lineno: 1,
      colno: 10,
      message: 'script Error',
      fileName: 'xxx.js'
    })
    function createTp() {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res()
        }, timeLimit + 100)
      })
    }
    expect(duplicate.isDuplicate(eei1)).toEqual(false)
    expect(duplicate.isDuplicate(eei2)).toEqual(false)
    return createTp().then(() => {
      eei1 = new ExtractInfo(eei1)
      expect(duplicate.isDuplicate(eei1)).toEqual(false)
      expect(duplicate.isDuplicate(eei1)).toEqual(true)
      return createTp()
    }).then(() => {
      eei2 = new ExtractInfo(eei2)
      expect(duplicate.isDuplicate(eei2)).toEqual(false)
    }).catch(_ => {});
  })
})
