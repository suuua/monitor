import { ExtractInfo } from '@/helpers/info.js';

describe('ExtractInfo extract the error information', () => {
  it('Extract: Error instance', () => {
    let message = 'this is a test error';
    let fileName = 'test.js';
    let line = 8;
    let err = new Error(message, fileName, fileName);
    let errorInfo = new ExtractInfo(err);
    expect(errorInfo.message).toEqual(message);
    // fileName fileName is not a standard
    // expect(errorInfo.line).toEqual(line);
    // expect(errorInfo.fileName).toEqual(fileName);
    expect(errorInfo.stack).toEqual(jasmine.any(String));
  });

  it('Extract: String', () => {
    let message = 'this is a test error';
    let errorInfo = new ExtractInfo(message);
    expect(errorInfo.message).toEqual(message);
  });

  it('Extract: Object', () => {
    let errorDesc = {
      lineno: 1,
      colno: 2,
      message: 'this is a test error',
      fileName: 'index.js',
      error: new Error('this is a test error')
    };
    let extractInfo = new ExtractInfo(errorDesc);

    expect(extractInfo.message).toEqual(errorDesc.message);
    expect(extractInfo.lineno).toEqual(errorDesc.lineno);
    expect(extractInfo.colno).toEqual(errorDesc.colno);
    expect(extractInfo.fileName).toEqual(errorDesc.fileName);
    expect(extractInfo.stack).toEqual(jasmine.any(String));
  });

  it('Extract: ErrorEvent', () => {
    // TIPS ErrorEvent constructor only support model broswer
    let error = new ErrorEvent('sync', {
      message: 'this is a test error',
      lineno: 1,
      colno: 2,
      filename: 'index.js',
      error: new Error('this is a test error')
    });
    let extractInfo = new ExtractInfo(error);

    expect(extractInfo.message).toEqual(error.message);
    expect(extractInfo.lineno).toEqual(error.lineno);
    expect(extractInfo.colno).toEqual(error.colno);
    expect(extractInfo.fileName).toEqual(error.filename);
    expect(extractInfo.stack).toEqual(jasmine.any(String));
  });
});