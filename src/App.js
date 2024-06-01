import React from 'react';
import Dashboard from './components/Dashboard';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #121212;
    color: white;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Dashboard />
    </>
  );
};

export default App;
