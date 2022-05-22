import * as vscode from 'vscode';
import { providedDebugConfig } from './launchConfigManager';

interface IUserConfig {
  port: number;
  url: string;
  urlFilter: string;
}

export class LaunchDebugProvider implements vscode.DebugConfigurationProvider {
  public readonly context: vscode.ExtensionContext;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }

  provideDebugConfigurations(
    _folder: vscode.WorkspaceFolder | undefined,
    _token?: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.DebugConfiguration[]> {
    return Promise.resolve([providedDebugConfig]);
  }

  resolveDebugConfiguration(
    _folder: vscode.WorkspaceFolder | undefined,
    config: vscode.DebugConfiguration,
    _token?: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.DebugConfiguration> {
    const userConfig = config as Partial<IUserConfig>;

    if (config && (config.type === 'edge' || config.type === 'msedge')) {
      void vscode.window
        .showWarningMessage(
          `Launch type "${config.type}" is deprecated. Update your launch.json to use "pwa-msedge" instead.`,
          'Learn More',
          'OK',
        )
        .then((value) => {
          if (value === 'Learn More') {
            const uri = vscode.Uri.parse('https://code.visualstudio.com/docs/nodejs/browser-debugging');
            void vscode.env.openExternal(uri);
          }
        });
      const settings = vscode.workspace.getConfiguration('vscode-edge-devtools');
      if (settings.get('autoAttachViaDebuggerForEdge')) {
        if (!userConfig.port) {
          userConfig.port = 2015;
        }
        if (userConfig.urlFilter) {
          userConfig.url = userConfig.urlFilter;
        }

        //TODO
      }
      return Promise.resolve(config);
    } else {
      vscode.window.showErrorMessage('No supported launch config was found.') as Promise<void>;
    }

    return undefined;
  }
}
