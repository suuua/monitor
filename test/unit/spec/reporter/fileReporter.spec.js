import FileReporter from '@/reporter/fileReporter'
import { ExtractInfo } from '@/helpers/info.js'

describe('FileReporter', () => {
  let extractInfo = new ExtractInfo({
    lineno: 1,
    colno: 2,
    message: 'this is a test error',
    stack: 'error stack will be empty or fill with stack info',
    fileName: 'index.js',
  })

  it('Compute file bytes, ', () => {
    let fileReporter = new FileReporter();
    // 1 + 1 + 1
    let str1 = [String.fromCodePoint(0x1), String.fromCodePoint(0x70), String.fromCodePoint(0x7F)].join('')
    // 2 + 2 + 2
    let str2 = [String.fromCodePoint(0x80), String.fromCodePoint(0x7F0), String.fromCodePoint(0x7FF)].join('')
    // 3 + 3 + 3
    let str3 = [String.fromCodePoint(0x800), String.fromCodePoint(0x8FFF), String.fromCodePoint(0xFFFF)].join('')
    
    let strCN = "a你好啊，小小"

    expect(fileReporter.computeSize(str1)).toEqual(3);

    expect(fileReporter.computeSize(str2)).toEqual(6);

    expect(fileReporter.computeSize(str3)).toEqual(9);

    expect(fileReporter.computeSize(strCN)).toEqual(19);
  })

  it('addReport to add a none empty report', () => {
    let fileReporter = new FileReporter()
    // add report
    fileReporter.addReport(extractInfo, { from: null })
    let size1 = fileReporter.currentSize
    // not add report
    fileReporter.addReport()
    expect(fileReporter.currentSize).toEqual(size1);
  })

  it('currentSize get the current size', () => {
    let fileReporter = new FileReporter()
    fileReporter.addReport(extractInfo, { from: null })
    expect(fileReporter.currentSize > 0).toEqual(true)
  })

  it('currentFileText get current text', () => {
    let fileReporter = new FileReporter()
    fileReporter.addReport(extractInfo, { from: null })
    expect(
      fileReporter.currentFileText.indexOf(JSON.stringify(extractInfo)) > -1
    ).toEqual(true)
  })

  it('forceSubmit submit file immediate', () => {
    let spy1 = jasmine.createSpy('spy1')
    let fileReporter = new FileReporter({ maxSize: 1024 * 5, submit: spy1 })

    // add report
    fileReporter.addReport(extractInfo, { from: null })
    fileReporter.forceSubmit();
    expect(spy1).toHaveBeenCalledWith(jasmine.any(File))
  })

  it('Report a file with size limit', () => {
    let spy1 = jasmine.createSpy('spy1')
    let fileReporter = new FileReporter({ maxSize: 200, submit: spy1 })

    // add report
    fileReporter.addReport(extractInfo, { from: null })
    let size1 = fileReporter.currentSize

    // trigger submit
    extractInfo.lineno = 2
    fileReporter.addReport(new ExtractInfo(extractInfo), { from: null })

    expect(spy1).toHaveBeenCalledWith(jasmine.any(File))
  });

})