import { wachable } from '../src/index';

test('calls callback on wachable call', (done) => {
  const callback = jest.fn((v) => {
    expect(v).toBe('plane');
    done();
  });
  const wachableFn = wachable(() => 'ship');
  wachableFn.watch(callback);
  wachableFn('plane');
  expect(callback).toBeCalledTimes(1);
});
