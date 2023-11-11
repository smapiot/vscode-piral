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

export async function createRepository(context: vscode.ExtensionContext) {
  const { extensionPath } = context;
  const { window, ViewColumn } = vscode;

  disposeWebview();

  const wv = window.createWebviewPanel('piral.createProject', 'Piral - Create Project', ViewColumn.One, {
    enableScripts: true,
    retainContextWhenHidden: true,
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

          const isWindows = process.platform === 'win32' && !vscode.env.remoteName;
          const pathSep = isWindows ? '\\' : '/';
          const cmdSep = isWindows ? ' ; ' : ' && ';
          const target = `${options.targetFolder}${pathSep}${options.name}`;
          const installDependencies = options.nodeModules ? '--install' : '--no-install';
          const templateOptions = Object.keys(options.templateOptionsValues).map(
            (key) => `--vars.${key}="${options.templateOptionsValues[key]}"`,
          );
          const command = [];

          if (options.repoType === 'piral') {
            // Handle Piral instance
            command.push(
              [
                `npx`,
                `--yes`,
                `create-piral-instance@^1`,
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
                `npx`,
                `--yes`,
                `create-pilet@^1`,
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
            ].join(cmdSep),
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
            const path = localPath[0].fsPath;
            wv.webview.postMessage({ command: 'sendLocalPath', path });
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
