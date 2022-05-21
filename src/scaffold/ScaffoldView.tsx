import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { jsx } from '@emotion/react';
import { VSCodeButton, VSCodeTextField, VSCodeCheckbox, VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { useStore } from './store';
import { Card } from './components/Card';
import { TemplateCard } from './components/TemplateCard';
import { CardSelector } from './components/CardSelector';
import { cards, container, infosInputs, spinner, templates } from './styles';
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

const FirstPage: FC<PageProps> = ({ onNext }) => {
  const { state, actions } = useStore();
  const options = state.options;
  const { repoType } = options;
  const availableTemplates = repoType ? state.templates[repoType] : undefined;
  const canGoNext = options.template !== '';
  const loading = availableTemplates === undefined;

  useEffect(() => {
    if (repoType) {
      actions.loadTemplates(repoType);
    }
  }, [repoType]);

  return (
    <Fragment>
      <div className="containerWrapper" css={container}>
        <div className="container">
          <div className="containerInfos">
            <div className="container-type scroll">
              <div className="containerColumn" css={cards}>
                <p className="columnTitle">Select Type</p>
                {state.repoTypes.map((repoType) => (
                  <Card
                    type="repoType"
                    id={repoType.type}
                    key={repoType.type}
                    iconUri={repoType.icon}
                    title={repoType.title}
                    description={repoType.description}
                    onClick={() => actions.updateOptions({ repoType: repoType.type, template: '' })}
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
                  <Fragment>
                    <p className="columnTitle">Select templates</p>
                    <div className="templatesNames" css={cards}>
                      {availableTemplates.map((template) => (
                        <TemplateCard
                          key={template.packageName}
                          id={template.packageName}
                          shortName={template.name}
                          title={template.packageName}
                          description={template.description}
                          author={template.author}
                          onClick={() => actions.updateOptions({ template: template.packageName })}
                        />
                      ))}
                    </div>
                  </Fragment>
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
    </Fragment>
  );
};

const SecondPage: React.FC<PageProps> = ({ onPrevious, onNext }) => {
  const { state, actions } = useStore();
  const { templateOptions, isLoading } = state;
  const options = state.options;

  const { repoType, template, name, targetFolder, version, piralPackage, npmRegistry, nodeModules } = options;
  const valid = useMemo(() => /(\/[A-Za-z_\/-\s0-9\.]+)+$/.exec(targetFolder), [targetFolder]);
  const canScaffold = valid && repoType !== '' && template !== '' && name !== '';

  const openLocalPathModal = () => actions.selectLocalPath();

  useEffect(() => {
    actions.updateOptions({ targetFolder: state.localPath });
  }, [state.localPath]);

  return (
    <Fragment>
      <div className="containerWrapper" css={container}>
        <div className="container">
          {isLoading ? (
            <div className="spinnerWrapper" css={spinner}>
              <VSCodeProgressRing />
            </div>
          ) : (
            <Fragment>
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
                          Local Path{' '}
                          <span className={`errorMessage ${valid || !targetFolder ? 'hide' : ''}`}>[invalid path]</span>
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
                <div className="extraItem" onClick={() => actions.updateOptions({ nodeModules: !nodeModules })}>
                  <VSCodeCheckbox checked={nodeModules} required>
                    Install dependencies
                  </VSCodeCheckbox>
                </div>
                <CardSelector title="Select bundler">
                  {state.bundlers.map((bundler) => (
                    <Card
                      type="bundler"
                      key={bundler.type}
                      iconUri={bundler.icon}
                      id={bundler.type}
                      title={bundler.title}
                      description={bundler.description}
                      onClick={() => actions.updateOptions({ bundler: bundler.type })}
                    />
                  ))}
                </CardSelector>
                <CardSelector title="Select client">
                  {state.clients.map((client) => (
                    <Card
                      type="client"
                      key={client.type}
                      id={client.type}
                      iconUri={client.icon}
                      title={client.title}
                      description={client.description}
                      onClick={() => actions.updateOptions({ client: client.type })}
                    />
                  ))}
                </CardSelector>
                <CardSelector title="Select language">
                  {state.languages.map((lang) => (
                    <Card
                      type="language"
                      key={lang.type}
                      id={lang.type}
                      iconUri={lang.icon}
                      title={lang.title}
                      description={lang.description}
                      onClick={() => actions.updateOptions({ language: lang.type })}
                    />
                  ))}
                </CardSelector>
                <div className="information" css={infosInputs}>
                  {Object.keys(templateOptions).length > 0 && (
                    <Fragment>
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
                    </Fragment>
                  )}
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
      <div className="btnContainer">
        <VSCodeButton className="navigation-btn" href="#" onClick={onPrevious}>
          Previous
        </VSCodeButton>
        <VSCodeButton title="Start Scaffolding" href="#" onClick={onNext} disabled={!canScaffold}>
          Scaffold Project
        </VSCodeButton>
      </div>
    </Fragment>
  );
};

const FinalPage: React.FC<PageProps> = () => {
  const { actions } = useStore();

  useEffect(() => {
    actions.scaffold();
    const tid = setTimeout(() => actions.close(), 4000);
    return () => clearTimeout(tid);
  }, []);

  return (
    <div className="fullPage">
      <div className="success">
        <div className="animation_container">
          <div className="tick" />
        </div>
      </div>
      <h1>Scaffolding started!</h1>
      <p>You can observe the progress in the opened terminal.</p>
      <p>This window is automatically closed.</p>
    </div>);
};

const pages = [FirstPage, SecondPage, FinalPage];

export const ScaffoldView: FC = () => {
  const { actions } = useStore();
  const [pageIndex, setPageIndex] = useState(0);
  const state = useRef<ScaffoldState>({ repoType: '', template: '' });

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
