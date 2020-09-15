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
    this.data = [ 
      new InfoTreeItem('Name', [ new InfoTreeItem(packageJson.name, undefined)]),
      new InfoTreeItem('Version', [ new InfoTreeItem(packageJson.version, undefined)])
    ];
  }

  private getPiletInfos(packageJson: any) {
    this.data = [ 
      new InfoTreeItem('Name', [ new InfoTreeItem(packageJson.name, undefined)]),
      new InfoTreeItem('Version', [ new InfoTreeItem(packageJson.version, undefined)]),
      new InfoTreeItem('Piral', [ new InfoTreeItem(packageJson.piral.name, undefined)])
    ];
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