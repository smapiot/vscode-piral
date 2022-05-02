/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/react';
import { bundlers, cards, container, infosInputs, spinner, templates } from './styles';
import type { Uri } from 'vscode';
import { VSCodeButton, VSCodeTextField, VSCodeCheckbox } from '@vscode/webview-ui-toolkit/react';
import { useStore } from './store';
import folderImage from '../../resources/folders-icon.png';
import selectedItemIcon from '../../resources/selected-item.png';
import axios from 'axios';

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
  const { repoType } = options;
  const availableTemplates = repoType ? state.templates[repoType] : undefined;
  const canGoNext = options.template !== '';
  const loading = availableTemplates === undefined;

  const handleClickTemplate = async (packageName: string) => {
    actions.updateOptions({ template: packageName })

    // Get the template options and save them in the store 👇
    const baseUrl = `https://registry.npmjs.org/${packageName}`
    const result = await axios.get(baseUrl);
    const packageMetaData = await JSON.parse(result.request.response);
    const latestVersion = await packageMetaData["dist-tags"].latest;
    const templateOptions = await packageMetaData.versions[latestVersion].templateOptions;
    actions.updateTemplateOptions(templateOptions);
  }

  React.useEffect(() => {
    if (repoType) {
      actions.loadTemplates(repoType);
    }
  }, [repoType]);

  return (
    <React.Fragment>
      <div className="containerWrapper" css={container}>
        <div className="container">
            <div className="containerInfos">
              <div className="container-type">
                <div className="containerColumn" css={cards}>
                  <p className="columnTitle">Select Type</p>
                  {state.repoTypes.map((repoType) => (
                    <div
                      key={repoType.type}
                      onClick={() => actions.updateOptions({ repoType: repoType.type, template: '' })}
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
              <div className="templatesWrapper" css={templates}>
                <div className="templates containerInfos">
                  {repoType === '' ? undefined : loading ? (
                    <div className="spinnerWrapper" css={spinner}>
                      <div className="spinner" />
                    </div>
                  ) : (
                    <React.Fragment>
                      <p className="columnTitle">Select templates</p>
                      <div className="templatesNames" css={cards}>
                        {availableTemplates.map((template) => (
                          <div
                            key={template.packageName}
                            onClick={() => handleClickTemplate(template.packageName)}
                            className={
                              options.template === template.packageName ? 'card template selectedCard' : 'card template'
                            }>
                            <img className="selectedCardTag" src={selectedItemIcon} />
                            <div className="cardTitle">
                              <p className="cardTitleTxt">{template.name}</p>
                              {template.name !== template.packageName && (
                                <p className="cardTitleTxt packageName">{template.packageName}</p>
                              )}
                            </div>
                            <p
                              className={`cardDescription ${template.name === template.packageName ? 'spaceTop' : ''}`}>
                              {template.description}
                            </p>
                            <div className="cardFooter">
                              <p>{template.author}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
        </div>
      </div>
      <div className="btnContainer">
        <VSCodeButton className="navigation-btn" href="#" disabled={!canGoNext} onClick={onNext}>
          Next
        </VSCodeButton>
      </div>
    </React.Fragment>
  );
};

const SecondPage: React.FC<PageProps> = ({ onPrevious }) => {
  const { state, actions } = useStore();
  const options = state.options;
  const [valid, setValid] = React.useState(true);

  const { repoType, template, name, bundler, targetFolder, version, piralPackage, npmRegistry, nodeModules } = options;
  const canScaffold = repoType !== '' && template !== '' && name !== '' && bundler !== '' && targetFolder !== '';

  const openLocalPathModal = () => {
    actions.selectLocalPath();
  };

  const createPiralPilet = () => {
    const test = /(\/[A-Za-z_\/-\s0-9\.]+)+$/;
    const isValid = test.exec(options.targetFolder);
    if (!isValid) {
      setValid(false);
      return;
    }

    actions.scaffold();
  };

  React.useEffect(() => {
    actions.updateOptions({ targetFolder: state.localPath });
  }, [state.localPath]);

  return (
    <React.Fragment>
      <div className="containerWrapper" css={container}>
        <div className="container">
            <div className="containerInfos">
              <div className="information" css={infosInputs}>
                <p className="columnTitle">Provide Information</p>
                <div className="extraItem">
                  <p className="extraItemLabel">Name</p>
                  <VSCodeTextField
                    className="extraItemInput"
                    stateName="name"
                    value={name}
                    onChange={(ev: any) => actions.updateOptions({ name: ev.target.value })}
                  />
                </div>
                <div className="extraItem">
                  <VSCodeTextField
                    className="extraItemInput"
                    value={targetFolder}
                    onChange={(ev: any) => actions.updateOptions({ targetFolder: ev.target.value })}>
                    <p className="extraItemLabel">
                      Local Path <span className={`errorMessage ${valid ? 'hide' : ''}`}>[invalid path]</span>
                    </p>
                    <span slot="end" id="local-path" onClick={openLocalPathModal}>
                      <img className="foldersImg" src={folderImage} />
                    </span>
                  </VSCodeTextField>
                </div>

                <div className="extraItem">
                  <VSCodeTextField
                    className="extraItemInput"
                    placeholder="1.0.0"
                    value={version}
                    onChange={(ev: any) => actions.updateOptions({ version: ev.target.value })}>
                    <p className="extraItemLabel">Version</p>
                  </VSCodeTextField>
                </div>
                <div className={`extraItem onlyForPilet ${options.repoType === 'piral' && 'hide'}`}>
                  <VSCodeTextField
                    className="extraItemInput"
                    placeholder="sample-piral"
                    value={piralPackage}
                    onChange={(ev: any) => actions.updateOptions({ piralPackage: ev.target.value })}>
                    <p className="extraItemLabel">Piral Package</p>
                  </VSCodeTextField>
                </div>
                <div className={`extraItem onlyForPilet ${options.repoType === 'piral' && 'hide'}`}>
                  <VSCodeTextField
                    className="extraItemInput"
                    placeholder="https://registry.npmjs.org/"
                    value={npmRegistry}
                    onChange={(ev: any) => actions.updateOptions({ npmRegistry: ev.target.value })}>
                    <p className="extraItemLabel">NPM Registry</p>
                  </VSCodeTextField>
                </div>
                <div className={`extraItem`} onClick={() => actions.updateOptions({ nodeModules: !nodeModules })}>
                  <VSCodeCheckbox checked={nodeModules} required>
                    Install dependencies
                  </VSCodeCheckbox>
                </div>
              </div>
              <div className="sideBorder"></div>
              <div className="bundlersWrapper" css={bundlers}>
                <div className="bundlers">
                  <p className="columnTitle">Select bundler</p>
                  <div className="bundlersCards" css={cards}>
                    {state.bundlers.map((bundler) => (
                      <div
                        key={bundler.type}
                        onClick={() => actions.updateOptions({ bundler: bundler.type })}
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
      </div>
      <div className="btnContainer">
        <VSCodeButton className="navigation-btn" href="#" onClick={onPrevious}>
          Previous
        </VSCodeButton>
        <VSCodeButton title="Start Scaffolding" href="#" onClick={createPiralPilet} disabled={!canScaffold}>
          Scaffold Project
        </VSCodeButton>
      </div>
    </React.Fragment>
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
      onNext={() => {
        setPageIndex((p) => p + 1);
      }}
      onPrevious={() => {
        setPageIndex((p) => p - 1);
      }}
    />
  );
};

export default ScaffoldView;
