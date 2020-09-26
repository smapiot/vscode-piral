import * as vscode from 'vscode';
import { resolve } from 'path';
import {
  getRepoType,
  RepoType,
  getWorkspaceRoot,
  getVersionOfDependency,
  readPackageJson,
  bundlers,
  piralFramework,
} from './helper';

function getWorkspacePackageJson(repoType: RepoType) {
  if (repoType === RepoType.Pilet || repoType === RepoType.Piral) {
    const workspaceFolder = getWorkspaceRoot();

    if (workspaceFolder !== undefined) {
      const filePath = resolve(workspaceFolder.uri.fsPath, 'package.json');
      return readPackageJson(filePath);
    }
  }

  return '';
}

export class WorkspaceInfoDataProvider implements vscode.TreeDataProvider<InfoTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<InfoTreeItem | undefined> = new vscode.EventEmitter<
    InfoTreeItem | undefined
  >();
  readonly onDidChangeTreeData: vscode.Event<InfoTreeItem | undefined> = this._onDidChangeTreeData.event;

  data: Array<InfoTreeItem> = [];

  constructor() {}

  getTreeItem(element: InfoTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: InfoTreeItem | undefined): vscode.ProviderResult<Array<InfoTreeItem>> {
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
    const packageJson = getWorkspacePackageJson(repoType);

    switch (repoType) {
      case RepoType.Piral:
        this.getPiralInfos(packageJson);
        break;
      case RepoType.Pilet:
        this.getPiletInfos(packageJson);
        break;
      case RepoType.Undefined:
      default:
        this.data = [];
        break;
    }
  }

  private getPiralInfos(packageJson: any) {
    const piralName = packageJson.name;
    const piralVersion = packageJson.version;
    const piralCliVersion = getVersionOfDependency('piral-cli');
    const bundler = this.getBundler(packageJson);

    const treeItems: Array<InfoTreeItem> = [
      new InfoTreeItem('Piral', [
        new InfoTreeItem('Name: ' + piralName, undefined),
        new InfoTreeItem('Version: ' + piralVersion, undefined),
      ]),
      new InfoTreeItem('Piral CLI', [new InfoTreeItem('Version: ' + piralCliVersion, undefined)]),
      new InfoTreeItem('Piral CLI Bundler', [
        new InfoTreeItem('Name: ' + bundler.name, undefined),
        new InfoTreeItem('Version: ' + bundler.version, undefined),
      ]),
    ];

    const pluginsTreeItems: Array<InfoTreeItem> = [];

    Object.keys(packageJson.dependencies).forEach((key) => {
      if (key.includes('piral-') && !piralFramework.includes(key)) {
        const version = getVersionOfDependency(key);
        pluginsTreeItems.push(new InfoTreeItem(key + ' (Version: ' + version + ')'));
      }
    });

    treeItems.push(new InfoTreeItem('Piral Plugins', pluginsTreeItems));
    this.data = treeItems;
  }

  private getPiletInfos(packageJson: any) {
    const piletName = packageJson.name;
    const piletVersion = packageJson.version;
    const appShellName = packageJson.piral.name;
    const appShellVersion = getVersionOfDependency(appShellName);
    const piralCliVersion = getVersionOfDependency('piral-cli');
    const bundler = this.getBundler(packageJson);

    const treeItems: Array<InfoTreeItem> = [
      new InfoTreeItem('Pilet', [
        new InfoTreeItem('Name: ' + piletName, undefined),
        new InfoTreeItem('Version: ' + piletVersion, undefined),
      ]),
      new InfoTreeItem('App Shell', [
        new InfoTreeItem('Name: ' + appShellName, undefined),
        new InfoTreeItem('Version: ' + appShellVersion, undefined),
      ]),
      new InfoTreeItem('Piral CLI', [new InfoTreeItem('Version: ' + piralCliVersion, undefined)]),
      new InfoTreeItem('Piral CLI Bundler', [
        new InfoTreeItem('Name: ' + bundler.name, undefined),
        new InfoTreeItem('Version: ' + bundler.version, undefined),
      ]),
    ];

    const dependenciesTreeItems: Array<InfoTreeItem> = [];

    Object.keys(packageJson.dependencies).forEach((key) => {
      const version = getVersionOfDependency(key);
      dependenciesTreeItems.push(new InfoTreeItem(key + ' (Version: ' + version + ')'));
    });

    treeItems.push(new InfoTreeItem('Dependencies', dependenciesTreeItems));
    this.data = treeItems;
  }

  private getBundler(packageJson: any) {
    const { devDependencies = {} } = packageJson;

    for (const bundler of bundlers) {
      if (devDependencies[bundler] !== undefined) {
        return {
          name: bundler,
          version: getVersionOfDependency(bundler),
        };
      }
    }

    return {
      name: 'not found',
      version: '',
    };
  }
}

class InfoTreeItem extends vscode.TreeItem {
  children: Array<InfoTreeItem> | undefined;

  constructor(label: string, children?: Array<InfoTreeItem>) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded,
    );
    this.children = children;
  }
}
