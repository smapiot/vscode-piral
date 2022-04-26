import * as React from 'react';
import { Global } from '@emotion/react';
import ScaffoldView from './ScaffoldView';
import { globalStyle } from './styles';
import { useStore } from './store';

const App: React.FC = () => {
  const store = useStore();

  React.useEffect(() => {
    store.actions.initialize();
  }, []);

  return (
    <>
      <Global styles={globalStyle} />

      <div className="page">
        <div className="header">
          <h1 className="title">Create New Project</h1>
          <p className="subTitle">Create a new Piral instance or a new pilet for an existing Piral instance.</p>
        </div>

        <ScaffoldView />
      </div>
    </>
  );
};

export default App;
