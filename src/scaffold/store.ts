import create, { SetState } from 'zustand';
import { Store, StoreState } from './types';

function dispatch(set: SetState<Store>, update: (state: StoreState) => Partial<StoreState>) {
  set((store) => ({
    ...store,
    state: {
      ...store.state,
      ...update(store.state),
    },
  }));
}

const vscode = acquireVsCodeApi();

export const useStore = create<Store>((set) => {
  window.addEventListener('message', (ev) => {
    const message = ev.data;

    switch (message.command) {
      case 'sendLocalPath':
        const localPath = message.data[0].path;
        dispatch(set, (state) => ({
          ...state,
          localPath: localPath,
        }));
        break;

      case 'sendTemplatesNames':
        dispatch(set, (state) => ({
          templates: {
            ...state.templates,
            [message.type]: message.templates,
          },
        }));
        break;

      case 'sendInitialState':
        const { repoTypes, bundlers } = message.data;
        dispatch(set, () => ({
          repoTypes,
          bundlers,
        }));
        break;
    }
  });

  return {
    state: {
      bundlers: [],
      repoTypes: [],
      templates: {},
      localPath: '',
      options: {
        repoType: '',
        template: '',
        name: '',
        version: '',
        bundler: '',
        targetFolder: '',
        piralPackage: '',
        npmRegistry: '',
        nodeModules: true,
      }
    },
    actions: {
      initialize() {
        vscode.postMessage({
          command: 'initialize',
        });
      },
      loadTemplates(repoType) {
        vscode.postMessage({
          command: 'getTemplatesNames',
          type: repoType,
        });
      },
      updateOptions(options) {
        dispatch(set, (state) => ({
          ...state,
          options: options,
        }));
      },
      selectLocalPath() {
        vscode.postMessage({
          command: 'getLocalPath',
        });
      },
      scaffold(parameters) {
        vscode.postMessage({
          command: 'createPiralPilet',
          parameters,
        });
      },
    },
  };
});
