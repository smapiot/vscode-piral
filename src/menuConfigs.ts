import { join } from 'path';

let repoTypeOptions = [
    {
        type: 'piral',
        icon: 'resources/piral.png',
        title: 'Piral',
        description: 'Create a new Piral instance repository.'
    },
    {
        type: 'pilet',
        icon: 'resources/piral.png',
        title: 'Pilet',
        description: 'Create a new Pilet instance repository.'
    },
];

export function getRepoTypeOptions(baseUriResources: string) {
    for(let i=0; i<repoTypeOptions.length; i++) {
        repoTypeOptions[i].icon = `vscode-resource:${join(baseUriResources, repoTypeOptions[i].icon)}`
    }
    return repoTypeOptions;
}

let bundlerOptions = [
    {
        type: 'parcel',
        icon: 'resources/parcel.png',
        title: 'Parcel',
        description: 'Use Parcel as bundler for the repository.'
    },
    {
        type: 'webpack',
        icon: 'resources/webpack.svg',
        title: 'Webpack',
        description: 'Use WebPack as bundler for the repository.'
    },
];

export function getBundlerOptions(baseUriResources: string) {
    for(let i=0; i<bundlerOptions.length; i++) {
        bundlerOptions[i].icon = `vscode-resource:${join(baseUriResources, bundlerOptions[i].icon)}`
    }
    return bundlerOptions;
}
