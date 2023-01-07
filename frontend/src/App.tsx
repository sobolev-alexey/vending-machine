import React, { Suspense } from 'react';
import { SWRConfig } from 'swr';
import WebFontLoader from 'webfontloader';
import { ErrorBoundary } from 'react-error-boundary';
import GlobalState from './context/globalState';
import { fetcher } from './utils/fetcher';
import { Loading, ErrorFallback } from './components';
import Router from './Router';

// import 'antd/dist/reset.css';
import 'antd/dist/antd.min.css';
import './styles/index.scss';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,600,700,800,900', 'Poppins:300,400,500,600']
  }
});

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <React.StrictMode>
          <SWRConfig value={{ fetcher, suspense: true, refreshInterval: 1000 * 60 * 60 }}>
            <GlobalState>
              <Router />
            </GlobalState>
          </SWRConfig>
        </React.StrictMode>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;