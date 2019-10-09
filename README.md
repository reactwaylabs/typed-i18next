# typed-i18next

Generating TypeScript types from translations.

[![NPM version](https://img.shields.io/npm/v/typed-i18next.svg?logo=npm)](https://www.npmjs.com/package/typed-i18next)
[![NPM version](https://img.shields.io/npm/v/typed-i18next/canary.svg?logo=npm)](https://www.npmjs.com/package/typed-i18next/v/canary)

[![Build Status](https://img.shields.io/azure-devops/build/reactway/reactway/17/master.svg?logo=azuredevops)](https://dev.azure.com/reactway/ReactWay/_build/latest?definitionId=17&branchName=master)
[![Code coverage](https://img.shields.io/azure-devops/coverage/reactway/reactway/17/master.svg)](https://dev.azure.com/reactway/ReactWay/_build/latest?definitionId=17&branchName=master)

[![Dependencies](https://img.shields.io/david/reactway/typed-i18next.svg)](https://david-dm.org/reactway/typed-i18next)
[![Dev dependencies](https://img.shields.io/david/dev/reactway/typed-i18next.svg)](https://david-dm.org/reactway/typed-i18next?type=dev)

## Features

-   [x] Generates TypeScript declaration file.
-   [x] Check if generated declaration file is up-to-date (useful for CI).
-   [x] Support [folder structure](#folder-structure): `[languageName]/**/[namespace].json`.
-   [ ] Support file structure: `[languageName].json`.
-   [ ] Combine translations keys from different sources.
-   [x] Strictly typed `const { t } = useTranslation()` from `react-i18next` package. [Example](#react-i18next)

## Get started

Install `typed-i18next` package.

```sh
$ npm install typed-i18next
```

Latest `dev` build is published under canary tag.

```sh
$ npm install typed-i18next@canary
```

To start using the tool:

```sh
$ typed-i18next -h
```

### Example

When generating TypeScript types:

```sh
$ typed-i18next -i ./src/i18next/translations -o ./src/i18next/translations.d.ts
```

In CI translation types can be check if they are up-to-date with `--check` flag:

```sh
$ typed-i18next -i ./src/i18next/translations -o ./src/i18next/translations.d.ts --check
```

## CLI Usage

```sh
$ typed-i18next -h
```

### Configuration

| CLI Flag                       | Type                                                               | Description                                        | Default  |
| ------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------- | -------- |
| -i, --input \<path\>           | string                                                             | location where translations are located            |          |
| -o, --outputFile \<file-path\> | string                                                             | location where to generate definitions file        |          |
| --check [boolean]              | boolean                                                            | check if generated file up to date (useful for CI) | false    |
| --logLevel \<level\>           | `"silent"`, `"error"`, `"warning"`, `"info"`, `"debug"`, `"trace"` | console log level                                  | `"info"` |

## Translation file structures

### Folder structure

Example translations file structure:

```
.
└── translations/
    ├── en/
    │   ├── commons.json
    │   ├── validation.json
    │   ├── glosarry.json
    │   └── pages/
    │       ├── login.json
    │       └── register.json
    └── lt/
        ├── commons.json
        ├── validation.json
        ├── glosarry.json
        └── pages/
            ├── login.json
            └── register.json
```

## Types

### `react-i18next`

```ts
import { useTranslation } from "react-i18next";
import { StrictTypedTranslations } from "typed-i18next/react";
// Declaration file "translations.d.ts" that we generated with `typed-i18next` tool.
import { Translations } from "./translations";

export const useStrictTranslation = useTranslation as StrictTypedTranslations<typeof useTranslation, Translations>;
```

## License

Released under the [MIT license](LICENSE).
