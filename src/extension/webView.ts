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

let webviewPanel: vscode.WebviewPanel | undefined;

function disposeWebview() {
  if (webviewPanel) {
    webviewPanel.dispose();
    webviewPanel = undefined;
  }
}

interface Options {
  repoType: string;
  template: string;
  name: string;
  client: string;
  language: string;
  version: string;
  bundler: string;
  targetFolder: string;
  piralPackage: string;
  npmRegistry: string;
  nodeModules: boolean;
  templateOptionsValues: Record<string, string>;
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

  const wv = window.createWebviewPanel('piral.createProject', 'Piral - Create Project', ViewColumn.One, {
    enableScripts: true,
  });

  wv.webview.html = getTemplateCode(getResourcePath(wv, extensionPath, 'dist/scaffold.js'));

  wv.iconPath = vscode.Uri.file(join(extensionPath, 'resources/piral.png'));

  wv.webview.onDidReceiveMessage(
    async (message) => {
      switch (message.command) {
        case 'initialize': {
          wv.webview.postMessage({
            command: 'sendInitialState',
            data: {
              repoTypes: getRepoTypeOptions(wv, extensionPath),
              bundlers: getBundlerOptions(wv, extensionPath),
              clients: getNpmClientOptions(wv, extensionPath),
              languages: getLanguageOptions(wv, extensionPath),
            },
          });
          break;
        }
        case 'close': {
          disposeWebview();
          break;
        }
        case 'createPiralPilet': {
          const options: Options = message.options;
          const validationErrors = validateParameters(options);

          if (validationErrors.length > 0) {
            return;
          }

          const target = `${options.targetFolder}/${options.name}`;
          const installDependencies = options.nodeModules ? '--install' : '--no-install';
          const templateOptions = Object.keys(options.templateOptionsValues).map(
            (key) => `--vars.${key}="${options.templateOptionsValues[key]}"`,
          );
          const sep = (await isLegacyNpmVersion()) ? '--' : '';
          const command = [];

          if (options.repoType === 'piral') {
            // Handle Piral instance
            command.push(
              [
                `npm init piral-instance`,
                // sep,
                `--registry ${options.npmRegistry}`,
                `--bundler ${options.bundler}`,
                `--template ${options.template}`,
                `--npm-client ${options.client}`,
                `--target "${target}"`,
                `--language ${options.language}`,
                installDependencies,
                ...templateOptions,
                '--defaults',
              ].join(' '),
            );
          } else if (options.repoType === 'pilet') {
            // Handle pilet
            command.push(
              [
                `npm init pilet`,
                // sep,
                `--source ${options.piralPackage}`,
                `--registry ${options.npmRegistry}`,
                `--bundler ${options.bundler}`,
                `--template ${options.template}`,
                `--npm-client ${options.client}`,
                `--target "${target}"`,
                `--language ${options.language}`,
                installDependencies,
                ...templateOptions,
                '--defaults',
              ].join(' '),
            );
          }

          runCommand(
            [
              ...command,
              `cd ${target}`,
              `npm version ${options.version} --no-git-tag --allow-same-version`,
              'code .',
            ].join(' && '),
          );
          break;
        }
        case 'getLocalPath': {
          const localPath = await window.showOpenDialog({
            canSelectFolders: true,
            canSelectFiles: false,
            canSelectMany: false,
            openLabel: 'Select a folder to create project',
          });

          if (localPath) {
            wv.webview.postMessage({ command: 'sendLocalPath', data: localPath });
          }

          break;
        }
        case 'getTemplatesNames': {
          const templates = await getTemplatesNames(message.type);
          wv.webview.postMessage({
            command: 'sendTemplatesNames',
            type: message.type,
            templates,
          });

          break;
        }
        case 'getTemplatesOptions': {
          const templateOptions = await getTemplatesOptions(message.packageName);
          wv.webview.postMessage({
            command: 'sendTemplatesOptions',
            templateOptions,
          });

          break;
        }
      }
    },
    undefined,
    context.subscriptions,
  );

  webviewPanel = wv;
}
