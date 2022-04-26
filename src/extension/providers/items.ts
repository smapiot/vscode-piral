import * as vscode from 'vscode';

export class CommandTreeItem extends vscode.TreeItem {
  children: Array<CommandTreeItem> | undefined;
  commandName: string | undefined;
  target: string | undefined;

  constructor(label: string, commandName: string, children?: Array<CommandTreeItem>, target?: string) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded,
    );
    this.contextValue = target !== undefined ? target != '' ? 'showFullContextPlugin' : 'showWebLinkContextPlugin' : undefined;
    this.children = children;
    this.commandName = commandName;
    this.target = target;
  }
}
