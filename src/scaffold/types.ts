import type { Uri } from 'vscode';

declare global {
  interface Window {
    FAST: any;
  }
}

interface TemplateOptionsParams {
  description: string;
  default: string;
  type: 'string' | 'boolean' | 'number';
}

export interface StoreState {
  repoTypes: Array<RepoType>;
  bundlers: Array<Bundler>;
  templates: {
    [repoType: string]: Array<TemplateInfo>;
  };
  templateOptions: Record<string, TemplateOptionsParams>;
  localPath: string;
  options: Options;
  isLoading: boolean;
}

export interface TemplateInfo {
  name: string;
  description: string;
  packageName: string;
  author: string;
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
  nodeModules: boolean;
  templateOptionsValues: Record<string, string>;
}

export interface StoreActions {
  initialize(): void;
  loadTemplates(repoType: string): void;
  updateTemplateOptions(): void;
  selectLocalPath(): void;
  updateOptions(newOptions: Partial<Options>): void;
  scaffold(): void;
}

export interface Store {
  state: StoreState;
  actions: StoreActions;
}
