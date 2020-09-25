import * as vscode from 'vscode';
import {getRepoType, RepoType} from './helper';

export class CommandsDataProvider implements vscode.TreeDataProvider<CommandTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CommandTreeItem | undefined> = new vscode.EventEmitter<CommandTreeItem | undefined>();
  readonly onDidChangeTreeData: vscode.Event<CommandTreeItem | undefined> = this._onDidChangeTreeData.event;

  data: CommandTreeItem[] = [];

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

  refresh(): void {
    this.getAvailableCommands();
    this._onDidChangeTreeData.fire(undefined);
  }

  private getAvailableCommands() {
    let repoType = getRepoType();

    switch(repoType) {
      case RepoType.Piral:
        //vscode.window.showInformationMessage('Piral workspace found.');
        this.getPiralCommands();
        break;
      case RepoType.Pilet:
        //vscode.window.showInformationMessage('Pilet workspace found.');
        this.getPiletCommands();
        break;
      case RepoType.Undefined:
      case RepoType.Pilet:
      default:
        //vscode.window.showErrorMessage('No piral or pilet workspace found.');
        this.data = [];
        break;
    }
  }

  private getPiralCommands() {
    this.data = [ 
      new CommandTreeItem('Debug Piral Instance', 'vscode-piral.cli.piral.debug', undefined),
      new CommandTreeItem('Build Piral Instance', 'vscode-piral.cli.piral.build', undefined),
      new CommandTreeItem('Generate Piral Instance Declaration', 'vscode-piral.cli.piral.declaration', undefined),
      new CommandTreeItem('Create new Piral or Pilet project', 'vscode-piral.cli.create', undefined)
    ];
  }

  private getPiletCommands() {
    this.data = [ 
      new CommandTreeItem('Debug Pilet', 'vscode-piral.cli.pilet.debug', undefined),
      new CommandTreeItem('Build Pilet', 'vscode-piral.cli.pilet.build', undefined),
      new CommandTreeItem('Publish Pilet', 'vscode-piral.cli.pilet.publish', undefined),
      new CommandTreeItem('Create new Piral or Pilet project', 'vscode-piral.cli.create', undefined)
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