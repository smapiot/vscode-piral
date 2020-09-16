import * as vscode from 'vscode';
import * as fs from 'fs';
import { resolve } from 'path';

export class WorkspaceInfoDataProvider implements vscode.TreeDataProvider<InfoTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<InfoTreeItem | undefined> = new vscode.EventEmitter<InfoTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<InfoTreeItem | undefined> = this._onDidChangeTreeData.event;

  data: InfoTreeItem[] = [];
  workspaceFolder: vscode.WorkspaceFolder | undefined;

  constructor() { }

  getTreeItem(element: InfoTreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: InfoTreeItem|undefined): vscode.ProviderResult<InfoTreeItem[]> {
    if (element === undefined) {
      return this.data;
    }
    return element.children;
  }

  refresh(workspaceFolder: vscode.WorkspaceFolder | undefined): void {
    this.workspaceFolder = workspaceFolder;
    this.getAvailableCommands();
    this._onDidChangeTreeData.fire(undefined);
  }

  private getAvailableCommands() {
    if(this.workspaceFolder != undefined) {
      var filePath = resolve(this.workspaceFolder.uri.fsPath, 'package.json');

      if(!fs.existsSync(filePath)) {
        return;
      }

      let packageFile = fs.readFileSync(filePath, "utf8");
      let packageJson = JSON.parse(packageFile);

      if(packageJson.pilets != undefined) {
        vscode.window.showInformationMessage('Piral workspace found.');
        this.getPiralInfos(packageJson);
      } else if(packageJson.piral != undefined) {
        vscode.window.showInformationMessage('Pilet workspace found.');
        this.getPiletInfos(packageJson);
      } else {
        vscode.window.showErrorMessage('No piral or pilet workspace found.');
        this.data = [];
      }
    }
  }

  private getPiralInfos(packageJson: any) {
    let piralName = packageJson.name;
    let piralVersion = packageJson.version;
    let piralCliVersion = packageJson.devDependencies["piral-cli"];
    
    var treeItems: InfoTreeItem[] = [ 
      new InfoTreeItem('Piral', [ new InfoTreeItem('Name: ' + piralName, undefined), new InfoTreeItem('Version: ' + piralVersion, undefined)]),
      new InfoTreeItem('Piral CLI', [ new InfoTreeItem('Version: ' + piralCliVersion, undefined)]),
    ];

    var pluginsTreeItems: InfoTreeItem[] = [];
    Object.keys(packageJson.dependencies).forEach(function(key) {
      if(key.includes('piral-')){
        pluginsTreeItems.push(new InfoTreeItem(key + " (Version: " + packageJson.dependencies[key] + ")"))
      }
    })
    treeItems.push(new InfoTreeItem('Piral Plugins', pluginsTreeItems));

    this.data = treeItems;
  }

  private getPiletInfos(packageJson: any) {
    let piletName = packageJson.name;
    let piletVersion = packageJson.version;
    let appShellName = packageJson.piral.name;
    let appShellVersion = packageJson.devDependencies[appShellName];
    // let appShellLatestVersion = "";
    let piralCliVersion = packageJson.devDependencies["piral-cli"];
    //let piralCliLatestVersion = "";

    var treeItems: InfoTreeItem[] = [ 
      new InfoTreeItem('Pilet', [ new InfoTreeItem('Name: ' + piletName, undefined), new InfoTreeItem('Version: ' + piletVersion, undefined)]),
      new InfoTreeItem('App Shell', [ new InfoTreeItem('Name: ' + appShellName, undefined), new InfoTreeItem('Version: ' + appShellVersion, undefined)]),
      new InfoTreeItem('Piral CLI', [ new InfoTreeItem('Version: ' + piralCliVersion, undefined)]),
    ];

    var dependenciesTreeItems: InfoTreeItem[] = [];
    Object.keys(packageJson.dependencies).forEach(function(key) {
      dependenciesTreeItems.push(new InfoTreeItem(key + " (Version: " + packageJson.dependencies[key] + ")"))
    })
    treeItems.push(new InfoTreeItem('Dependencies', dependenciesTreeItems));

    this.data = treeItems;
  } 
}

class InfoTreeItem extends vscode.TreeItem {
  children: InfoTreeItem[]|undefined;

  constructor(label: string, children?: InfoTreeItem[]) {
    super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
  }
}