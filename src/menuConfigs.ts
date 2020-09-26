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

export function getRepoTypeOptions(baseUriResources: string) {
  for (const repoTypeOption of repoTypeOptions) {
    repoTypeOption.icon = `vscode-resource:${join(baseUriResources, repoTypeOption.icon)}`;
  }

  return repoTypeOptions;
}

let bundlerOptions = [
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

export function getBundlerOptions(baseUriResources: string) {
  for (const bundlerOption of bundlerOptions) {
    bundlerOption.icon = `vscode-resource:${join(baseUriResources, bundlerOption.icon)}`;
  }

  return bundlerOptions;
}
