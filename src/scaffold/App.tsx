/** @jsx jsx */
import * as React from 'react';
import { Global, jsx } from '@emotion/react';
import ScaffoldView from './ScaffoldView';
import { globalStyle, header } from './styles';
import { useStore } from './store';

const App: React.FC = () => {
  const store = useStore();

  React.useEffect(() => {
    store.actions.initialize();
  }, []);

  return (
    <React.Fragment>
      <Global styles={globalStyle} />

      <div className="page">
        <div css={header}>
          <h1 className="title">Create New Project</h1>
          <p className="subTitle">Create a new Piral instance or a new pilet for an existing Piral instance.</p>
        </div>

        <ScaffoldView />
      </div>
    </React.Fragment>
  );
};

export default App;
