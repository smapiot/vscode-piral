import * as vscode from 'vscode';
import { resolve } from 'path';
import { CommandTreeItem } from './items';
import {
  getRepoType,
  RepoType,
  getWorkspaceRoot,
  getVersionOfDependency,
  readJson,
  piralFramework,
  getBundler,
} from '../helpers';

function getWorkspaceRootDir(repoType: RepoType) {
  if (repoType === RepoType.Pilet || repoType === RepoType.Piral) {
    const workspaceFolder = getWorkspaceRoot();

    if (workspaceFolder !== undefined) {
      return workspaceFolder.uri.fsPath;
    }
  }

  return '';
}

function getPiralInfos(rootDir: string) {
  const packageJson = readJson(resolve(rootDir, 'package.json'));
  // const piralJson = readJson(resolve(rootDir, 'piral.json'));
  const piralName = packageJson.name;
  const piralVersion = packageJson.version;
  const cliVersion = getVersionOfDependency('piral-cli');
  const bundler = getBundler(packageJson);

  return [
    new CommandTreeItem('Piral', '', [
      new CommandTreeItem(`Name: ${piralName}`, '', undefined),
      new CommandTreeItem(`Version: ${piralVersion}`, '', undefined),
    ], ''),
    new CommandTreeItem('Piral CLI', '', [
      new CommandTreeItem(`Version: ${cliVersion}`, '', undefined),
      new CommandTreeItem(`Bundler: ${bundler?.name ?? '(none)'}`, '', undefined),
    ], ''),
    new CommandTreeItem(
      'Piral Plugins', '',
      Object.keys(packageJson.dependencies)
        .filter(
          (key) =>
            key.startsWith('piral-') &&
            !piralFramework.includes(key) &&
            key !== 'piral-cli' &&
            !key.startsWith('piral-cli-'),
        )
        .map((key) => {
          const version = getVersionOfDependency(key);
          return new CommandTreeItem(`${key} (${version})`, '', undefined, key);
        }),
    ),
  ];
}

function getPiletInfos(rootDir: string) {
  const packageJson = readJson(resolve(rootDir, 'package.json'));
  const piletJson = readJson(resolve(rootDir, 'pilet.json'));
  const piletName = packageJson.name;
  const piletVersion = packageJson.version;
  const appName = Object.keys(piletJson?.piralInstances || {}).shift() || packageJson.piral?.name || '';
  const appVersion = getVersionOfDependency(appName);
  const cliVersion = getVersionOfDependency('piral-cli');
  const bundler = getBundler(packageJson);

  return [
    new CommandTreeItem('Pilet', '', [
      new CommandTreeItem(`Name: ${piletName}`, '', undefined),
      new CommandTreeItem(`Version: ${piletVersion}`, '', undefined),
    ]),
    new CommandTreeItem('App Shell', '', [
      new CommandTreeItem(`Name: ${appName}`, '', undefined),
      new CommandTreeItem(`Version: ${appVersion}`, '', undefined),
    ]),
    new CommandTreeItem('Piral CLI', '', [
      new CommandTreeItem(`Version: ${cliVersion}`, '', undefined),
      new CommandTreeItem(`Bundler: ${bundler?.name ?? '(none)'}`,'', undefined),
    ]),
    new CommandTreeItem(
      'Dependencies', '',
      Object.keys(packageJson.dependencies || {}).map((key) => {
        const version = getVersionOfDependency(key);
        return new CommandTreeItem(`${key} (${version})`, '', undefined);
      }),
    ),
  ];
}

export class WorkspaceInfoDataProvider implements vscode.TreeDataProvider<CommandTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CommandTreeItem | undefined> = new vscode.EventEmitter<
  CommandTreeItem | undefined
  >();
  readonly onDidChangeTreeData: vscode.Event<CommandTreeItem | undefined> = this._onDidChangeTreeData.event;

  data: Array<CommandTreeItem> = [];

  constructor() {}

  getTreeItem(element: CommandTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: CommandTreeItem | undefined): vscode.ProviderResult<Array<CommandTreeItem>> {
    if (element === undefined) {
      return this.data;
    }

    return element.children;
  }

  refresh() {
    this.getAvailableCommands();
    this._onDidChangeTreeData.fire(undefined);
  }

  private getAvailableCommands() {
    const repoType = getRepoType();
    const rootDir = getWorkspaceRootDir(repoType);

    switch (repoType) {
      case RepoType.Piral:
        this.data = getPiralInfos(rootDir);
        vscode.window.showInformationMessage('Piral instance workspace found.');
        break;
      case RepoType.Pilet:
        this.data = getPiletInfos(rootDir);
        vscode.window.showInformationMessage('Pilet workspace found.');
        break;
      case RepoType.Undefined:
      default:
        this.data = [];
        break;
    }
  }
}
