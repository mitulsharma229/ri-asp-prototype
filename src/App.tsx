import { ThemeProvider, createTheme } from '@fluentui/react';
import { FutureProductsPage } from './pages/FutureProductsPage';

const appTheme = createTheme({
  palette: {
    themePrimary: '#0078d4',
    themeDarkAlt: '#106ebe',
    themeDark: '#005a9e',
    themeDarker: '#004578',
    themeLight: '#c7e0f4',
    themeLighter: '#deecf9',
    themeLighterAlt: '#eff6fc',
  },
});

function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <FutureProductsPage />
    </ThemeProvider>
  );
}

export default App;
