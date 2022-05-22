import * as vscode from 'vscode';
import { existsSync } from 'fs';

export const providedDebugConfig: vscode.DebugConfiguration = {
  type: 'pwa-msedge',
  request: 'launch',
  name: 'webdebug',
  url: 'http://localhost:1234',
  webRoot: '${workspaceFolder}',
  runtimeExecutable: 'stable',
  runtimeArgs: ['--headless'],
};

const providedPiralCompoundDebugConfig: CompoundConfig = {
  name: 'Launch Piral Instance',
  configurations: ['webdebug'],
  stopAll: true,
  preLaunchTask: 'npm start',
};

const providedPiletCompoundDebugConfig: CompoundConfig = {
  name: 'Launch pilet',
  configurations: ['webdebug'],
  stopAll: true,
  preLaunchTask: 'npm start',
};

export type LaunchConfig = 'None' | 'Unsupported' | string;

export interface CompoundConfig {
  name: string;
  configurations: Array<string>;
  /**
   * Additional debug type specific properties.
   */
  [key: string]: any;
}

export const extensionConfigs: vscode.DebugConfiguration[] = [providedDebugConfig];

export const extensionCompoundConfigs: CompoundConfig[] = [
  providedPiralCompoundDebugConfig,
  providedPiletCompoundDebugConfig,
];

export class LaunchConfigManager {
  private launchConfig: LaunchConfig;
  private isValidConfig: boolean;
  private static launchConfigManagerInstance: LaunchConfigManager;

  private constructor() {
    this.launchConfig = 'None';
    this.isValidConfig = false;
    this.updateLaunchConfig();
  }

  static get instance(): LaunchConfigManager {
    if (!LaunchConfigManager.launchConfigManagerInstance) {
      LaunchConfigManager.launchConfigManagerInstance = new LaunchConfigManager();
    }
    return LaunchConfigManager.launchConfigManagerInstance;
  }

  getLaunchConfig(): LaunchConfig {
    this.updateLaunchConfig();
    return this.launchConfig;
  }

  updateLaunchConfig(): void {
    // Check if there is a folder open
    if (!vscode.workspace.workspaceFolders) {
      void vscode.commands.executeCommand('setContext', 'launchJsonStatus', 'None');
      this.launchConfig = 'None';
      this.isValidConfig = false;
      return;
    }

    // Check if there's a launch.json file
    const workspaceUri = vscode.workspace.workspaceFolders[0].uri;
    const filePath = `${workspaceUri.fsPath}/.vscode/launch.json`;

    if (existsSync(filePath)) {
      // Check if there is a supported debug config
      const configs = vscode.workspace
        .getConfiguration('launch', workspaceUri)
        .get('configurations') as Array<vscode.DebugConfiguration>;

      const compoundConfigs = vscode.workspace
        .getConfiguration('launch', workspaceUri)
        .get('compounds') as Array<CompoundConfig>;
      if (
        this.getMissingConfigs(configs, extensionConfigs).length === 0 &&
        this.getMissingConfigs(compoundConfigs, extensionCompoundConfigs).length === 0
      ) {
        void vscode.commands.executeCommand('setContext', 'launchJsonStatus', 'Supported');
        this.launchConfig = extensionCompoundConfigs[0].name; // extensionCompoundConfigs[0].name => 'Launch Edge Headless and attach DevTools'
        this.isValidConfig = true;
        return;
      }

      void vscode.commands.executeCommand('setContext', 'launchJsonStatus', 'Unsupported');
      this.launchConfig = 'Unsupported';
      this.isValidConfig = false;
      return;
    }

    void vscode.commands.executeCommand('setContext', 'launchJsonStatus', 'None');
    this.launchConfig = 'None';
    this.isValidConfig = false;
  }

  isValidLaunchConfig(): boolean {
    return this.isValidConfig;
  }

  getMissingConfigs(
    userConfigs: Array<Record<string, unknown>>,
    extensionConfigs: Array<Record<string, unknown>>,
  ): Array<Record<string, unknown>> {
    const missingConfigs: Record<string, unknown>[] = [];
    for (const extensionConfig of extensionConfigs) {
      let configExists = false;

      for (const userConfig of userConfigs) {
        if (this.compareConfigs(userConfig, extensionConfig)) {
          configExists = true;
          break;
        }
      }

      if (!configExists) {
        missingConfigs.push(extensionConfig);
      }
    }

    return missingConfigs;
  }

  compareConfigs(userConfig: Record<string, unknown>, extensionConfig: Record<string, unknown>): boolean {
    for (const property of Object.keys(extensionConfig)) {
      if (property === 'url' || property === 'presentation') {
        continue;
      }
      if (Array.isArray(extensionConfig[property]) && Array.isArray(userConfig[property])) {
        const userPropertySet = new Set(userConfig[property] as Array<string>);
        for (const extensionConfigProperty of extensionConfig[property] as Array<string>) {
          if (!userPropertySet.has(extensionConfigProperty)) {
            return false;
          }
        }
      } else if (userConfig[property] !== extensionConfig[property]) {
        return false;
      }
    }
    return true;
  }
}
