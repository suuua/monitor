import Collector from '@/collector/base.js'
import Reporter from '@/reporter/base.js'
import { ExtractInfo } from '@/helpers/info.js';
describe('Collector: ', () => {
  it('Call hook beforeReport before report', () => {
    const param = new ExtractInfo({ message: 'la' })
    const beforeReport = (eei, ext) => {
      expect(eei).toEqual(jasmine.objectContaining({ message: 'la' }));
      expect(ext).toEqual(jasmine.objectContaining({ from: collector }))
    }
    const reporter = (eei) => { eei.message = 'flag' }
    const collector = new Collector({ reporter, beforeReport })
    
    collector.__report(param)
  })
  it('Use fn or Reporter to report log', () => {
    const spy = jasmine.createSpy('spy')
    const param = new ExtractInfo({ message: 'la' })
    const collector1 = new Collector({ reporter: spy })
    collector1.__report(param)
    expect(spy).toHaveBeenCalledWith(param, jasmine.objectContaining({ from: collector1 }))

    const reporter = new Reporter()
    const spy2 = jasmine.createSpy('spy2')
    const collector2 = new Collector({ reporter: reporter })
    reporter.addReport = spy2
    collector2.__report(param)
    expect(spy2).toHaveBeenCalledWith(param, jasmine.objectContaining({ from: collector2 }))
  })
  it('use Duplicate to discard duplicate data', () => {
    const reporter = jasmine.createSpy('reporter')
    const collector = new Collector({ reporter })
    const extractInfo = new ExtractInfo({ message: 'duplicate' })
    collector.__report(extractInfo)
    collector.__report(extractInfo)
    collector.__report(extractInfo)
    expect(reporter).toHaveBeenCalledTimes(1);
  })
})