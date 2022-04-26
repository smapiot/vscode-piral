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

interface PageProps {
  onNext(newState: ScaffoldState): void;
  onPrevious(): void;
  state: ScaffoldState;
}

function getRef(uri: Uri) {
  const { scheme, authority, path } = uri;
  return `${scheme}://${authority}${path}`;
}

interface LocalState {
  repoType: string | undefined;
  template: string | undefined;
}

const defaultLocalState = { repoType: undefined, template: undefined };

const FirstPage: React.FC<PageProps> = ({ onNext }) => {
  const { state, actions } = useStore();
  const [localState, setLocalState] = React.useState<LocalState>(defaultLocalState);
  const availableTemplates = localState.repoType ? state.templates[localState.repoType] : undefined;
  const canGoNext = localState.template !== undefined;
  const loading = availableTemplates === undefined;
  const next = () => {
    if (localState.repoType && localState.template) {
      onNext({
        repoType: localState.repoType,
        template: localState.template,
      });
    }
  };

  React.useEffect(() => {
    if (localState.repoType) {
      actions.loadTemplates(localState.repoType);
    }
  }, [localState.repoType]);

  return (
    <>
      <div className="container">
        <div className="first-container">
          <div className="containerInfos">
            <div className="container-type">
              <div className="cards containerColumn">
                <p className="columnTitle">
                  Select Type <span className="errorRepoType errorMessage hide">[required]</span>
                </p>
                {state.repoTypes.map((repoType) => (
                  <div
                    key={repoType.type}
                    onClick={() => setLocalState({ repoType: repoType.type, template: undefined })}
                    className={localState.repoType === repoType.type ? 'card project selectedCard' : 'card project'}>
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
              {localState.repoType === undefined ? undefined : loading ? (
                <div className="spinner-container">
                  <div className="spinner" />
                </div>
              ) : (
                <>
                  <p className="columnTitle">
                    Select templates <span className="errorTemplate errorMessage hide">[required]</span>
                  </p>
                  <div className="templates-names">
                    {availableTemplates.map((template) => (
                      <div
                        key={template.packageName}
                        onClick={() => setLocalState((state) => ({ ...state, template: template.packageName }))}
                        className={
                          localState.template === template.packageName ? 'card template selectedCard' : 'card template'
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
        <VSCodeButton
          className="navigation-btn"
          id="next"
          direction="next"
          href="#"
          disabled={!canGoNext}
          onClick={next}>
          Next
        </VSCodeButton>
      </div>
    </>
  );
};

const SecondPage: React.FC<PageProps> = ({ onPrevious }) => {
  return (
    <>
      <div className="container">
        <div className="second-container">
          <div className="containerInfos">
            <div className="informations">
              <p className="columnTitle">Provide Information</p>
              <div className="extraItem">
                <p className="extraItemLabel">
                  Name <span className="errorName errorMessage hide">[required]</span>
                </p>
                <VSCodeTextField className="extraItemInput" stateName="name" />
              </div>
              <div className="extraItem">
                <VSCodeTextField id="local-path-input" className="extraItemInput" stateName="targetFolder">
                  <p className="extraItemLabel">
                    Local Path <span className="errorLocalPath errorMessage hide">[required]</span>
                  </p>
                  <span slot="end" id="local-path">
                    <img className="foldersImg" src={folderImage} />
                  </span>
                </VSCodeTextField>
              </div>

              <div className="extraItem">
                <VSCodeTextField
                  id="local-path-input"
                  className="extraItemInput"
                  stateName="version"
                  placeholder="1.0.0">
                  <p className="extraItemLabel">Version</p>
                </VSCodeTextField>
              </div>
              <div className="extraItem onlyForPilet hide">
                <VSCodeTextField
                  id="local-path-input"
                  className="extraItemInput"
                  stateName="piralPackage"
                  placeholder="sample-piral">
                  <p className="extraItemLabel">Piral Package</p>
                </VSCodeTextField>
              </div>
              <div className="extraItem onlyForPilet hide">
                <VSCodeTextField
                  id="local-path-input"
                  className="extraItemInput"
                  stateName="npmRegistry"
                  placeholder="https://registry.npmjs.org/">
                  <p className="extraItemLabel">NPM Registry</p>
                </VSCodeTextField>
              </div>
            </div>
            <div className="sideBorder"></div>
            <div className="bundlers">
              <p className="columnTitle">
                Select bundler <span className="errorBundler errorMessage hide">[required]</span>
              </p>
              <div>
                {/* <% bundlers.forEach((bundler, index)=> { %>
                  <div key="bundler_<%= index %>" className="card bundler" bundler="<%= bundler.type %>">
                    <img className="selectedCardTag" src="<%= images.selectedItemIcon %>" />
                    <div className="cardTitle">
                      <img className="cardTitleIcon" src="<%= bundler.icon %>" />
                      <p className="cardTitleTxt">
                        <%= bundler.title %>
                      </p>
                    </div>
                    <div className="cardDescription">
                      <%= bundler.description %>
                    </div>
                  </div>
                <% }); %> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="btnContainer">
        <VSCodeButton className="navigation-btn" id="previous" direction="previous" href="#" onClick={onPrevious}>
          Previous
        </VSCodeButton>
        <VSCodeButton id="create-btn" title="Start Scaffolding" href="#">
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
