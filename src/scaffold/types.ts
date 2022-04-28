import type { Uri } from 'vscode';

declare global {
  interface Window {
    FAST: any;
  }
}

export interface StoreState {
  repoTypes: Array<RepoType>;
  bundlers: Array<Bundler>;
  templates: {
    [repoType: string]: Array<TemplateInfo>;
  };
  localPath: string;
  options: Options
}

export interface TemplateInfo {
  name: string;
  description: string;
  packageName: string;
  author: any;
}

export interface RepoType {
  type: string;
  icon: Uri;
  title: string;
  description: string;
}

export interface Bundler {
  type: string;
  title: string;
  icon: Uri;
  description: string;
}

export interface Options {
  repoType: string;
  template: string;
  name: string;
  version: string;
  bundler: string;
  targetFolder: string;
  piralPackage: string;
  npmRegistry: string;
  nodeModules: boolean,
}

export interface StoreActions {
  initialize(): void;
  loadTemplates(repoType: string): void;
  selectLocalPath(): void;
  updateOptions(options: Options): void;
  scaffold(parameters: any): void;
}

export interface Store {
  state: StoreState;
  actions: StoreActions;
}