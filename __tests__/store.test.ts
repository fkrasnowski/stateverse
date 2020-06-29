import stateverse, { Store } from '../lib/index';

test('returns current state', () => {
  expect(new Store(0).state).toBe(0);
});

let $store: stateverse.Store<string>;

beforeEach(() => {
  $store = new Store('').addReducers({
    set(state, value) {
      return value;
    },
  });
  $store.actions.set('bird');
});

test('reducers changes state', () => {
  expect($store.state).toBe('bird');
});

test('calls callback on watch', (done) => {
  const callback = jest.fn((state: string) => {
    expect(state).toBe('ladybird');
    done();
  });
  $store.watch(callback);
  $store.actions.set('ladybird');
  expect(callback).toHaveBeenCalledTimes(1);
});

test('calls callback on action watch', (done) => {
  const callback = jest.fn((value: any) => {
    expect(value).toBe('star');
    done();
  });
  $store.actions.set.watch(callback);
  $store.actions.set('star');
  expect(callback).toHaveBeenCalledTimes(1);
});

test('executes effects', (done) => {
  const fireFx = jest.fn(async (reducers) => {
    reducers.set('fire');
    done();
  });
  $store.addEffects({ fireFx });

  $store.actions.fireFx();
  expect(fireFx).toBeCalled();
  expect($store.state).toBe('fire');
});

describe('canceling effects', () => {
  let cleanupFn: jest.Mock;
  let waterFx: stateverse.Effect;

  beforeEach(() => {
    cleanupFn = jest.fn();
    waterFx = async (
      reducers: stateverse.Actions,
      cleanup: (fn: stateverse.Cleanup) => void
    ) => {
      cleanup(cleanupFn);
      setTimeout(() => reducers.set('water'), 5000);
    };
    $store.addEffects({ waterFx });
    $store.actions.waterFx();
    $store.actions.set('rock');
  });

  test('runs cleanup on cancel', () => {
    expect(cleanupFn).toBeCalled();
  });

  test('prevents canceled effects to modify state', () => {
    expect($store.state).toBe('rock');
  });
});
