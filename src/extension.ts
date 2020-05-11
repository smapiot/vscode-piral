import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  //TODO const workspace = vscode.workspace.workspaceFolders?.[0];

  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-piral.cli.pilet.debug', () => {
      vscode.window.showInformationMessage('Debug Pilet!');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.build', () => {
      vscode.window.showInformationMessage('Build Pilet!');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.pilet.publish', () => {
      vscode.window.showInformationMessage('Publish Pilet!');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.debug', () => {
      vscode.window.showInformationMessage('Debug Piral!');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.build', () => {
      vscode.window.showInformationMessage('Build Piral!');
    }),
    vscode.commands.registerCommand('vscode-piral.cli.piral.declaration', () => {
      vscode.window.showInformationMessage('Declaration Piral!');
    }),
  );
}

export function deactivate(context: vscode.ExtensionContext) {}
