import asset from '../asset.js';
import period from '../period.js';

describe('Performance Test', () => {
  let flatReturns;
  let increasingReturns;
  let decreasingReturns;
  let volUpReturns;
  let volDownReturns;

  beforeAll(() => {
    flatReturns = asset(
        [0.1, 0.1, 0.1],
        period(4, 3),
    ).getPerformance();
    increasingReturns = asset(
        [0.1, 0.2, 0.3],
        period(4, 3),
    ).getPerformance();
    decreasingReturns = asset(
        [-0.1, -0.2, -0.3],
        period(4, 3),
    ).getPerformance();
    volUpReturns = asset(
        [0.1, -0.2, 0.3], period(4, 3),
    ).getPerformance();
    volDownReturns = asset(
        [-0.2, 0.1, -0.4], period(4, 3),
    ).getPerformance();
  });

  it('gets CAGR accurately', () => {
    expect(flatReturns['CAGR']).toEqual('0.1000');
    expect(increasingReturns['CAGR']).toEqual('0.1972');
    expect(decreasingReturns['CAGR']).toEqual('-0.2042');
    expect(volUpReturns['CAGR']).toEqual('0.04586');
    expect(volDownReturns['CAGR']).toEqual('-0.1918');
  });

  it('gets vol accurately', () => {
    expect(flatReturns['Vol']).toEqual('0.000');
    expect(increasingReturns['Vol']).toEqual('0.08165');
    expect(decreasingReturns['Vol']).toEqual('0.08165');
    expect(volUpReturns['Vol']).toEqual('0.2055');
    expect(volDownReturns['Vol']).toEqual('0.2055');
  });

  it('gets MaxDD accurately', () => {
    expect(flatReturns['MDD']).toEqual('0.000');
    expect(increasingReturns['MDD']).toEqual('0.000');
    expect(decreasingReturns['MDD']).toEqual('-0.4960');
    expect(volUpReturns['MDD']).toEqual('-0.2000');
    expect(volDownReturns['MDD']).toEqual('-0.4720');
  });
});
