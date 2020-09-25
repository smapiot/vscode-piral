import * as vscode from 'vscode';
import { resolve } from 'path';
import * as fs from 'fs';

export enum RepoType {
    Piral = 0,
    Pilet = 1,
    Mono = 2,
    Undefined = 3
}

export function getRepoType(): RepoType {
    let workspaceFolder = getWorkspaceRoot();
    if(workspaceFolder != undefined) {
        var filePath = resolve(workspaceFolder.uri.fsPath, 'package.json');
  
        if(!fs.existsSync(filePath)) {
          return RepoType.Undefined;
        }
  
        let packageFile = fs.readFileSync(filePath, "utf8");
        let packageJson = JSON.parse(packageFile);
  
        if(packageJson.pilets != undefined) {
          return RepoType.Piral;
        } else if(packageJson.piral != undefined) {
          vscode.window.showInformationMessage('Pilet workspace found.');
          return RepoType.Pilet;
        } else {
          return RepoType.Undefined;
        }
    }

    return RepoType.Undefined;
}

export function getWorkspaceRoot() {
    return vscode.workspace.workspaceFolders?.[0];
}

export function getVersionOfDependency(dependency: string) {
  let workspaceFolder = getWorkspaceRoot();
  if(workspaceFolder != undefined) {
    var filePath = resolve(workspaceFolder.uri.fsPath, 'node_modules', dependency, 'package.json');
    
    if(!fs.existsSync(filePath)) {
      return "";
    }
  
    let packageFile = fs.readFileSync(filePath, "utf8");
    let packageJson = JSON.parse(packageFile);
    if(packageJson.version != undefined) {
      return packageJson.version;
    } 
  }

  return "";
}

function execCommand(cmd: string | undefined): vscode.Terminal | undefined {
  if (cmd) {
    const term = vscode.window.createTerminal({
      name: 'Piral',
    });
    term.sendText(cmd, true);
    term.show(true);
    return term;
  }

  return undefined;
}

export function runCommand(cmd: string, workspaceMandatory: boolean = true) {
  const workspace = getWorkspaceRoot();

  if(!workspaceMandatory) {
    return execCommand(cmd);
  }

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
      vscode.window.showErrorMessage(
        `Could not load the "package.json". Make sure the workspace is valid "${project}".`,
      );
    }
  }
}