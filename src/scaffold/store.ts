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
      case 'error':
        // const errors = message.data;
        // showValidationErrors(errors);
        break;

      case 'sendLocalPath':
        // const localPath = message.data[0].path;
        // displayLocalPath(localPath);
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
    },
  };
});
