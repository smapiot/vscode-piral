import * as vscode from 'vscode';
import { resolve } from 'path';

function execCommand(cmd: string | undefined) {
  if (cmd) {
    const term = vscode.window.createTerminal({
      name: 'Piral',
    });
    term.sendText(cmd, true);
    term.show(true);
  }
}

function runCommand(cmd: string) {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    vscode.window.showErrorMessage('Require a workspace to run the command.');
  } else {
    const project = resolve(workspace.uri.fsPath, 'package.json');

    try {
      const { scripts = {} } = __non_webpack_require__(project) || {};
      const candidates = Object.keys(scripts).filter((m) => scripts[m].trim().startsWith(cmd));
      const shellCommand =
        candidates.length === 0 ? cmd : candidates.length === 1 ? scripts[candidates.pop() ?? ''] : undefined;

      if (shellCommand !== undefined) {
        execCommand(shellCommand);
      } else {
        vscode.window.showQuickPick(candidates).then(execCommand);
      }
    } catch (err) {
      vscode.window.showErrorMessage(`Could not load the "package.json". Make sure the workspace is valid "${project}".`);
    }
  }
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-piral.cli.pilet.debug', () => {
      runCommand('pilet debug');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.build', () => {
      runCommand('pilet build');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.publish', () => {
      runCommand('pilet publish');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.debug', () => {
      runCommand('piral debug');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build', () => {
      runCommand('piral build');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.declaration', () => {
      runCommand('piral declaration');
    }),
  );
}

export function deactivate(context: vscode.ExtensionContext) { }
