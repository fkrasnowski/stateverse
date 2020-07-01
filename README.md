# stateverse 👽

Async state manager - painless manager for async state changes and side effects

## Installation

```sh
# npm
npm i --save stateverse

# yarn
yarn add stateverse
```

## Features

- 👣 Minimalistic API
- 👨‍👩‍👧‍👦 Framework agnostic
- 🦾 TypeScript support

## Example

```js
const counter = createStore(0)
  .addReducers({
    add: (state, v) => state + v,
    sub: (state, v) => state - v,
    reset: () => 0,
  })
  .addEffects({
    countDownFx: async (reducers, cleanup) => {
      const interval = setInterval(() => {
        if (counter.state > 0) reducers.inc();
        else clearInterval(interval);
      }, 1000);
      cleanup(() => {
        clearInterval(interval);
      });
    },
  });

counter.watch((count) => console.log(`counter: ${count}`));

counter.actions.add.watch((v) => console.log(`add: ${v}`));

counter.actions.sub.watch((v) => console.log(`substract: ${v}`));

counter.actions.add(10);
//add: 10
//counter: 10
counter.actions.sub(5);
// substract: 5
// counter: 5
counter.actions.countDownFx();
// substract: 1
// counter: 4
// substract: 1
// counter: 3
//...
```

## Core concepts

### Store

It's an object that holds state. You can define many stores. To define one use `createStore` factory:

```js
import { createStore } from 'stateverse';

const store = createStore({ state });
```

### Action

**Action** is either `reducer` or `effect`. Actions represent an intention to change `state`. `actions` can be attached to the store. Call action from actions property of store:

```js
store.actions.addData({ login: 'fkrasnowski', password: '☜(ﾟヮﾟ☜)' });
```

### Reducer

**Reducer** is a function that takes state (and additional values) and returns a new state that replaces the old one. Reducers must be `pure`. To define reducers use `.addReducers` method:

```js
store.addReducers({
  addData: (state, data) => ({ ...state, data }),
});
```

### Effect

**Effect** is a container for asynchronous state changes. `Effect` has access to all `reducers` of the `store`. Store runs one effect at the same time. If another `action` is triggered before effect finish, the effect is being canceled and the cleanup function is executed. To define effect use `.addEffects` method:

```js
store.addEffects({
  loadDataFx: async (reducers, cleanup, id) => {
    reducers.setLoading(true);
    const data = await fetchData(id);
    reducers.addData(data);
    reducers.setLoading(false);
  },
});
```

### Cleanup

Some `effects` of course demand `cleanup`. To add so provide your `cleanup` function as an argument for `cleanup`. The `cleanup` function is attached asynchronously so implement it as early as possible:

```js
const countDownFx = async (reducers, cleanup) => {
      const interval = setInterval(() => {
        if (counter.state > 0) reducers.inc();
        else clearInterval(interval);
      }, 1000);
      cleanup(() => {
        clearInterval(interval);
      });
    },

```

### Watchable

**Watchable** is a function that can be watched. It means you can attach a `callback` to be triggered while function is called. `Actions` are watchable by default. You can create a `watchable` from function like so:

```js
import { watchable } from 'stateverse';

const watchableFn = watchable((v) => v + 👀);
  watchableFn.watch((...args) => console.log('watchout!',...args)));
  watchableFn('💥') //Logs: wachout! 💥
```

### Inner state ⚠

It's really **important** to understand this idea. **Stateverse** assumes that `effects` break the integrity of the state in general. That's why effects are _`auto-canceled`_ while new `action` is being invoked. The new `action` does not operate on `state` from within canceled effect. It takes the `state` from **before** the effect has affected it! This is the so-called **inner state** - an unexposed state accessible **only** by reducers that are protected from inconstant changes

## API

#### `createStore<T>(initialState: T): stateverse.Store<T>`

Returns store that holds state of type `T`

#### `.state`

Returns current state

#### `.watch(callback: (state: T) => any)`

Attaches a `callback` function to observe state changes

#### `.unwatch(callback: (state: T) => any)`

Detaches a callback function from observation

```js
const callbackFn = fn.spy();
store.watch(callbackFn); //Attaches: callbackFn
//...
store.unwatch(callbackFn); //Detaches: callbackFn
```

#### `.actions.<action-name>.watch(callback: (...values: any) => any)`

Triggers `callback` on action call with `values` (arguments) provided to the action

#### `.map<T, S>(mapFn: (state: T) => S): stateverse.WatchStore<T, S>`

A map function to map state and watch only for particular state changes

```js
arrayStore.map((state) => state[0]).watch(console.log);
```

#### `Reducer<T> = (state: T, ...values: any) => T`

A pure function that takes state as first argument and additional values provided on action call

#### `Effect = (reducers: Actions, cleanup: (cleanupFn: Cleanup) => void, ...values: any) => Promise<void>`

A function returning `Promise` (`async function`)

#### `.addReducers(reducers: Reducers<T>)`

Adds `reducers` to store

#### `.addEffects(effects: Effects)`

Adds `effects` to store

#### `watchable(fn: Function): watchableFn`

Creates function with additional methods `.watch` and `.unwatch`

## Complementary packages

- **React:** [stateverse-react](https://github.com/fkrasnowski/stateverse-react)
