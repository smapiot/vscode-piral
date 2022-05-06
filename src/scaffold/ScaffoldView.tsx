/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/react';
import { useStore } from './store';
import Card from './components/Card';
import { VSCodeButton, VSCodeTextField, VSCodeCheckbox, VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { bundlers, cards, container, infosInputs, spinner, templates } from './styles';
import folderImage from '../../resources/folders-icon.png';
interface ScaffoldState {
  repoType: string;
  template: string;
}

interface PageProps {
  onNext(newState: ScaffoldState): void;
  onPrevious(): void;
  state: ScaffoldState;
}

const FirstPage: React.FC<PageProps> = ({ onNext }) => {
  const { state, actions } = useStore();
  const options = state.options;
  const { repoType } = options;
  const availableTemplates = repoType ? state.templates[repoType] : undefined;
  const canGoNext = options.template !== '';
  const loading = availableTemplates === undefined;

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
            <div className="container-type scroll">
              <div className="containerColumn" css={cards}>
                <p className="columnTitle">Select Type</p>
                {state.repoTypes.map((repoType) => (
                  <Card
                    type="repoType"
                    key={repoType.title}
                    iconUri={repoType.icon}
                    title={repoType.title}
                    description={repoType.description}
                    handleOnClick={() => actions.updateOptions({ repoType: repoType.title.toLocaleLowerCase(), template: '' })}
                  />
                ))}
              </div>
            </div>
            <div className="sideBorder" />
            <div className="templatesWrapper" css={templates}>
              <div className="templates containerInfos scroll">
                {repoType === '' ? undefined : loading ? (
                  <div className="spinnerWrapper" css={spinner}>
                    <VSCodeProgressRing />
                  </div>
                ) : (
                  <React.Fragment>
                    <p className="columnTitle">Select templates</p>
                    <div className="templatesNames" css={cards}>
                      {availableTemplates.map((template) => (
                        <Card
                          type="template"
                          key={template.packageName}
                          shortName={template.name}
                          title={template.packageName}
                          description={template.description}
                          author={template.author}
                          handleOnClick={() => actions.updateOptions({ template: template.packageName })}
                        />
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
        <VSCodeButton href="#" disabled={!canGoNext} onClick={onNext}>
          Next
        </VSCodeButton>
      </div>
    </React.Fragment>
  );
};

const SecondPage: React.FC<PageProps> = ({ onPrevious }) => {
  const { state, actions } = useStore();
  const { templateOptions, isLoading } = state;
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
          {isLoading ? (
            <div className="spinnerWrapper" css={spinner}>
              <VSCodeProgressRing />
            </div>
          ) : (
            <React.Fragment>
              <div className="containerInfos secondPage">
                <div className="information" css={infosInputs}>
                  <p className="columnTitle">Provide Information</p>
                  <div className="inputsWrapper">
                    <div className="extraItem">
                      <p className="extraItemLabel">Name</p>
                      <VSCodeTextField
                        className="extraItemInput"
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
                    <div className={`extraItem ${repoType === 'piral' ? 'hide' : ''}`}>
                      <VSCodeTextField
                        className="extraItemInput"
                        placeholder="sample-piral"
                        value={piralPackage}
                        onChange={(ev: any) => actions.updateOptions({ piralPackage: ev.target.value })}>
                        <p className="extraItemLabel">Piral Package</p>
                      </VSCodeTextField>
                    </div>
                    <div className={`extraItem ${repoType === 'piral' ? 'hide' : ''}`}>
                      <VSCodeTextField
                        className="extraItemInput"
                        placeholder="https://registry.npmjs.org/"
                        value={npmRegistry}
                        onChange={(ev: any) => actions.updateOptions({ npmRegistry: ev.target.value })}>
                        <p className="extraItemLabel">NPM Registry</p>
                      </VSCodeTextField>
                    </div>
                  </div>
                </div>
                <div className={`extraItem`} onClick={() => actions.updateOptions({ nodeModules: !nodeModules })}>
                  <VSCodeCheckbox checked={nodeModules} required>
                    Install dependencies
                  </VSCodeCheckbox>
                </div>
                <div className="bundlersWrapper" css={bundlers}>
                  <div className="bundlers">
                    <p className="columnTitle">Select bundler</p>
                    <div className="bundlersCards" css={cards}>
                      {state.bundlers.map((bundler) => (
                        <Card
                          type="bundler"
                          key={bundler.title}
                          iconUri={bundler.icon}
                          title={bundler.title}
                          description={bundler.description}
                          handleOnClick={() => actions.updateOptions({ bundler: bundler.title })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="template-specific information" css={infosInputs}>
                  {Object.keys(templateOptions).length > 0 && (
                    <React.Fragment>
                      <p className="columnTitle">Provide Template Options</p>
                      <div className="inputsWrapper">
                        {Object.keys(templateOptions).map((option) => (
                          <div className="extraItem capitalize" key={templateOptions[option].default}>
                            <VSCodeTextField
                              className="extraItemInput"
                              placeholder={templateOptions[option].default}
                              value={options.templateOptionsValues[option]}
                              key={Object.keys(option)[0]}
                              onChange={(ev: any) =>
                                actions.updateOptions({
                                  templateOptionsValues: { [option]: ev.target.value },
                                })
                              }>
                              <p className="extraItemLabel">{option}</p>
                            </VSCodeTextField>
                          </div>
                        ))}
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
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
  const { actions } = useStore();
  const [pageIndex, setPageIndex] = React.useState(0);
  const state = React.useRef<ScaffoldState>({ repoType: '', template: '' });

  const Page = pages[pageIndex];

  return (
    <Page
      state={state.current}
      onNext={() => {
        setPageIndex((p) => p + 1);
        actions.updateTemplateOptions();
      }}
      onPrevious={() => {
        setPageIndex((p) => p - 1);
      }}
    />
  );
};

export default ScaffoldView;
