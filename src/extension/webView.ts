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
          const createAppFolder = `cd '${options.targetFolder}' && mkdir '${options.name}' && cd '${options.name}'`;
          const openProject = `npm --no-git-tag-version version '${options.version}' && code .`;
          const installDependencies = options.nodeModules ? '--install' : '--no-install';

          if (options.repoType === 'piral') {
            // Handle Piral Instance
            const scaffoldPiral = `npm init piral-instance --registry '${options.npmRegistry}' --bundler '${options.bundler}' --defaults ${installDependencies}`;
            runCommand(`${createAppFolder} && ${scaffoldPiral} && ${openProject}`);

            // Dispose Webview
            disposeWebview();
          } else if (options.repoType === 'pilet') {
            // Handle Pilet Instance
            const scaffoldPilet = `npm init pilet --source '${options.piralPackage}' --registry '${options.npmRegistry}' --bundler '${options.bundler}' --defaults ${installDependencies}`;
            runCommand(`${createAppFolder} && ${scaffoldPilet} && ${openProject}`);

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
          const templates = await getTemplatesNames(message.type);
          webviewPanel.webview.postMessage({
            command: 'sendTemplatesNames',
            type: message.type,
            templates,
          });

          break;

        case 'getTemplatesOptions':
          const templatesOptions = await getTemplatesOptions(message.packageName);
          webviewPanel.webview.postMessage({
            command: 'sendTemplatesOptions',
            templatesOptions,
          });

          break;
      }
    },
    undefined,
    context.subscriptions,
  );
}
