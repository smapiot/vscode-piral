import * as vscode from 'vscode';
import { CommandTreeItem } from './items';
import { getRepoType, RepoType } from '../helper';

export class CommandsDataProvider implements vscode.TreeDataProvider<CommandTreeItem> {
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

  refresh(): void {
    this.getAvailableCommands();
    this._onDidChangeTreeData.fire(undefined);
  }

  private getAvailableCommands() {
    const repoType = getRepoType();

    switch (repoType) {
      case RepoType.Piral:
        this.getPiralCommands();
        break;
      case RepoType.Pilet:
        this.getPiletCommands();
        break;
      default:
        this.data = [];
        break;
    }
  }

  private getPiralCommands() {
    this.data = [
      new CommandTreeItem('Debug Piral Instance', 'vscode-piral.cli.piral.debug', undefined),
      new CommandTreeItem('Build Piral Instance', 'vscode-piral.cli.piral.build', undefined),
      new CommandTreeItem('Generate Declaration', 'vscode-piral.cli.piral.declaration', undefined),
      new CommandTreeItem('Validate Piral Instance', 'vscode-piral.cli.piral.validate', undefined),
      new CommandTreeItem('Create new Project', 'vscode-piral.cli.create', undefined),
    ];
  }

  private getPiletCommands() {
    this.data = [
      new CommandTreeItem('Debug Pilet', 'vscode-piral.cli.pilet.debug', undefined),
      new CommandTreeItem('Build Pilet', 'vscode-piral.cli.pilet.build', undefined),
      new CommandTreeItem('Publish Pilet', 'vscode-piral.cli.pilet.publish', undefined),
      new CommandTreeItem('Validate Pilet', 'vscode-piral.cli.pilet.validate', undefined),
      new CommandTreeItem('Create new Project', 'vscode-piral.cli.create', undefined),
    ];
  }
}
