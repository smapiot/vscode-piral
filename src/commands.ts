import * as vscode from 'vscode';
import { CommandTreeItem } from './providers/items';
import { createRepository } from './webView';
import { RepoType, runCommand } from './helper';

export function registerCommands(context: vscode.ExtensionContext, refreshCommands: () => void, refreshWorkspace: () => void) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-piral.cli.pilet.debug', () => {
      runCommand('pilet debug', RepoType.Pilet);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.build', () => {
      runCommand('pilet build', RepoType.Pilet);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.publish', () => {
      runCommand('pilet publish', RepoType.Pilet);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.debug', () => {
      runCommand('piral debug', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build', () => {
      runCommand('piral build', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.declaration', () => {
      runCommand('piral declaration', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.available-commands.refreshEntry', refreshCommands),
    vscode.commands.registerCommand('vscode-piral.cli.workspace-info.refreshEntry', refreshWorkspace),
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
      runCommand('piral validate', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.validate', () => {
      runCommand('pilet validate', RepoType.Pilet);
    }),
  );
}
