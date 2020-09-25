const vscode = acquireVsCodeApi();

let states = {
    repoType: '',
    name: '',
    version: '1.0.0',
    description: '',
    bundler: '',
    targetFolder: '',
    piralPackage: '',
    npmRepository: ''
};

// Highlight style of cards after selection
function updateSingleSelectGroup(selector, className, selectedClassName, state) {
    Array.from(document.querySelectorAll(selector)).forEach(e => {
        e.classList.remove(selectedClassName);
        if(e.getAttribute(className) === state) {
            e.classList.add(selectedClassName);
        }
    });
}

// Validation errors will be hidden
function resetValidationErrors() {
    document.querySelectorAll("span.errorMessage").forEach(box => {
        box.classList.remove("hide");
        box.classList.add("hide");
    });
}

// Validation errors will be shown
function showValidationErrors(errors) {
    resetValidationErrors();
    errors.forEach((item, index) => {
        let node = document.querySelector(`span.error${item}`);
        if(node !== undefined) {
            node.classList.remove("hide");
        }
    });
}

// Handle click on RepoType card
document.querySelectorAll("div.card").forEach(box => 
    box.addEventListener("click", (event) => {
        states.repoType = event.currentTarget.getAttribute('repoType');
        updateSingleSelectGroup('div.card', 'repoType', 'selectedCard', states.repoType)

        if(states.repoType == 'piral') {
            document.querySelectorAll("div.onlyForPilet").forEach(box => {
                box.classList.remove("hide");
                box.classList.add("hide");
                states.piralPackage = '';
                states.npmRepository = '';
            });
        }

        if(states.repoType == 'pilet') {
            document.querySelectorAll("div.onlyForPilet").forEach(box => {
                box.classList.remove("hide");
            });
        }        
}));

// Handle click on Bundler card
document.querySelectorAll("div.bundlerItem").forEach(box => 
    box.addEventListener("click", (event) => {
        states.bundler = event.currentTarget.getAttribute('bundler');
        updateSingleSelectGroup('div.bundlerItem', 'bundler', 'selectedCard', states.bundler)
}));

// Handle key click on input / textarea fields to store states
document.querySelectorAll(".extraItemInput").forEach(box => 
    box.addEventListener("keyup", (event) => {
        let stateName = event.currentTarget.getAttribute('stateName');
        states[stateName] = event.currentTarget.value;
}));

// Handle click on create button
document.querySelector("button.create").addEventListener("click", (event) => {
        vscode.postMessage({
            command: 'createPiralPilet',
            parameters: states
        });
});

// Handle messages from extension
window.addEventListener('message', event => {
    const message = event.data;
    switch (message.command) {
       case 'error':
        let errors = message.data;
        showValidationErrors(errors);
    }
});
