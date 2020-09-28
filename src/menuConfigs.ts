import { join } from 'path';

const repoTypeOptions = [
  {
    type: 'piral',
    icon: 'resources/piral.png',
    title: 'Piral',
    description: 'Create a new Piral instance project.'
  },
  {
    type: 'pilet',
    icon: 'resources/piral.png',
    title: 'Pilet',
    description: 'Create a new pilet project.'
  },
];

const bundlerOptions = [
  {
    type: 'parcel',
    icon: 'resources/parcel.png',
    title: 'Parcel',
    description: 'Use Parcel as bundler for the project.'
  },
  {
    type: 'webpack',
    icon: 'resources/webpack.svg',
    title: 'Webpack',
    description: 'Use Webpack as bundler for the project.'
  },
];

function mapToLocalIcon<T extends { icon: string }>(items: Array<T>, baseUriResources: string): Array<T> {
  return items.map(item => ({
    ...item,
    icon: `vscode-resource:${join(baseUriResources, item.icon)}`,
  }));
}

export function getRepoTypeOptions(baseUriResources: string) {
  return mapToLocalIcon(repoTypeOptions, baseUriResources);
}

export function getBundlerOptions(baseUriResources: string) {
  return mapToLocalIcon(bundlerOptions, baseUriResources);
}
