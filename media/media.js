const vscode = acquireVsCodeApi();

const templates = {};

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

// Insert html code under select templates
function insertTemplatesNames(type) {
  const { scheme, authority, path } = templates.selectedItemIcon
  const imgSrc = `${scheme}://${authority}${path}`
  const className = `div.${type}-templates`;
  const node = document.querySelector(className);

  let html = '';
  templates[`${type}`].forEach((template, index) => {
    html += `                
    <div key="template${index}" class="card template" template="${template}">
      <img class="selectedCardTag" src="${imgSrc}" />
      <div class="cardTitle">
        <p class="cardTitleTxt">
        ${template}
        </p>
      </div>
    </div>`;
  });
  node.innerHTML = html;
  handleTemplateClick()
}


// Send message to vscode to load templates names
function loadTemplates(type) {
  switch (type) {
    case 'piral':
      if (templates.piral) {
        insertTemplatesNames(type);
        return;
      }

    case 'pilet':
      if (templates.pilet) {
        insertTemplatesNames(type);
        return;
      }
  }

  vscode.postMessage({
    command: 'getTemplatesNames',
    parameters: type,
  });
}

loadTemplates('piral');

// Handle click on RepoType card
document.querySelectorAll('div.card.project').forEach((box) =>
  box.addEventListener('click', (event) => {
    states.repoType = event.currentTarget.getAttribute('repoType');
    updateSingleSelectGroup('div.card.project', 'repoType', 'selectedCard', states.repoType);
    const piralTemplates = document.querySelector('div.piral-templates');
    const piletTemplates = document.querySelector('div.pilet-templates');

    switch (states.repoType) {
      case 'piral':
        loadTemplates('piral');
        document.querySelectorAll('div.onlyForPilet').forEach((box) => {
          display(box);
          hide(box);
          states.piralPackage = '';
          states.npmRepository = '';
        });
        display(piralTemplates);
        hide(piletTemplates);
        break;
      case 'pilet':
        loadTemplates('pilet');
        document.querySelectorAll('div.onlyForPilet').forEach((box) => display(box));
        display(piletTemplates);
        hide(piralTemplates);
        break;
    }
  }),
);

// Handle click on template card
function handleTemplateClick() {
  document.querySelectorAll('div.card.template').forEach((box) =>
    box.addEventListener('click', (event) => {
      if (states.repoType) {
        const nextButton = document.getElementById('next');
        nextButton.removeAttribute('disabled');
      }

      states.template = event.currentTarget.getAttribute('template');
      updateSingleSelectGroup('div.card.template', 'template', 'selectedCard', states.template);
    }),
  );
}

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
        if (!states.repoType || !states.template) {
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

    case 'sendTemplatesNames':
      templates[message.type] = message.templatesNames;
      templates['selectedItemIcon'] = message.selectedItemIcon;
      insertTemplatesNames(message.type);
  }
});
