import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { CommandsDataProvider } from './providers/commandsProvider';
import { WorkspaceInfoDataProvider } from './providers/workspaceInfoProvider';

export function activate(context: vscode.ExtensionContext) {
  // Available Commands View
  const nodeCommandsProvider = new CommandsDataProvider();
  vscode.window.registerTreeDataProvider('piral-available-commands', nodeCommandsProvider);

  // Workspace Info View
  const nodeWorkspaceInfoProvider = new WorkspaceInfoDataProvider();
  vscode.window.registerTreeDataProvider('piral-workspace-info', nodeWorkspaceInfoProvider);

  // Initialize the providers
  nodeCommandsProvider.refresh();
  nodeWorkspaceInfoProvider.refresh();

  // Register the available commands
  registerCommands(context, () => nodeCommandsProvider.refresh(), () => nodeWorkspaceInfoProvider.refresh());
}

export function deactivate(context: vscode.ExtensionContext) { }
