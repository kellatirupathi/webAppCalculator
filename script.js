let loggedIn = false;
let isAdmin = false;
let calculationHistory = [];

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Simulated login check
  if (username === 'user' && password === 'password') {
    loggedIn = true;
    showCalculator();
  } else if (username === 'admin' && password === 'adminpassword') {
    isAdmin = true;
    showCalculator();
    showAdminPanel();
  } else {
    alert('Invalid username or password');
  }
}

function showCalculator() {
  document.getElementById('login').classList.add('hidden');
  document.getElementById('calculator').classList.remove('hidden');
}

function showAdminPanel() {
  const adminPanel = document.createElement('div');
  adminPanel.id = 'admin';

  const disableLabel = document.createElement('label');
  disableLabel.innerHTML = 'Disable User:';

  const disableSelect = document.createElement('select');
  disableSelect.id = 'disableSelect';

  const disableButton = document.createElement('button');
  disableButton.innerHTML = 'Disable';
  disableButton.onclick = disableUser;

  const userOption = document.createElement('option');
  userOption.value = 'user';
  userOption.innerHTML = 'User';

  disableSelect.appendChild(userOption);
  disableLabel.appendChild(disableSelect);
  adminPanel.appendChild(disableLabel);
  adminPanel.appendChild(disableButton);

  document.body.appendChild(adminPanel);
}

function disableUser() {
  const selectedUser = document.getElementById('disableSelect').value;
  // Perform actions to disable the selected user
  alert('User ' + selectedUser + ' disabled');
}

function appendNumber(number) {
  document.getElementById('result').value += number;
}

function appendOperator(operator) {
  document.getElementById('result').value += operator;
}

function calculate() {
  const expression = document.getElementById('result').value;
  const result = eval(expression);
  document.getElementById('result').value = result;
  if (document.getElementById('saveHistory').checked) {
    calculationHistory.push(expression + ' = ' + result);
  }
}

function clearResult() {
  document.getElementById('result').value = '';
}

function saveCalculation() {
  if (loggedIn) {
    const saveHistory = document.getElementById('saveHistory').checked;
    if (saveHistory) {
      // Save calculation history
      alert('Calculation history saved');
    } else {
      alert('Calculation not saved');
    }
  } else {
    alert('Please log in first');
  }
}

// javascipt functionality
const buttons = document.querySelectorAll('.buttons button')
const inputEl = document.querySelector('input')
const output = document.querySelector('#output')
const historyContainer = document.querySelector('.historyContainer')

const STORAGE_NAME = 'historyStorage';

if (localStorage.getItem(STORAGE_NAME) == null) {
    localStorage.setItem(STORAGE_NAME, JSON.stringify([]))
}

refreshHistory()

for (let button of buttons) {
    const symbol = button.innerHTML

    button.addEventListener('pointerdown', () => {

        if (symbol == '=') {

            const historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME))
            if (!historyElements.includes(inputEl.value)) {
                historyElements.push(inputEl.value)
            }
            localStorage.setItem(STORAGE_NAME, JSON.stringify(historyElements))
            

            inputEl.value = output.value
            refreshHistory()
        }
        else if (symbol == 'DEL') {
            inputEl.value = inputEl.value.slice(0, inputEl.value.length - 1)
        } else if (symbol == 'AC') {
            inputEl.value = ''
        } else {
            inputEl.value += symbol;
        }


        registrateChange()
    })
}

inputEl.addEventListener('input', registrateChange)


function registrateChange() {
    let newValue = eval(inputEl.value) || ''

    output.value = newValue
}

function refreshHistory() {
    historyContainer.innerHTML = ''

    let historyElements = JSON.parse(localStorage.getItem(STORAGE_NAME))

    for (let i = historyElements.length - 1; i >= 0; i--) {

        const div = document.createElement('div')
        div.className = 'historyItem'

        let evaluated = ''

        try {
            evaluated = eval(historyElements[i])
            
        } catch (error) {
            evaluated = 'INVALID RESULT'
        }

        div.innerHTML = `
            <div>${truncate(historyElements[i], 14)}</div>
            <div>${truncate(evaluated, 14)}</div>
        `
        
        historyContainer.appendChild(div)

        div.addEventListener('pointerdown', () => {
            inputEl.value = historyElements[i];
            registrateChange()
        })

    }
}

function truncate(string, max) {
    string = String(string)
    if (string.length > max) {
        return string.substring(0, max - 3) + '...'
    } else {
        return string
    }
}
