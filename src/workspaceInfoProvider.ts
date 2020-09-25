import * as vscode from 'vscode';
import * as fs from 'fs';
import { resolve } from 'path';
import { getRepoType, RepoType, getWorkspaceRoot, getVersionOfDependency } from './helper';

export class WorkspaceInfoDataProvider implements vscode.TreeDataProvider<InfoTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<InfoTreeItem | undefined> = new vscode.EventEmitter<
    InfoTreeItem | undefined
  >();
  readonly onDidChangeTreeData: vscode.Event<InfoTreeItem | undefined> = this._onDidChangeTreeData.event;

  data: InfoTreeItem[] = [];

  constructor() {}

  getTreeItem(element: InfoTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: InfoTreeItem | undefined): vscode.ProviderResult<InfoTreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  refresh(): void {
    this.getAvailableCommands();
    this._onDidChangeTreeData.fire(undefined);
  }

  private getAvailableCommands() {
    let repoType = getRepoType();
    let packageJson = '';

    if (repoType == RepoType.Pilet || repoType == RepoType.Piral) {
      var workspaceFolder = getWorkspaceRoot();
      if (workspaceFolder != undefined) {
        var filePath = resolve(workspaceFolder.uri.fsPath, 'package.json');
        if (fs.existsSync(filePath)) {
          let packageFile = fs.readFileSync(filePath, 'utf8');
          packageJson = JSON.parse(packageFile);
        }
      }
    }

    switch (repoType) {
      case RepoType.Piral:
        //vscode.window.showInformationMessage('Piral workspace found.');
        this.getPiralInfos(packageJson);
        break;
      case RepoType.Pilet:
        //vscode.window.showInformationMessage('Pilet workspace found.');
        this.getPiletInfos(packageJson);
        break;
      case RepoType.Undefined:
      case RepoType.Pilet:
      default:
        //vscode.window.showErrorMessage('No piral or pilet workspace found.');
        this.data = [];
        break;
    }
  }

  private getPiralInfos(packageJson: any) {
    let piralName = packageJson.name;
    let piralVersion = packageJson.version;
    let piralCliVersion = getVersionOfDependency('piral-cli');
    let bundler = this.getBundler(packageJson);

    var treeItems: InfoTreeItem[] = [
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

    var pluginsTreeItems: InfoTreeItem[] = [];
    Object.keys(packageJson.dependencies).forEach(function (key) {
      if (key.includes('piral-')) {
        let version = getVersionOfDependency(key);
        pluginsTreeItems.push(new InfoTreeItem(key + ' (Version: ' + version + ')'));
      }
    });
    treeItems.push(new InfoTreeItem('Piral Plugins', pluginsTreeItems));
    this.data = treeItems;
  }

  private getPiletInfos(packageJson: any) {
    let piletName = packageJson.name;
    let piletVersion = packageJson.version;
    let appShellName = packageJson.piral.name;
    let appShellVersion = getVersionOfDependency(appShellName);
    let piralCliVersion = getVersionOfDependency('piral-cli');
    let bundler = this.getBundler(packageJson);

    var treeItems: InfoTreeItem[] = [
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

    var dependenciesTreeItems: InfoTreeItem[] = [];
    Object.keys(packageJson.dependencies).forEach(function (key) {
      let version = getVersionOfDependency(key);
      dependenciesTreeItems.push(new InfoTreeItem(key + ' (Version: ' + version + ')'));
    });
    treeItems.push(new InfoTreeItem('Dependencies', dependenciesTreeItems));
    this.data = treeItems;
  }

  private getBundler(packageJson: any) {
    var name = 'not found';
    var version = '';

    if (packageJson.devDependencies === undefined) {
      return { name, version };
    }

    if (packageJson.devDependencies['piral-cli-parcel'] != undefined) {
      name = 'piral-cli-parcel';
      version = getVersionOfDependency(name);
    }

    if (packageJson.devDependencies['piral-cli-webpack'] != undefined) {
      name = 'piral-cli-webpack';
      version = getVersionOfDependency(name);
    }

    return { name, version };
  }
}

class InfoTreeItem extends vscode.TreeItem {
  children: InfoTreeItem[] | undefined;

  constructor(label: string, children?: InfoTreeItem[]) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded,
    );
    this.children = children;
  }
}
