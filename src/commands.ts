import * as vscode from 'vscode';
import { resolve } from 'path';
import { CommandTreeItem } from './providers/items';
import { createRepository } from './webView';
import { RepoType, runCommand, getWorkspaceRoot } from './helpers';

export function registerCommands(
  context: vscode.ExtensionContext,
  refreshCommands: () => void,
  refreshWorkspace: () => void,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-piral.cli.pilet.debug', () => {
      runCommand('npx pilet debug', RepoType.Pilet);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.build', () => {
      runCommand('npx  pilet build', RepoType.Pilet);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.publish', () => {
      runCommand('npx pilet publish', RepoType.Pilet);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.validate', () => {
      runCommand('npx pilet validate', RepoType.Pilet);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.debug', () => {
      runCommand('npx piral debug', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build', () => {
      runCommand('npx piral build', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build.emulator', () => {
      runCommand('npx piral build --type emulator', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build.release', () => {
      runCommand('npx piral build --type release', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.declaration', () => {
      runCommand('npx piral declaration', RepoType.Piral);
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.validate', () => {
      runCommand('npx piral validate', RepoType.Piral);
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
    vscode.commands.registerCommand('vscode-piral.plugin-show-readme.generic', (node: CommandTreeItem) => {
      const workspaceFolder = getWorkspaceRoot();
      if (node.target !== undefined && workspaceFolder !== undefined) {
        const url = resolve(workspaceFolder.uri.fsPath, 'node_modules', node.target, 'README.md');
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
      } else {
        vscode.window.showErrorMessage('Could not run command!');
      }
    }),
    vscode.commands.registerCommand('vscode-piral.plugin-show-docs.generic', (node: CommandTreeItem) => {
      let url = `https://docs.piral.io`;

      if (node.target !== '') {
        url += `/plugins/${node.target}`;
      }

      // Opens website in browser
      vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
    }),
  );
}
