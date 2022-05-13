import * as vscode from 'vscode';
import { join } from 'path';
import { exec } from 'child_process';
import {
  getTemplateCode,
  runCommand,
  getRepoTypeOptions,
  getBundlerOptions,
  getResourcePath,
  getTemplatesNames,
  getTemplatesOptions,
  getNpmClientOptions,
  getLanguageOptions,
} from './helpers';

let webviewPanel: vscode.WebviewPanel;

function disposeWebview() {
  if (webviewPanel) {
    webviewPanel.dispose();
  }
}

interface Options {
  repoType: string;
  name: string;
  version: string;
  bundler: string;
  targetFolder: string;
  piralPackage: string;
  npmRegistry: string;
  template: string;
  language: string;
  client: string;
  nodeModules: boolean;
}

function validateParameters(options: Options): string[] {
  const validationErrors: Array<string> = [];

  if (!options.targetFolder) {
    validationErrors.push('LocalPath');
  }

  if (!options.repoType) {
    validationErrors.push('RepoType');
  }

  if (!options.template) {
    validationErrors.push('Template');
  }

  if (!options.bundler.trim()) {
    validationErrors.push('Bundler');
  }

  if (!options.name.trim()) {
    validationErrors.push('Name');
  }

  return validationErrors;
}

async function getNpmVersion(): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('npm --version', (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        const npmVersion = stdout.match(/\d+\.\d+\.\d+/g);

        if (npmVersion) {
          resolve(npmVersion[0]);
        } else {
          reject(new Error('Could not find a version string in the output'));
        }
      }
    });
  });
}

async function isLegacyNpmVersion(): Promise<boolean> {
  const [majorVersion] = (await getNpmVersion()).split('.');
  return +majorVersion < 7;
}

export async function createRepository(context: vscode.ExtensionContext) {
  const { extensionPath } = context;
  const { window, ViewColumn } = vscode;

  disposeWebview();

  webviewPanel = window.createWebviewPanel('piral.createProject', 'Piral - Create Project', ViewColumn.One, {
    enableScripts: true,
  });

  webviewPanel.webview.html = getTemplateCode(getResourcePath(webviewPanel, extensionPath, 'dist/scaffold.js'));

  webviewPanel.iconPath = vscode.Uri.file(join(extensionPath, 'resources/piral.png'));

  webviewPanel.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case 'initialize':
          webviewPanel.webview.postMessage({
            command: 'sendInitialState',
            data: {
              repoTypes: getRepoTypeOptions(webviewPanel, extensionPath),
              bundlers: getBundlerOptions(webviewPanel, extensionPath),
              clients: getNpmClientOptions(webviewPanel, extensionPath),
              languages: getLanguageOptions(webviewPanel, extensionPath),
            },
          });
          break;
        case 'createPiralPilet':
          const options: Options = message.options;

          const validationErrors = validateParameters(options);

          if (validationErrors.length > 0) {
            return;
          }

          // Go to target folder & create app folder
          const isWin = process.platform === 'win32';
          const targetFolder = options.targetFolder
            .slice(1)
            .split('/')
            .join(isWin ? '\\' : '/');

          const createAppFolder = isWin
            ? `if not exist ${targetFolder}\\${options.name} md ${targetFolder}\\${options.name}`
            : `mkdir -p ${targetFolder}/${options.name} && cd ${targetFolder}/${options.name}`;
          const installDependencies = options.nodeModules ? '--install' : '--no-install';
          const sep = (await isLegacyNpmVersion()) ? '--' : '';
          const command = [createAppFolder];

          if (options.repoType === 'piral') {
            // Handle Piral instance
            command.push(
              [
                `npm init piral-instance`,
                sep,
                `--registry '${options.npmRegistry}'`,
                `--bundler '${options.bundler}'`,
                `--npm-client '${options.client}'`,
                `--language '${options.language}'`,
                installDependencies,
                '--defaults',
              ].join(' '),
            );
          } else if (options.repoType === 'pilet') {
            // Handle pilet
            command.push(
              [
                `npm init pilet`,
                sep,
                `--source '${options.piralPackage}'`,
                `--registry '${options.npmRegistry}'`,
                `--bundler '${options.bundler}'`,
                `--npm-client '${options.client}'`,
                `--language '${options.language}'`,
                installDependencies,
                '--defaults',
              ].join(' '),
            );
          }

          runCommand([...command, `npm --no-git-tag-version' ${options.version}'`, 'code .'].join(' && '));

          // Dispose Webview
          disposeWebview();
          break;

        case 'getLocalPath':
          const localPath = await window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: 'Select a folder to create project',
          });

          if (localPath) {
            webviewPanel.webview.postMessage({ command: 'sendLocalPath', data: localPath });
          }

          break;

        case 'getTemplatesNames':
          const templates = await getTemplatesNames(message.type);
          webviewPanel.webview.postMessage({
            command: 'sendTemplatesNames',
            type: message.type,
            templates,
          });

          break;

        case 'getTemplatesOptions':
          const templateOptions = await getTemplatesOptions(message.packageName);
          webviewPanel.webview.postMessage({
            command: 'sendTemplatesOptions',
            templateOptions,
          });

          break;
      }
    },
    undefined,
    context.subscriptions,
  );
}
