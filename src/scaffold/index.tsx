import './common';
import App from './App';
import * as React from 'react';
import { render } from 'react-dom';

// const templates = {};

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

// // hide elements
// function hide(box: Element) {
//   box.classList.add('hide');
// }

// // display elements
// function display(box: Element) {
//   box.classList.remove('hide');
// }

// // Highlight style of cards after selection
// function updateSingleSelectGroup(selector, className, selectedClassName, state) {
//   Array.from(document.querySelectorAll(selector)).forEach((e) => {
//     e.classList.remove(selectedClassName);

//     if (e.getAttribute(className) === state) {
//       e.classList.add(selectedClassName);
//     }
//   });
// }

// // Validation errors will be hidden
// function resetValidationErrors() {
//   document.querySelectorAll('span.errorMessage').forEach((box) => {
//     hide(box);
//   });
// }

// // Validation errors will be shown
// function showValidationErrors(errors) {
//   resetValidationErrors();
//   errors.forEach((item) => {
//     const node = document.querySelector(`span.error${item}`);

//     if (node !== undefined) {
//       display(node);
//     }
//   });
// }

// // Display the selected local path in the input
// function displayLocalPath(localPath) {
//   const input = document.getElementById('local-path-input');
//   input.value = localPath;
//   states.targetFolder = localPath;
// }

// // Handle click on template card
// function handleTemplateClick() {
//   document.querySelectorAll('div.card.template').forEach((box) =>
//     box.addEventListener('click', (event) => {
//       if (states.repoType) {
//         const nextButton = document.getElementById('next');
//         nextButton.removeAttribute('disabled');
//       }

//       states.template = event.currentTarget.getAttribute('template');
//       updateSingleSelectGroup('div.card.template', 'template', 'selectedCard', states.template);
//     }),
//   );
// }

// // Handle click on Bundler card
// document.querySelectorAll('div.card.bundler').forEach((box) =>
//   box.addEventListener('click', (event) => {
//     states.bundler = event.currentTarget.getAttribute('bundler');
//     updateSingleSelectGroup('div.card.bundler', 'bundler', 'selectedCard', states.bundler);
//   }),
// );

// // Handle key click on input / textarea fields to store states
// document.querySelectorAll('.extraItemInput').forEach((box) =>
//   box.addEventListener('keyup', (event) => {
//     const stateName = event.currentTarget.getAttribute('stateName');
//     states[stateName] = event.currentTarget.value;
//   }),
// );

// // Handle click on file button
// document.getElementById('local-path').addEventListener('click', async () => {
//   vscode.postMessage({
//     command: 'getLocalPath',
//     parameters: states,
//   });
// });

// // Handle click on Next/ Previous button
// document.querySelectorAll('.navigation-btn').forEach((btn) =>
//   btn.addEventListener('click', (event) => {
//     const direction = event.currentTarget.getAttribute('direction');
//     const firstContainer = document.querySelector('.first-container');
//     const secondContainer = document.querySelector('.second-container');
//     const nextButton = document.getElementById('next');
//     const previousButton = document.getElementById(`previous`);
//     const createButton = document.getElementById(`create-btn`);

//     switch (direction) {
//       case 'next':
//         const node = document.querySelector(`span.errorRepoType`);
//         if (!states.repoType || !states.template) {
//           display(node);
//           return;
//         } else {
//           hide(node);
//         }

//         hide(nextButton)
//         display(previousButton)
//         display(createButton)
//         hide(firstContainer);
//         display(secondContainer);
//         break;
//       case 'previous':
//         hide(secondContainer);
//         hide(previousButton);
//         hide(createButton);
//         display(firstContainer);
//         display(nextButton);
//         break;
//     }
//   }),
// );

// // Handle click on create button
// document.getElementById('create-btn').addEventListener('click', () => {
//   vscode.postMessage({
//     command: 'createPiralPilet',
//     parameters: states,
//   });
// });

render(<App />, document.querySelector('#root'));
