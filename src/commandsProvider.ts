import * as vscode from 'vscode';
import * as fs from 'fs';
import { resolve } from 'path';

export class CommandsDataProvider implements vscode.TreeDataProvider<CommandTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CommandTreeItem | undefined> = new vscode.EventEmitter<CommandTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<CommandTreeItem | undefined> = this._onDidChangeTreeData.event;

  data: CommandTreeItem[] = [];
  workspaceFolder: vscode.WorkspaceFolder | undefined;

  constructor() {}

  getTreeItem(element: CommandTreeItem): vscode.TreeItem|Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(element?: CommandTreeItem|undefined): vscode.ProviderResult<CommandTreeItem[]> {
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
        this.getPiralCommands();
      } else if(packageJson.piral != undefined) {
        vscode.window.showInformationMessage('Pilet workspace found.');
        this.getPiletCommands();
      } else {
        vscode.window.showErrorMessage('No piral or pilet workspace found.');
        this.data = [];
      }
    }
  }

  private getPiralCommands() {
    this.data = [ 
      new CommandTreeItem('Debug Piral Instance', 'vscode-piral.cli.piral.debug', undefined),
      new CommandTreeItem('Build Piral Instance', 'vscode-piral.cli.piral.build', undefined),
      new CommandTreeItem('Generate Piral Instance Declaration', 'vscode-piral.cli.piral.declaration', undefined)
    ];
  }

  private getPiletCommands() {
    this.data = [ 
      new CommandTreeItem('Debug Pilet', 'vscode-piral.cli.pilet.debug', undefined),
      new CommandTreeItem('Build Pilet', 'vscode-piral.cli.pilet.build', undefined),
      new CommandTreeItem('Publish Pilet', 'vscode-piral.cli.pilet.publish', undefined)
    ];
  }
}

export class CommandTreeItem extends vscode.TreeItem {
  children: CommandTreeItem[]|undefined;
  commandName: string|undefined;
  
  constructor(label: string, commandName: string, children?: CommandTreeItem[]) {
    super(
        label,
        children === undefined ? vscode.TreeItemCollapsibleState.None :
                                 vscode.TreeItemCollapsibleState.Expanded);
    this.children = children;
    this.commandName = commandName;
  }
}