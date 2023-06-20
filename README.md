# Stateful YouTube

Firefox extension. Early draft

Save watched YouTube videos & playing positions.

## Requirements

-   bash (Linux) or git-bash (Windows)
-   For building: Node 18 LTS & npm 8. Tested on:
    -   node: 18.16.0
    -   npm: 9.5.1
-   For dist: 7zip
    -   Windows: Add 7zip to PATH
-   Tested on Ubuntu 22.04 & Windows 10
-   Tested on Firefox 114.0.2
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
