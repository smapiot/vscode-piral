import * as vscode from 'vscode';
import { registerCommands } from './commands';
import { PiralTaskProvider } from './providers/piralTaskProvider';
import { PiletTaskProvider } from './providers/piletTaskProvider';
import { CommandsDataProvider } from './providers/commandsProvider';
import { WorkspaceInfoDataProvider } from './providers/workspaceInfoProvider';

let piralDebugTaskProvider: vscode.Disposable | undefined;
let piletDebugTaskProvider: vscode.Disposable | undefined;
let availableCommandsProvider: vscode.Disposable | undefined;
let workspaceInfoProvider: vscode.Disposable | undefined;

export function activate(context: vscode.ExtensionContext) {
  const workspaceRoot =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  if (workspaceRoot) {
    // Available Commands View
    const nodeCommandsProvider = new CommandsDataProvider();
    vscode.window.registerTreeDataProvider('piral-available-commands', nodeCommandsProvider);

    // Workspace Info View
    const nodeWorkspaceInfoProvider = new WorkspaceInfoDataProvider();
    vscode.window.registerTreeDataProvider('piral-workspace-info', nodeWorkspaceInfoProvider);

    // Initialize the providers
    nodeCommandsProvider.refresh();
    nodeWorkspaceInfoProvider.refresh();

    piralDebugTaskProvider = vscode.tasks.registerTaskProvider(PiralTaskProvider.Type, new PiralTaskProvider());
    piletDebugTaskProvider = vscode.tasks.registerTaskProvider(PiletTaskProvider.Type, new PiletTaskProvider());

    // Register the available commands
    registerCommands(
      context,
      () => nodeCommandsProvider.refresh(),
      () => nodeWorkspaceInfoProvider.refresh(),
    );
  }
}

export function deactivate(context: vscode.ExtensionContext) {
  piralDebugTaskProvider?.dispose();
  piletDebugTaskProvider?.dispose();
  availableCommandsProvider?.dispose();
  workspaceInfoProvider?.dispose();
}
