# Stateful YouTube

Firefox extension. Early draft

Save watched YouTube videos & playing positions.

## Requirements

-   bash (Linux) or git-bash (Windows)
-   Build: Node 18 LTS & npm 8. Tested on:
    -   node: 18.12.1
    -   npm: 8.19.2
-   Dist: 7zip
-   Tested on Ubuntu 22.04
-   Tested on Firefox 108.0.1
-   (Works in Chrome as long as v2 extensions are permitted) TODO not tested

## Install dependencies

```
npm ci
```

## Development

```
npm run dev
```

## Make a release

(Currently only works on Linux; WSL works fine)

```
npm run dist <VERSION>
```

## Create sourcecode archive for Mozilla review

(Currently only works on Linux; WSL works fine)

`npm run sourcecode <VERSION>`
