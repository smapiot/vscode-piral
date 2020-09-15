import * as vscode from 'vscode';
import { resolve } from 'path';
import { CommandsDataProvider, CommandTreeItem } from './commandsProvider';
import { WorkspaceInfoDataProvider } from './workspaceInfoProvider';


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
  const workspace = getWorkspaceRoot();

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
  let workspaceFolder = getWorkspaceRoot();

  // Available Commands View
  const nodeCommandsProvider = new CommandsDataProvider();
  vscode.window.registerTreeDataProvider('piral-available-commands', nodeCommandsProvider);
  nodeCommandsProvider.refresh(workspaceFolder);

  // Workspace Info View
  const nodeWorkspaceInfoProvider = new WorkspaceInfoDataProvider();
  vscode.window.registerTreeDataProvider('piral-workspace-info', nodeWorkspaceInfoProvider);
  nodeWorkspaceInfoProvider.refresh(workspaceFolder);
  
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
    vscode.commands.registerCommand('vscode-piral.cli.available-commands.refreshEntry', () => {
      nodeCommandsProvider.refresh(getWorkspaceRoot());
    }),
    vscode.commands.registerCommand('vscode-piral.cli.workspace-info.refreshEntry', () => {
      nodeWorkspaceInfoProvider.refresh(getWorkspaceRoot());
    }),
    vscode.commands.registerCommand('vscode-piral.available-commands.generic', (node: CommandTreeItem) => {
      if(node.commandName != undefined && vscode.commands.getCommands().then(commands => commands.includes(node.commandName!))) {
        vscode.commands.executeCommand(node.commandName!);
      } else {
        vscode.window.showErrorMessage("Could not run command!");
      }
    })
  );
}

function getWorkspaceRoot() {
  return vscode.workspace.workspaceFolders?.[0];
}

export function deactivate(context: vscode.ExtensionContext) { }
