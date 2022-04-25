const vscode = acquireVsCodeApi();

const states = {
  repoType: '',
  name: '',
  version: '1.0.0',
  bundler: '',
  targetFolder: '',
  piralPackage: '',
  npmRepository: '',
  template: '',
};

// hide elements
function hide(box) {
  box.classList.add('hide');
}

// display elements
function display(box) {
  box.classList.remove('hide');
}

// Highlight style of cards after selection
function updateSingleSelectGroup(selector, className, selectedClassName, state) {
  Array.from(document.querySelectorAll(selector)).forEach((e) => {
    e.classList.remove(selectedClassName);

    if (e.getAttribute(className) === state) {
      e.classList.add(selectedClassName);
    }
  });
}

// Validation errors will be hidden
function resetValidationErrors() {
  document.querySelectorAll('span.errorMessage').forEach((box) => {
    hide(box);
  });
}

// Validation errors will be shown
function showValidationErrors(errors) {
  resetValidationErrors();
  errors.forEach((item) => {
    const node = document.querySelector(`span.error${item}`);

    if (node !== undefined) {
      display(node);
    }
  });
}

// Display the selected local path in the input
function displayLocalPath(localPath) {
  const input = document.getElementById('local-path-input');
  input.value = localPath;
  states.targetFolder = localPath;
}

// Handle click on RepoType card
document.querySelectorAll('div.card.project').forEach((box) =>
  box.addEventListener('click', (event) => {
    states.repoType = event.currentTarget.getAttribute('repoType');
    updateSingleSelectGroup('div.card.project', 'repoType', 'selectedCard', states.repoType);
    const piralTemplates = document.querySelector('div.piral-templates');
    const piletTemplates = document.querySelector('div.pilet-templates');
    const nextButton = document.getElementById('next');

    switch (states.repoType) {
      case 'piral':
        nextButton.removeAttribute('disabled');
        document.querySelectorAll('div.onlyForPilet').forEach((box) => {
          hide(box);
          states.piralPackage = '';
          states.npmRepository = '';
        });
        display(piralTemplates);
        hide(piletTemplates);
        break;
      case 'pilet':
        nextButton.removeAttribute('disabled');
        document.querySelectorAll('div.onlyForPilet').forEach((box) => display(box));
        display(piletTemplates);
        hide(piralTemplates);
        break;
    }
  }),
);

// Handle click on template card
document.querySelectorAll('div.card.template').forEach((box) =>
  box.addEventListener('click', (event) => {
    states.template = event.currentTarget.getAttribute('template');
    updateSingleSelectGroup('div.card.template', 'template', 'selectedCard', states.template);
  }),
);

// Handle click on Bundler card
document.querySelectorAll('div.card.bundler').forEach((box) =>
  box.addEventListener('click', (event) => {
    states.bundler = event.currentTarget.getAttribute('bundler');
    updateSingleSelectGroup('div.card.bundler', 'bundler', 'selectedCard', states.bundler);
  }),
);

// Handle key click on input / textarea fields to store states
document.querySelectorAll('.extraItemInput').forEach((box) =>
  box.addEventListener('keyup', (event) => {
    const stateName = event.currentTarget.getAttribute('stateName');
    states[stateName] = event.currentTarget.value;
  }),
);

// Handle click on file button
document.getElementById('local-path').addEventListener('click', async () => {
  vscode.postMessage({
    command: 'getLocalPath',
    parameters: states,
  });
});

// Handle click on Next/ Previous button
document.querySelectorAll('.navigation-btn').forEach((btn) =>
  btn.addEventListener('click', (event) => {
    const direction = event.currentTarget.getAttribute('direction');
    const firstContainer = document.querySelector('.first-container');
    const secondContainer = document.querySelector('.second-container');

    switch (direction) {
      case 'next':
        const node = document.querySelector(`span.errorRepoType`);
        if (states.repoType === '') {
          display(node);
          return;
        } else {
          hide(node);
        }

        hide(firstContainer);
        display(secondContainer);
        break;
      case 'previous':
        hide(secondContainer);
        display(firstContainer);
        break;
    }
  }),
);

// Handle click on create button
document.getElementById('create-btn').addEventListener('click', () => {
  vscode.postMessage({
    command: 'createPiralPilet',
    parameters: states,
  });
});

// Handle messages from extension
window.addEventListener('message', (event) => {
  const message = event.data;

  switch (message.command) {
    case 'error':
      const errors = message.data;
      showValidationErrors(errors);
      break;
    case 'sendLocalPath':
      const localPath = message.data[0].path;
      displayLocalPath(localPath);
      break;
  }
});
