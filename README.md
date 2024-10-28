# holiday-app-ts

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

## .env Setup

```sh
rename .env_sample.txt to .env and change api url to actual
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


Questions:
1.	Is the solution of creating a list of buttons to switch the year correct when the button is implemented as RouterLink with corresponding query? In this case, all links are mouted to the DOM whith class="router-link-active router-link-exact-active".
2.	Is it the correct approach to make additional request to display the country name on the country page? Would it be better to use storing the list of countries in SessionStorage?

