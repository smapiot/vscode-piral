import * as vscode from 'vscode';
import { join } from 'path';
import axios from 'axios';

const repoTypeOptions = [
  {
    type: 'piral',
    icon: 'resources/piral.png',
    title: 'Piral',
    description: 'Create a new Piral instance project.',
  },
  {
    type: 'pilet',
    icon: 'resources/piral.png',
    title: 'Pilet',
    description: 'Create a new pilet project.',
  },
];

const bundlerOptions = [
  {
    type: 'parcel',
    icon: 'resources/bundlers/parcel.png',
    title: 'Parcel v1',
    package: 'piral-cli-parcel',
    description: 'Use Parcel v1 as bundler for the project.',
  },
  {
    type: 'webpack',
    icon: 'resources/bundlers/webpack.svg',
    title: 'Webpack v4',
    package: 'piral-cli-webpack',
    description: 'Use Webpack v4 as bundler for the project.',
  },
  {
    type: 'parcel2',
    icon: 'resources/bundlers/parcel.png',
    title: 'Parcel v2',
    package: 'piral-cli-parcel2',
    description: 'Use Parcel v2 as bundler for the project.',
  },
  {
    type: 'Webpack5',
    icon: 'resources/bundlers/webpack.svg',
    title: 'Webpack v5',
    package: 'piral-cli-webpack5',
    description: 'Use Webpack v5 as bundler for the project.',
  },
  {
    type: 'vite',
    icon: 'resources/bundlers/vite.png',
    title: 'Vite',
    package: 'piral-cli-vite',
    description: 'Use Vite as bundler for the project.',
  },
  {
    type: 'esbuild',
    icon: 'resources/bundlers/esbuild.png',
    title: 'esbuild',
    package: 'piral-cli-esbuild',
    description: 'Use Esbuild as bundler for the project.',
  },
  {
    type: 'rollup',
    icon: 'resources/bundlers/rollup.png',
    title: 'Rollup',
    package: 'piral-cli-rollup',
    description: 'Use Rollup as bundler for the project.',
  },
  {
    type: 'xbuild',
    icon: 'resources/bundlers/xbuild.png',
    title: 'xbuild',
    package: 'piral-cli-xbuild',
    description: 'Use Xbuild as bundler for the project.',
  },
];

function mapToLocalIcon<T extends { icon: string }>(
  items: Array<T>,
  panel: vscode.WebviewPanel,
  baseUriResources: string,
): Array<T> {
  return items.map((item) => ({
    ...item,
    icon: getResourcePath(panel, baseUriResources, item.icon),
  }));
}

export const bundlerPackages = bundlerOptions.map((b) => b.package);

export function getResourcePath(panel: vscode.WebviewPanel, baseUriResources: string, fileName: string) {
  return panel.webview.asWebviewUri(vscode.Uri.file(join(baseUriResources, fileName)));
}

export function getRepoTypeOptions(panel: vscode.WebviewPanel, baseUriResources: string) {
  return mapToLocalIcon(repoTypeOptions, panel, baseUriResources);
}

export async function getTemplatesNames(type: 'piral' | 'pilet', size = 50) {
  const baseUrl = `https://registry.npmjs.org/-/v1/search?text=keywords:${type}+template&size=${size}`;
  const result = await axios.get(baseUrl);
  const test = /@smapiot\/.*-template-(.*)/;

  const templates = await result.data.objects.map((elm: any) => {
    let { author } = elm.package
    const { description, name: packageName } = elm.package;
    
    if (typeof author === 'string') {
      author = author;
    } else if (typeof author === 'object' && author) {
      author = author.name;
    } else {
      author = ''
    }

    const shortName = test.exec(packageName);
    const name = shortName ? shortName[1] : packageName;
    return {
      name,
      author,
      packageName,
      description,
    };
  });

  return templates;
}

export function getBundlerInfos(packageName: string) {
  return bundlerOptions.find((b) => b.package === packageName);
}

export function getBundlerOptions(panel: vscode.WebviewPanel, baseUriResources: string) {
  return mapToLocalIcon(bundlerOptions, panel, baseUriResources);
}
