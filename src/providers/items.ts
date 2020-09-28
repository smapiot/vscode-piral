import * as vscode from 'vscode';

export class InfoTreeItem extends vscode.TreeItem {
  children: Array<InfoTreeItem> | undefined;

  constructor(label: string, children?: Array<InfoTreeItem>) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded,
    );
    this.children = children;
  }
}

export class CommandTreeItem extends vscode.TreeItem {
  children: Array<CommandTreeItem> | undefined;
  commandName: string | undefined;

  constructor(label: string, commandName: string, children?: Array<CommandTreeItem>) {
    super(
      label,
      children === undefined ? vscode.TreeItemCollapsibleState.None : vscode.TreeItemCollapsibleState.Expanded,
    );
    this.children = children;
    this.commandName = commandName;
  }
}
