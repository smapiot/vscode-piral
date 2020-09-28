# `piral-vscode`

The official VS Code extension for Piral.

## Overview

This extension is a useful companion when developing Piral based app shells, or pilets for existing app shells.

It can be regarded as a visualizer for the `piral-cli` command line utility. However, our plan is to extend it with more functionality, usually tied very closely to the VS Code editing experience.

### Features

Right now the following features are part of this extension:

- A workspace panel info with plugins, dependencies, versions, ...
- Additions to the command palette using useful commands (e.g., `piral debug`)
- A provider for `.codegen` files (essentially using JavaScript as language)
- Webview for scaffolding new projects (Piral instances or pilets)

## Development

### Installation

Clone the repository and install the dependencies using `npm`:

```sh
npm i
```

Then open VS Code (`code .`) and run it using `F5`.

### Publish

For publishing the official command line tool `vsce` should be used.

```sh
vsce package
vsce publish -p <token>
```

This will package the current version of the repository and publish it. Make sure to have the right token specified. Follow the [instructions outlined here](https://code.visualstudio.com/api/working-with-extensions/publishing-extension#get-a-personal-access-token) to get a new one.
