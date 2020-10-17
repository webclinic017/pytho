import { portfolio } from '../portfolio.js'

describe('Portfolio Test', () => {

  let fakeReturns;
  let fakeReturns2;
  let fakeReturns3;

  beforeAll(() => {
    fakeReturns = [
      [0.1, 0.1, 0.1],
      [0.1, 0.1, 0.1],
      [0.1, 0.1, 0.1]
    ]
    fakeReturns2 = [
      [0.1, 0.2, 0.1],
      [0.1, 0.2, 0.1],
      [0.1, 0.2, 0.1]
    ]
    fakeReturns3 = [
      [0.1, 0.2, -0.1],
      [0.1, 0.2, -0.1],
      [0.1, 0.2, -0.1]
    ]
  })

  it('calculates performance correctly', () => {
    const port = portfolio(100, fakeReturns)
    port.tryUpdateWeight(0, 100)
    port.nextStep()
    port.nextStep()
    const perf = port.getPerformance()

    const port2 = portfolio(100, fakeReturns2)
    port2.tryUpdateWeight(0, 100)
    port2.nextStep()
    port2.nextStep()
    const perf2 = port2.getPerformance()

    const port3 = portfolio(100, fakeReturns3)
    port3.tryUpdateWeight(0, 100)
    port3.nextStep()
    port3.nextStep()
    const perf3 = port3.getPerformance()

    expect(perf['portfolioPerf']).toEqual(perf['assetsPerf'][0])
    expect(perf2['portfolioPerf']).toEqual(perf2['assetsPerf'][0])
    expect(perf2['portfolioPerf']).toEqual(perf3['assetsPerf'][0])
  })

  it('can be created without error', () => {
     const port = portfolio(100, fakeReturns)
     expect(port).toBeTruthy()
  })
 
  it('won\'t run beyond the length of returns', () => {
     const port = portfolio(100, fakeReturns, 3)
     port.tryUpdateWeight(0, 33)
     port.tryUpdateWeight(1, 33)
     port.tryUpdateWeight(2, 33)
     port.nextStep()
     port.nextStep()
     port.nextStep()
     const lastVal = port.getValue()
     port.nextStep()
     const beyondVal = port.getValue()
     expect(lastVal).toEqual(beyondVal)
  })

  it('increments periods correct', () => {
     const port = portfolio(100, fakeReturns)
     port.tryUpdateWeight(0, 100)

     expect(port.period.getPeriod()).toBe(0)

     port.nextStep()
     expect(port.period.getPeriod()).toBe(1)

     port.nextStep()
     expect(port.period.getPeriod()).toBe(2)
  })
  
  it('updates the value of the portfolio accurately', () => {
     const port = portfolio(100, fakeReturns)
     port.tryUpdateWeight(0, 100)
     const firstRets = [1,2,3].map(v => {
       port.nextStep()
       return port.getValue()
     })

     const port2 = portfolio(100, fakeReturns2)
     port2.tryUpdateWeight(0, 100)
     const secondRets = [1,2,3].map(v => {
       port2.nextStep()
       return port2.getValue()
     })

     const port3 = portfolio(100, fakeReturns3)
     port3.tryUpdateWeight(0, 100)
     const thirdRets = [1,2,3].map(v => {
       port3.nextStep()
       return port3.getValue()
     })

     const expectedVal = (((100 * 1.1) * 1.1) * 1.1).toFixed(2)
     const expectedVal2 = (((100 * 1.1) * 1.2) * 1.1).toFixed(2) 
     const expectedVal3 = (((100 * 1.1) * 1.2) * 0.9).toFixed(2) 

     expect(firstRets[0]).not.toEqual(firstRets[1])
     expect(firstRets[2]).toEqual(expectedVal)

     expect(secondRets[0]).not.toEqual(secondRets[1])
     expect(secondRets[2]).toEqual(expectedVal2)

     expect(thirdRets[0]).not.toEqual(thirdRets[1])
     expect(thirdRets[2]).toEqual(expectedVal3)
  })

  it('can change weights over time', () => {
     const port = portfolio(100, fakeReturns)
     const didUpdateOne = port.tryUpdateWeight(0, 100)
     const canStepOne = port.nextStep()
    
     const didUpdateTwo = port.tryUpdateWeight(0, 50)
     const canStepTwo = port.nextStep()
     const secondVal = port.getValue()

     expect(didUpdateOne).toBe(true)
     expect(canStepOne).toBe(true)
     expect(didUpdateTwo).toBe(true)
     expect(canStepTwo).toBe(true)
     expect(secondVal).toBe("115.50")
  })
  
})
