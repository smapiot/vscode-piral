import * as vscode from 'vscode';
import { resolve } from 'path';
import { CommandTreeItem } from './providers/items';
import { createRepository } from './webView';
import { RepoType, runCommand, getWorkspaceRoot } from './helpers';

function debugPilet() {
  runCommand('npx pilet debug', RepoType.Pilet);
}

function buildPilet() {
  runCommand('npx  pilet build', RepoType.Pilet);
}

function publishPilet() {
  runCommand('npx pilet publish', RepoType.Pilet);
}

function validatePilet() {
  runCommand('npx pilet validate', RepoType.Pilet);
}

function debugPiral() {
  runCommand('npx piral debug', RepoType.Piral);
}

function buildPiral() {
  runCommand('npx piral build', RepoType.Piral);
}

function buildPiralEmulator() {
  runCommand('npx piral build --type emulator', RepoType.Piral);
}

function buildPiralRelease() {
  runCommand('npx piral build --type release', RepoType.Piral);
}

function buildPiralDeclaration() {
  runCommand('npx piral declaration', RepoType.Piral);
}

function validatePiral() {
  runCommand('npx piral validate', RepoType.Piral);
}

async function genericCommand(node: CommandTreeItem) {
  const commands = await vscode.commands.getCommands();

  if (node.commandName !== undefined && commands.includes(node.commandName!)) {
    vscode.commands.executeCommand(node.commandName!);
  } else {
    vscode.window.showErrorMessage('Could not run command!');
  }
}

function showReadme(node: CommandTreeItem) {
  const workspaceFolder = getWorkspaceRoot();

  if (node.target !== undefined && workspaceFolder !== undefined) {
    const url = resolve(workspaceFolder.uri.fsPath, 'node_modules', node.target, 'README.md');
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
  } else {
    vscode.window.showErrorMessage('Could not run command!');
  }
}

function showDocs(node: CommandTreeItem) {
  let url = `https://docs.piral.io`;

  if (node.target !== '') {
    url += `/plugins/${node.target}`;
  }

  // Opens website in browser
  vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
}

export function registerCommands(
  context: vscode.ExtensionContext,
  refreshCommands: () => void,
  refreshWorkspace: () => void,
) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-piral.cli.pilet.debug', debugPilet),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.build', buildPilet),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.publish', publishPilet),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.validate', validatePilet),
    vscode.commands.registerCommand('vscode-piral.cli.piral.debug', debugPiral),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build', buildPiral),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build.emulator', buildPiralEmulator),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build.release', buildPiralRelease),
    vscode.commands.registerCommand('vscode-piral.cli.piral.declaration', buildPiralDeclaration),
    vscode.commands.registerCommand('vscode-piral.cli.piral.validate', validatePiral),
    vscode.commands.registerCommand('vscode-piral.cli.available-commands.refreshEntry', refreshCommands),
    vscode.commands.registerCommand('vscode-piral.cli.workspace-info.refreshEntry', refreshWorkspace),
    vscode.commands.registerCommand('vscode-piral.available-commands.generic', genericCommand),
    vscode.commands.registerCommand('vscode-piral.cli.create', () => createRepository(context)),
    vscode.commands.registerCommand('vscode-piral.plugin-show-readme.generic', showReadme),
    vscode.commands.registerCommand('vscode-piral.plugin-show-docs.generic', showDocs),
  );
}
