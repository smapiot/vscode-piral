# Changelog

All notable changes to the "piral-vscode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## 0.3

- Fixed issue if `dependencies` section of *package.json* does not exist
- Fixed persistence when switching tabs using the scaffold dialog
- Fixed scaffolding to always use most recent version of `piral-cli`
- Updated dependencies
- Updated minimum supported version of Node.js to 16
- Added support for `piral.json` and `pilet.json` (#28)
- Added support for Bun as package manager
- Added support for Bun as a bundler

## 0.2

- Linked dependencies to their READMEs (#10)
- Linked documentation pages (#11)
- Changed to use / prefer local `piral-cli` instance (#12)
- Redesigned the create project dialog (#13)
- Automated releases of the extension
- Added Open VSX registry as release target

## 0.1

- Fixed workspace issue (#6)
- Added support for `.codegen` file (#4)

## 0.0.1

- Initial release on the VS Code marketplace
