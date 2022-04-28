import * as React from 'react';
import type { Uri } from 'vscode';
import { VSCodeButton, VSCodeTextField, VSCodeRadio, VSCodeRadioGroup } from '@vscode/webview-ui-toolkit/react';
import { useStore } from './store';
import folderImage from '../../resources/folders-icon.png';
import selectedItemIcon from '../../resources/selected-item.png';

interface ScaffoldState {
  repoType: string;
  template: string;
}

interface PageProps {
  onNext(newState: ScaffoldState): void;
  onPrevious(): void;
  state: ScaffoldState;
}

function getRef(uri: Uri) {
  const { scheme, authority, path } = uri;
  return `${scheme}://${authority}${path}`;
}

const FirstPage: React.FC<PageProps> = ({ onNext }) => {
  const { state, actions } = useStore();
  const options = state.options;
  const availableTemplates = options.repoType ? state.templates[options.repoType] : undefined;
  const canGoNext = options.template !== '';
  const loading = availableTemplates === undefined;
  const next = () => {
    if (options.repoType && options.template) {
      onNext({
        repoType: options.repoType,
        template: options.template,
      });
    }
  };

  React.useEffect(() => {
    if (options.repoType) {
      actions.loadTemplates(options.repoType);
    }
  }, [options.repoType]);

  return (
    <>
      <div className="container">
        <div className="first-container">
          <div className="containerInfos">
            <div className="container-type">
              <div className="cards containerColumn">
                <p className="columnTitle">Select Type</p>
                {state.repoTypes.map((repoType) => (
                  <div
                    key={repoType.type}
                    onClick={() => actions.updateOptions({ ...state.options, repoType: repoType.type, template: '' })}
                    className={options.repoType === repoType.type ? 'card project selectedCard' : 'card project'}>
                    <img className="selectedCardTag" src={selectedItemIcon} />
                    <div className="cardTitle">
                      <img className="cardTitleIcon" src={getRef(repoType.icon)} />
                      <p className="cardTitleTxt">{repoType.title}</p>
                    </div>
                    <p className="cardDescription">{repoType.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="sideBorder" />
            <div className="templates containerInfos">
              {options.repoType === '' ? undefined : loading ? (
                <div className="spinnerContainer">
                  <div className="spinner" />
                </div>
              ) : (
                <>
                  <p className="columnTitle">Select templates</p>
                  <div className="templatesNames">
                    {availableTemplates.map((template) => (
                      <div
                        key={template.packageName}
                        onClick={() => actions.updateOptions({ ...state.options, template: template.packageName })}
                        className={
                          options.template === template.packageName ? 'card template selectedCard' : 'card template'
                        }>
                        <img className="selectedCardTag" src={selectedItemIcon} />
                        <div className="cardTitle">
                          <p className="cardTitleTxt">{template.name}</p>
                        </div>
                        <p className="cardDescription">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="btnContainer">
        <VSCodeButton className="navigation-btn" href="#" disabled={!canGoNext} onClick={next}>
          Next
        </VSCodeButton>
      </div>
    </>
  );
};

const SecondPage: React.FC<PageProps> = ({ onPrevious }) => {
  const { state, actions } = useStore();
  const options = state.options;

  const { repoType, template, name, bundler, targetFolder } = options;
  const canScaffold = repoType !== '' && template !== '' && name !== '' && bundler !== '' && targetFolder !== '';

  const openLocalPathModal = () => {
    actions.selectLocalPath();
  };

  const createPiralPilet = () => {
    actions.scaffold(options);
  };

  React.useEffect(() => {
    actions.updateOptions({ ...state.options, targetFolder: state.localPath });
  }, [state.localPath]);

  return (
    <>
      <div className="container">
        <div className="second-container">
          <div className="containerInfos">
            <div className="information">
              <p className="columnTitle">Provide Information</p>
              <div className="extraItem">
                <p className="extraItemLabel">Name</p>
                <VSCodeTextField
                  className="extraItemInput"
                  stateName="name"
                  value={options.name}
                  onChange={(ev: any) => actions.updateOptions({ ...state.options, name: ev.target.value })}
                />
              </div>
              <div className="extraItem">
                <VSCodeTextField
                  className="extraItemInput"
                  value={options.targetFolder}
                  onChange={(ev: any) => actions.updateOptions({ ...state.options, targetFolder: ev.target.value })}>
                  <p className="extraItemLabel">Local Path</p>
                  <span slot="end" id="local-path" onClick={openLocalPathModal}>
                    <img className="foldersImg" src={folderImage} />
                  </span>
                </VSCodeTextField>
              </div>

              <div className="extraItem">
                <VSCodeTextField
                  className="extraItemInput"
                  placeholder="1.0.0"
                  value={options.version}
                  onChange={(ev: any) => actions.updateOptions({ ...state.options, version: ev.target.value })}>
                  <p className="extraItemLabel">Version</p>
                </VSCodeTextField>
              </div>
              <div className={`extraItem onlyForPilet ${options.repoType === 'piral' && 'hide'}`}>
                <VSCodeTextField
                  className="extraItemInput"
                  placeholder="sample-piral"
                  value={options.piralPackage}
                  onChange={(ev: any) => actions.updateOptions({ ...state.options, piralPackage: ev.target.value })}>
                  <p className="extraItemLabel">Piral Package</p>
                </VSCodeTextField>
              </div>
              <div className={`extraItem onlyForPilet ${options.repoType === 'piral' && 'hide'}`}>
                <VSCodeTextField
                  className="extraItemInput"
                  placeholder="https://registry.npmjs.org/"
                  value={options.npmRegistry}
                  onChange={(ev: any) => actions.updateOptions({ ...state.options, npmRegistry: ev.target.value })}>
                  <p className="extraItemLabel">NPM Registry</p>
                </VSCodeTextField>
              </div>
              <div className={`extraItem`}>
                <VSCodeRadioGroup className="extraItemInput radioGroup">
                  <label slot="label">Install Node Modules</label>
                  <VSCodeRadio onChange={(ev: any) => actions.updateOptions({ ...state.options, nodeModules: true })}>
                    Yes
                  </VSCodeRadio>
                  <VSCodeRadio onChange={(ev: any) => actions.updateOptions({ ...state.options, nodeModules: false })}>
                    No
                  </VSCodeRadio>
                </VSCodeRadioGroup>
              </div>
            </div>
            <div className="sideBorder"></div>
            <div className="bundlers">
              <p className="columnTitle">Select bundler</p>
              <div className="bundlersCards">
                {state.bundlers.map((bundler) => (
                  <div
                    key={bundler.type}
                    onClick={(ev: any) => actions.updateOptions({ ...state.options, bundler: bundler.type })}
                    className={options.bundler === bundler.type ? 'card bundler selectedCard' : 'card bundler'}>
                    <img className="selectedCardTag" src={selectedItemIcon} />
                    <div className="cardTitle">
                      <img className="cardTitleIcon" src={getRef(bundler.icon)} />
                      <p className="cardTitleTxt">{bundler.title}</p>
                    </div>
                    <div className="cardDescription">{bundler.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="btnContainer">
        <VSCodeButton className="navigation-btn" href="#" onClick={onPrevious}>
          Previous
        </VSCodeButton>
        <VSCodeButton title="Start Scaffolding" href="#" onClick={createPiralPilet} disabled={!canScaffold}>
          Scaffold Project
        </VSCodeButton>
      </div>
    </>
  );
};

const pages = [FirstPage, SecondPage];

const ScaffoldView: React.FC = () => {
  const [pageIndex, setPageIndex] = React.useState(0);
  const state = React.useRef<ScaffoldState>({ repoType: '', template: '' });

  const Page = pages[pageIndex];

  return (
    <Page
      state={state.current}
      onNext={(newState) => {
        state.current = newState;
        setPageIndex((p) => p + 1);
      }}
      onPrevious={() => {
        setPageIndex((p) => p - 1);
      }}
    />
  );
};

export default ScaffoldView;
