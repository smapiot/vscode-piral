import './common';
import App from './App';
import * as React from 'react';
import { render } from 'react-dom';

// const states = {
//   repoType: '',
//   name: '',
//   version: '1.0.0',
//   bundler: '',
//   targetFolder: '',
//   piralPackage: '',
//   npmRepository: '',
//   template: '',
// };

// // Display the selected local path in the input
// function displayLocalPath(localPath) {
//   const input = document.getElementById('local-path-input');
//   input.value = localPath;
//   states.targetFolder = localPath;
// }

render(<App />, document.querySelector('#root'));
