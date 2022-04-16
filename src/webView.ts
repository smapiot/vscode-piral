import * as vscode from 'vscode';
import { join } from 'path';
import {
  getTemplateCode,
  runCommand,
  getRepoTypeOptions,
  getBundlerOptions,
  getResourcePath,
  getToolkitUri,
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
}

function validateParameters(options: Options): string[] {
  const validationErrors: Array<string> = [];

  if (!options.targetFolder) {
    validationErrors.push('LocalPath');
  }

  if (!options.repoType) {
    validationErrors.push('RepoType');
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
  const { extensionPath, extensionUri } = context;
  const { window, ViewColumn } = vscode;

  disposeWebview();

  webviewPanel = window.createWebviewPanel('piral.createProject', 'Piral - Create Project', ViewColumn.One, {
    enableScripts: true,
  });

  webviewPanel.webview.html = getTemplateCode(extensionPath, 'repository', {
    styles: [getResourcePath(webviewPanel, extensionPath, 'media/media.css')],
    scripts: [
      { url: getResourcePath(webviewPanel, extensionPath, 'media/media.js'), type: 'application/javascript' },
      { url: getToolkitUri(webviewPanel.webview, extensionUri), type: 'module' },
    ],
    repoTypes: getRepoTypeOptions(webviewPanel, extensionPath),
    bundlers: getBundlerOptions(webviewPanel, extensionPath),
    images: {
      selectedItemIcon: getResourcePath(webviewPanel, extensionPath, 'resources/selectedItem.png'),
      foldersIcon: getResourcePath(webviewPanel, extensionPath, 'resources/foldersIcon.png'),
    },
  });

  webviewPanel.iconPath = vscode.Uri.file(join(extensionPath, 'resources/piral.png'));

  webviewPanel.webview.onDidReceiveMessage(
    async (message) => {
      if (message.command === 'createPiralPilet') {
        const options: Options = Object.assign(
          {
            repoType: '',
            name: '',
            version: '',
            bundler: '',
            targetFolder: '',
            piralPackage: '',
            npmRegistry: '',
          },
          message.parameters,
        );
          console.log(options)
        const validationErrors = validateParameters(options);
        const errorMessage = { command: 'error', data: validationErrors };
        webviewPanel.webview.postMessage(errorMessage);

        if (validationErrors.length > 0) {
          return;
        }

        // Go to target folder & create app folder
        const createAppFolder = `cd '${options.targetFolder}' && mkdir '${options.name}' && cd '${options.name}'`;
        const openProject = `npm --no-git-tag-version version '${options.version}' && code .`;

        if (options.repoType === 'piral') {
          // Handle Piral Instance
          const scaffoldPiral = `npm init piral-instance --registry '${options.npmRegistry}' --bundler '${options.bundler}' -y`;
          runCommand(`${createAppFolder} && ${scaffoldPiral} && ${openProject}`);

          // Dispose Webview
          disposeWebview();
        } else if (options.repoType === 'pilet') {
          // Handle Pilet Instance
          const scaffoldPilet = `npm init pilet --source '${options.piralPackage}' --registry '${options.npmRegistry}' --bundler '${options.bundler}' -y`;
          runCommand(`${createAppFolder} && ${scaffoldPilet} && ${openProject}`);

          // Dispose Webview
          disposeWebview();
        }
      } else if (message.command === 'getLocalPath') {
        const localPath = await window.showOpenDialog({
          canSelectFolders: true,
          canSelectFiles: false,
          canSelectMany: false,
          openLabel: 'Select a folder to create project',
        });
        if (localPath){
          webviewPanel.webview.postMessage({ command: 'sendLocalPath', data: localPath});
        }
      }
    },
    undefined,
    context.subscriptions,
  );
}
