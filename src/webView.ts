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
    description: string,
    bundler: string,
    targetFolder: string,
    piralPackage: string,
    npmRegistry: string
}

function validateParameters(options: Options): string[] {
  var validationErrors: string[] = [];

  if(options.repoType == '') {
    validationErrors.push('RepoType');
  } 
  else if (options.repoType == 'pilet') {
      if(options.piralPackage == '') {
        validationErrors.push('PiralPackage');
      }
  }
  
  if(options.bundler.trim() == '') {
    validationErrors.push('Bundler');
  }

  if(options.name.trim() == '') {
    validationErrors.push('Name');
  }
/*
  if(options.description.trim() == '') {
    validationErrors.push('Description');
  }

  if(options.version.trim() == '') {
    validationErrors.push('Version');
  }
*/
  return validationErrors;
}

export async function createRepository(context: vscode.ExtensionContext) {
  const { extensionPath } = context;
  const { window, ViewColumn } = vscode;
  const postBuildScript = join(extensionPath, 'media', 'updatePackageJson.js');

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
      'Piral',
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

  const onDiskPath = vscode.Uri.file(join(context.extensionPath, 'resources', 'piral.png'));
  webviewPanel.iconPath = onDiskPath;

    webviewPanel.webview.onDidReceiveMessage(message => {
    
      if(message.command == 'createPiralPilet') {
        //window.showInformationMessage('createPiralPilet: ' + JSON.stringify(message.parameters));
        let options: Options = {
          repoType: '',
          name: '',
          version: '',
          description: '',
          bundler: '',
          targetFolder: '',
          piralPackage: '',
          npmRegistry: ''
        };

        Object.assign(options, message.parameters);
        options.targetFolder = folders[0].fsPath;

        let validationErrors = validateParameters(options);
        let errorMessage = { command: 'error', data: validationErrors };
        webviewPanel.webview.postMessage(errorMessage);

        if(validationErrors.length > 0) {
          return;
        }
        
        // Go to target folder & create app folder
        let createAppFolder = `cd '${options.targetFolder}' && mkdir '${options.name}' && cd '${options.name}'`;
        let updatePackageJsonCommand = `node ${postBuildScript} --target '${options.targetFolder}/${options.name}' --name '${options.name}' --version '${options.version}' --description '${options.description}' --bundler '${options.bundler}'`;
        let installNpmPackagesAndCallVSCode = `npm install && code .`;

        if(options.repoType === 'piral') {
          // Handle Piral Instance
          runCommand(`${createAppFolder} && npm init piral-instance -y && ${updatePackageJsonCommand} && ${installNpmPackagesAndCallVSCode}`, false);

          // Dispose Webview
          disposeWebview();
        } else if (options.repoType === 'pilet') { 
          // Handle Pilet Instance
          runCommand(`${createAppFolder} && npm init pilet -y && ${updatePackageJsonCommand} --piralPackage '${options.piralPackage}' --npmRegistry '${options.npmRegistry}' && ${installNpmPackagesAndCallVSCode}`, false);

          // Dispose Webview
          disposeWebview();
        }
      }
  }, undefined, context.subscriptions);
}

