import * as vscode from 'vscode';
import { CommandsDataProvider, CommandTreeItem } from './commandsProvider';
import { WorkspaceInfoDataProvider } from './workspaceInfoProvider';
import { getRepoType, RepoType, runCommand } from './helper';
import { createRepository } from './webView';

export function activate(context: vscode.ExtensionContext) {
  // Available Commands View
  const nodeCommandsProvider = new CommandsDataProvider();
  vscode.window.registerTreeDataProvider('piral-available-commands', nodeCommandsProvider);
  nodeCommandsProvider.refresh();

  // Workspace Info View
  const nodeWorkspaceInfoProvider = new WorkspaceInfoDataProvider();
  vscode.window.registerTreeDataProvider('piral-workspace-info', nodeWorkspaceInfoProvider);
  nodeWorkspaceInfoProvider.refresh();

  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-piral.cli.pilet.debug', () => {
      if (getRepoType() === RepoType.Pilet) {
        runCommand('pilet debug');
      } else {
        vscode.window.showErrorMessage('Command works only with pilet project!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.build', () => {
      if (getRepoType() === RepoType.Pilet) {
        runCommand('pilet build');
      } else {
        vscode.window.showErrorMessage('Command works only with pilet project!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.publish', () => {
      if (getRepoType() === RepoType.Pilet) {
        runCommand('pilet publish');
      } else {
        vscode.window.showErrorMessage('Command works only with pilet project!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.debug', () => {
      if (getRepoType() === RepoType.Piral) {
        runCommand('piral debug');
      } else {
        vscode.window.showErrorMessage('Command works only with piral project!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build', () => {
      if (getRepoType() === RepoType.Piral) {
        runCommand('piral build');
      } else {
        vscode.window.showErrorMessage('Command works only with piral project!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.declaration', () => {
      if (getRepoType() === RepoType.Piral) {
        runCommand('piral declaration');
      } else {
        vscode.window.showErrorMessage('Command works only with piral project!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.cli.available-commands.refreshEntry', () => {
      nodeCommandsProvider.refresh();
    }),
    vscode.commands.registerCommand('vscode-piral.cli.workspace-info.refreshEntry', () => {
      nodeWorkspaceInfoProvider.refresh();
    }),
    vscode.commands.registerCommand('vscode-piral.available-commands.generic', (node: CommandTreeItem) => {
      if (
        node.commandName !== undefined &&
        vscode.commands.getCommands().then((commands) => commands.includes(node.commandName!))
      ) {
        vscode.commands.executeCommand(node.commandName!);
      } else {
        vscode.window.showErrorMessage('Could not run command!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.cli.create', () => {
      createRepository(context);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.validate', () => {
      if (getRepoType() === RepoType.Piral) {
        runCommand('piral validate');
      } else {
        vscode.window.showErrorMessage('Command works only with piral project!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.validate', () => {
      if (getRepoType() === RepoType.Pilet) {
        runCommand('pilet validate');
      } else {
        vscode.window.showErrorMessage('Command works only with pilet project!');
      }
    }),
  );
}

export function deactivate(context: vscode.ExtensionContext) {}
