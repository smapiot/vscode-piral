import * as vscode from 'vscode';
import { readFileSync, existsSync, access, constants } from 'fs';
import { resolve } from 'path';
import { bundlerPackages, getBundlerInfos } from './menuConfigs';

export enum RepoType {
  Piral = 0,
  Pilet = 1,
  Mono = 2,
  Undefined = 3,
}

export const piralFramework = ['piral-base', 'piral-core', 'piral'];

export function readPackageJson(filePath: string) {
  try {
    const packageFile = readFileSync(filePath, 'utf8');
    return JSON.parse(packageFile);
  } catch {
    return undefined;
  }
}

export function getRepoType(): RepoType {
  const workspaceFolder = getWorkspaceRoot();

  if (workspaceFolder !== undefined) {
    const filePath = resolve(workspaceFolder.uri.fsPath, 'package.json');
    const packageJson = readPackageJson(filePath);

    if (packageJson) {
      const { pilets, piral, dependencies = {} } = packageJson;

      if (pilets !== undefined || Object.keys(dependencies).some((m) => piralFramework.includes(m))) {
        return RepoType.Piral;
      } else if (piral !== undefined) {
        return RepoType.Pilet;
      }
    }
  }

  return RepoType.Undefined;
}

export function getWorkspaceRoot() {
  return vscode.workspace.workspaceFolders?.[0];
}

export function getVersionOfDependency(dependency: string) {
  const workspaceFolder = getWorkspaceRoot();

  if (workspaceFolder != undefined) {
    const filePath = resolve(workspaceFolder.uri.fsPath, 'node_modules', dependency, 'package.json');
    const packageJson = readPackageJson(filePath);

    if (packageJson && packageJson.version !== undefined) {
      return packageJson.version;
    }
  }

  return '';
}

export function getBundler(packageJson: any) {
  const { devDependencies = {} } = packageJson;

  for (const bundler of bundlerPackages) {
    if (devDependencies[bundler] !== undefined) {
      return {
        name: getBundlerInfos(bundler)?.title,
        version: getVersionOfDependency(bundler),
      };
    }
  }

  return undefined;
}

function detectYarn(root: string) {
  return !!existsSync(`${root}/yarn.lock`);
}

function detectPnpm(root: string) {
  return new Promise((res) => {
    access(resolve(root, 'pnpm-lock.yaml'), constants.F_OK, (noPnpmLock) => {
      res(!noPnpmLock);
    });
  });
}

function detectLerna(root: string) {
  return new Promise((res) => {
    access(resolve(root, 'lerna.json'), constants.F_OK, (noPackageLock) => {
      res(!noPackageLock);
    });
  });
}

async function installDependencies(root: string) {
  const [hasYarn, hasPnpm, hasLerna] = await Promise.all([detectYarn(root), detectPnpm(root), detectLerna(root)]);
  if (hasLerna) {
    execCommand('npx lerna bootstrap');
  } else if (hasYarn) {
    execCommand('yarn install');
  } else if (hasPnpm) {
    execCommand('pnpm install');
  } else {
    execCommand('npm install');
  }
}

function askToInstallDependencies(root: string) {
  vscode.window
    .showInformationMessage('Dependencies are not installed yet, should we install the dependencies now?', 'Yes', 'No')
    .then((answer) => {
      if (answer === 'Yes') {
        installDependencies(root);
      }
    });
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

export function runCommand(cmd: string, requiredRepoType = RepoType.Undefined) {
  const workspace = getWorkspaceRoot();
  if (requiredRepoType === RepoType.Undefined) {
    return execCommand(cmd);
  }

  if (!workspace) {
    vscode.window.showErrorMessage('Require a workspace to run the command.');
  } else if (getRepoType() !== requiredRepoType) {
    vscode.window.showErrorMessage(`Command works only with ${requiredRepoType} projects!`);
  } else {
    const nodeModulesAreAvailable = existsSync(`${workspace.uri.fsPath}/node_modules`);

    if (!nodeModulesAreAvailable) {
      // ask user to install node-modules
      askToInstallDependencies(workspace.uri.fsPath);
    } else {
      const piralAvailable = existsSync(`${workspace.uri.fsPath}/node_modules/.bin/piral`);
      const piletAvailable = existsSync(`${workspace.uri.fsPath}/node_modules/.bin/pilet`);
      if (!piralAvailable || !piletAvailable) {
        // ask user to install node-modules
        askToInstallDependencies(workspace.uri.fsPath);
      } else {
        // execute the command - cmd
        const project = resolve(workspace.uri.fsPath, 'package.json');

        try {
          const { scripts = {} } = require(project) || {};
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
  }
}
