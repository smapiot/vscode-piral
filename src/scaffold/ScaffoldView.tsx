import * as React from 'react';
import type { Uri } from 'vscode';
import { VSCodeButton, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { useStore } from './store';
import folderImage from '../../resources/folders-icon.png';
import selectedItemIcon from '../../resources/selected-item.png';

interface ScaffoldState {
  repoType: string;
  template: string;
}
interface options {
  repoType: string;
  template: string;
  name: string;
  version: string;
  bundler: string;
  targetFolder: string;
  piralPackage: string;
  npmRegistry: string;
}

interface PageProps {
  onNext(newState: ScaffoldState): void;
  onPrevious(): void;
  state: ScaffoldState;
  options: options;
  setOptions: React.Dispatch<React.SetStateAction<options>>;
}

function getRef(uri: Uri) {
  const { scheme, authority, path } = uri;
  return `${scheme}://${authority}${path}`;
}

const FirstPage: React.FC<PageProps> = ({ onNext, options, setOptions }) => {
  const { state, actions } = useStore();
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
                    onClick={() => setOptions((options) => ({ ...options, repoType: repoType.type, template: '' }))}
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
                        onClick={() => setOptions((options) => ({ ...options, template: template.packageName }))}
                        className={
                          options.template === template.packageName ? 'card template selectedCard' : 'card template'
                        }>
                        <img className="selectedCardTag" src={selectedItemIcon} />
                        <div className="cardTitle">
                          <p className="cardTitleTxt">{template.name}</p>
                        </div>
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

const SecondPage: React.FC<PageProps> = ({ onPrevious, options, setOptions }) => {
  const { state, actions } = useStore();

  const { repoType, template, name, bundler, targetFolder } = options;
  const canScaffold = repoType !== '' && template !== '' && name !== '' && bundler !== '' && targetFolder !== '';

  const openLocalPathModal = () => {
    actions.selectLocalPath();
  };

  const createPiralPilet = () => {
    actions.scaffold(options);
  };

  const setLocalPath = (value: string) => {
    setOptions((options) => ({ ...options, targetFolder: value }));
  };

  React.useEffect(() => {
    setOptions((options) => ({ ...options, targetFolder: state.localPath }));
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
                  onKeyUp={(ev: any) => setOptions((options) => ({ ...options, name: ev.target.value }))}
                />
              </div>
              <div className="extraItem">
                <VSCodeTextField
                  className="extraItemInput"
                  value={options.targetFolder}
                  onKeyUp={(ev: any) => setLocalPath(ev.target.value)}>
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
                  onKeyUp={(ev: any) => setOptions((options) => ({ ...options, version: ev.target.value }))}>
                  <p className="extraItemLabel">Version</p>
                </VSCodeTextField>
              </div>
              <div className={`extraItem onlyForPilet ${options.repoType === 'piral' && 'hide'}`}>
                <VSCodeTextField
                  className="extraItemInput"
                  placeholder="sample-piral"
                  value={options.piralPackage}
                  onKeyUp={(ev: any) => setOptions((options) => ({ ...options, piralPackage: ev.target.value }))}>
                  <p className="extraItemLabel">Piral Package</p>
                </VSCodeTextField>
              </div>
              <div className={`extraItem onlyForPilet ${options.repoType === 'piral' && 'hide'}`}>
                <VSCodeTextField
                  className="extraItemInput"
                  placeholder="https://registry.npmjs.org/"
                  value={options.npmRegistry}
                  onKeyUp={(ev: any) => setOptions((options) => ({ ...options, npmRegistry: ev.target.value }))}>
                  <p className="extraItemLabel">NPM Registry</p>
                </VSCodeTextField>
              </div>
            </div>
            <div className="sideBorder"></div>
            <div className="bundlers">
              <p className="columnTitle">Select bundler</p>
              <div className="bundlersCards">
                {state.bundlers.map((bundler) => (
                  <div
                    key={bundler.type}
                    onClick={() => setOptions((options) => ({ ...options, bundler: bundler.type }))}
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
  const [options, setOptions] = React.useState({
    repoType: '',
    template: '',
    name: '',
    version: '',
    bundler: '',
    targetFolder: '',
    piralPackage: '',
    npmRegistry: '',
  });

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
      options={options}
      setOptions={setOptions}
    />
  );
};

export default ScaffoldView;
