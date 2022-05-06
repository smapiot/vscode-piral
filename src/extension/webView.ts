import * as vscode from 'vscode';
import { join } from 'path';
import {
  getTemplateCode,
  runCommand,
  getRepoTypeOptions,
  getBundlerOptions,
  getResourcePath,
  getTemplatesNames,
  getTemplatesOptions,
} from './helpers';
import { exec } from 'child_process';
import { access } from 'fs';

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

  if (!options.version.trim()) {
    options.version = '1.0.0';
  }

  if (!options.bundler.trim()) {
    validationErrors.push('Bundler');
  }

  if (!options.name.trim()) {
    validationErrors.push('Name');
  }

  if (options.repoType === 'pilet') {
    // nothing for now ...
    if (!options.piralPackage.trim()) {
      options.piralPackage = 'sample-piral';
    }

    if (!options.npmRegistry.trim()) {
      options.npmRegistry = 'https://registry.npmjs.org/';
    }
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
            },
          });
          break;
        case 'createPiralPilet':
          const options = message.options;

          const validationErrors = validateParameters(options);

          if (validationErrors.length > 0) {
            return;
          }

          // Go to target folder & create app folder
          const isWin = process.platform === 'win32';
          const newCommandSymbol = isWin ? ';' : '&&';
          const targetFolder = options.targetFolder.slice(1);
          let createAppFolder = `mkdir -p ${targetFolder}/${options.name} ${newCommandSymbol} cd ${targetFolder}/${options.name}`;
          if (isWin) {
            access(options.targetFolder, function (error) {
              if (error) {
                createAppFolder = `mkdir ${targetFolder}/${options.name} ${newCommandSymbol} cd ${targetFolder}/${options.name}`;
              } else {
                createAppFolder = `cd '${targetFolder}/${options.name}'`;
              }
            });
          }
          const openProject = `npm --no-git-tag-version' ${options.version}' ${newCommandSymbol} code .`;
          const installDependencies = options.nodeModules ? '--install' : '--no-install';
          const sep = (await isLegacyNpmVersion()) ? '--' : '';

          if (options.repoType === 'piral') {
            // Handle Piral Instance
            const scaffoldPiral = `npm init piral-instance ${sep}registry '${options.npmRegistry}' ${sep}bundler '${options.bundler}' ${sep}defaults ${installDependencies}`;
            runCommand(`${createAppFolder} ${newCommandSymbol} ${scaffoldPiral} ${newCommandSymbol} ${openProject}`);

            // Dispose Webview
            disposeWebview();
          } else if (options.repoType === 'pilet') {
            // Handle Pilet Instance
            const scaffoldPilet = `npm init pilet ${sep}source '${options.piralPackage}' ${sep}registry '${options.npmRegistry}' ${sep}bundler '${options.bundler}' ${sep}defaults ${installDependencies}`;
            runCommand(`${createAppFolder} ${newCommandSymbol} ${scaffoldPilet} ${newCommandSymbol} ${openProject}`);

            // Dispose Webview
            disposeWebview();
          }
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
          console.log(process.env);
          console.log(process.platform);
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
