import * as vscode from 'vscode';
import { resolve } from 'path';
import { InfoTreeItem } from './items';
import {
  getRepoType,
  RepoType,
  getWorkspaceRoot,
  getVersionOfDependency,
  readPackageJson,
  piralFramework,
  getBundler,
} from '../helpers';

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
    const cliVersion = getVersionOfDependency('piral-cli');
    const bundler = getBundler(packageJson);

    this.data = [
      new InfoTreeItem('Piral', [
        new InfoTreeItem(`Name: ${piralName}`, undefined),
        new InfoTreeItem(`Version: ${piralVersion}`, undefined),
      ]),
      new InfoTreeItem('Piral CLI', [
        new InfoTreeItem(`Version: ${cliVersion}`, undefined),
        new InfoTreeItem(`Bundler: ${bundler?.name ?? '(none)'}`),
      ]),
      new InfoTreeItem(
        'Piral Plugins',
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
            return new InfoTreeItem(`${key} (${version})`);
          }),
      ),
    ];
  }

  private getPiletInfos(packageJson: any) {
    const piletName = packageJson.name;
    const piletVersion = packageJson.version;
    const appName = packageJson.piral.name;
    const appVersion = getVersionOfDependency(appName);
    const cliVersion = getVersionOfDependency('piral-cli');
    const bundler = getBundler(packageJson);

    this.data = [
      new InfoTreeItem('Pilet', [
        new InfoTreeItem(`Name: ${piletName}`, undefined),
        new InfoTreeItem(`Version: ${piletVersion}`, undefined),
      ]),
      new InfoTreeItem('App Shell', [
        new InfoTreeItem(`Name: ${appName}`, undefined),
        new InfoTreeItem(`Version: ${appVersion}`, undefined),
      ]),
      new InfoTreeItem('Piral CLI', [
        new InfoTreeItem(`Version: ${cliVersion}`, undefined),
        new InfoTreeItem(`Bundler: ${bundler?.name ?? '(none)'}`),
      ]),
      new InfoTreeItem(
        'Dependencies',
        Object.keys(packageJson.dependencies).map((key) => {
          const version = getVersionOfDependency(key);
          return new InfoTreeItem(`${key} (${version})`);
        }),
      ),
    ];
  }
}
