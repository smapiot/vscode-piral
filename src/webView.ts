import * as vscode from 'vscode';
import { join } from 'path';
import { getTemplateCode } from './template';
import { getRepoTypeOptions, getBundlerOptions } from './menuConfigs';
import { runCommand } from './helper';

let webviewPanel: vscode.WebviewPanel;

function disposeWebview() {
  if (webviewPanel) {
    webviewPanel.dispose();
  }
}

interface Options {
  repoType: string,
  name: string,
  version: string,
  bundler: string,
  targetFolder: string,
  piralPackage: string,
  npmRegistry: string
}

function validateParameters(options: Options): string[] {
  const validationErrors: Array<string> = [];

  if (options.repoType === '') {
    validationErrors.push('RepoType');
  } else if (options.repoType === 'pilet') {
    if (options.piralPackage === '') {
      validationErrors.push('PiralPackage');
    }
  }

  if (options.bundler.trim() === '') {
    validationErrors.push('Bundler');
  }

  if (options.name.trim() === '') {
    validationErrors.push('Name');
  }

  return validationErrors;
}

export async function createRepository(context: vscode.ExtensionContext) {
  const { extensionPath } = context;
  const { window, ViewColumn } = vscode;

  disposeWebview();

  const folders = await window.showOpenDialog({
    canSelectFolders: true,
    canSelectFiles: false,
    canSelectMany: false,
    openLabel: 'Select a folder to create project'
  });

  if (!folders || folders.length !== 1) {
    return;
  }

  webviewPanel = window.createWebviewPanel(
    'piral.createProject',
    'Create Project',
    ViewColumn.One,
    { enableScripts: true }
  );

  webviewPanel.webview.html = getTemplateCode(extensionPath, 'repository.html.ejs', {
    styles: [
      `vscode-resource:${join(extensionPath, 'media', 'media.css')}`
    ],
    scripts: [
      `vscode-resource:${join(extensionPath, 'media', 'media.js')}`
    ],
    repoTypes: getRepoTypeOptions(extensionPath),
    bundlers: getBundlerOptions(extensionPath),
    images: {
      selectedItemIcon: `vscode-resource:${join(extensionPath, 'resources', 'selectedItem.png')}`
    }
  });

  const onDiskPath = vscode.Uri.file(join(extensionPath, 'resources', 'piral.png'));
  webviewPanel.iconPath = onDiskPath;

  webviewPanel.webview.onDidReceiveMessage(message => {
    if (message.command === 'createPiralPilet') {
      //window.showInformationMessage('createPiralPilet: ' + JSON.stringify(message.parameters));
      const options: Options = Object.assign({
        repoType: '',
        name: '',
        version: '',
        bundler: '',
        targetFolder: '',
        piralPackage: '',
        npmRegistry: ''
      }, message.parameters);
      options.targetFolder = folders[0].fsPath;

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
        runCommand(`${createAppFolder} && ${scaffoldPiral} && ${openProject}`, false);

        // Dispose Webview
        disposeWebview();
      } else if (options.repoType === 'pilet') {
        // Handle Pilet Instance
        const scaffoldPilet = `npm init pilet --source '${options.piralPackage}' --registry '${options.npmRegistry}' --bundler '${options.bundler}' -y`;
        runCommand(`${createAppFolder} && ${scaffoldPilet} && ${openProject}`, false);

        // Dispose Webview
        disposeWebview();
      }
    }
  }, undefined, context.subscriptions);
}
