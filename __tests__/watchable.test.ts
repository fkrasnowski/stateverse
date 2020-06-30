import { watchable } from '../src/index';

test('calls callback on wachable call', (done) => {
  const callback = jest.fn((v) => {
    expect(v).toBe('plane');
    done();
  });
  const watchableFn = watchable(() => 'ship');
  watchableFn.watch(callback);
  watchableFn('plane');
  expect(callback).toBeCalledTimes(1);
});
