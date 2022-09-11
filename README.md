<img src="./public/pixil_logox200.png"/>

# PIXIL (Scopiolabs fork🍴)

A TypeScript open-source hackable pixel editor powered by PIXI.js

Almost everything is exposed, extendable, and modular for bending this editor to your needs

[demo🎨](https://2mer.github.io/#/PIXIL/)

[demo code⌨](https://github.com/2mer/2mer.github.io/blob/master/src/screens/PIXIL/Demo.tsx)

## Installation:

```sh
npm i @scopio/pixil
```

```sh
yarn add @scopio/pixil
```

```sh
pnpm add @scopio/pixil
```

## Features:

- [x] Layers
- [x] Tools
  - [x] Brush
  - [x] Eraser
  - [ ] Fill
- [x] History
- [x] Plugins

### History

History is opt-in as to not bloat your memory when not necessary
to enable history:

```js
editor.history.enabled = true;
```

you can also limit the amount of entries in the history (no limit by default):

```js
editor.history.limit = 100; // 100 entries
```
