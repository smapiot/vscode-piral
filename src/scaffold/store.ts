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

      case 'sendTemplatesOptions':
        const { templatesOptions = {}} = message;
        const values: Record<string, string> = {};
          Object.keys(templatesOptions).forEach((option) => {
            values[option] = templatesOptions[option].default;
          });
        dispatch(set, (state) => ({
          ...state,
          isLoading: false,
          templateOptions: templatesOptions ?? {},
          options: {
            ...state.options,
            templateOptionsValues: values,
          },
        }));
    }
  });

  return {
    state: {
      bundlers: [],
      repoTypes: [],
      templates: {},
      templateOptions: {},
      localPath: '',
      isLoading: false,
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
        templateOptionsValues: {},
      },
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
      updateTemplateOptions() {
        dispatch(set, (state) => ({
          ...state,
          isLoading: true,
        }));
        const packageName = useStore.getState().state.options.template;
        vscode.postMessage({
          command: 'getTemplatesOptions',
          packageName,
        });
      },
      selectLocalPath() {
        vscode.postMessage({
          command: 'getLocalPath',
        });
      },
      updateOptions(newOptions) {
        dispatch(set, (state) => ({
          ...state,
          options: {
            ...state.options,
            ...newOptions,
            templateOptionsValues: { ...state.options.templateOptionsValues, ...newOptions.templateOptionsValues },
          },
        }));
      },
      scaffold() {
        const options = useStore.getState().state.options;
        vscode.postMessage({
          command: 'createPiralPilet',
          options,
        });
      },
    },
  };
});
