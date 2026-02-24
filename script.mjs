import { getUserIds } from "./common.mjs";

const state = {
  selectedUser: null,
}

function populateUserSelector() {
  const userSelect = document.getElementById("user-select");
  const users = getUserIds();
  users.forEach(user => {
    const option = document.createElement("option");
    option.value = user;
    option.textContent = `User ${user}`;
    userSelect.appendChild(option);
  });
}

function setupEventListeners() {
  const userSelect = document.getElementById("user-select");
  userSelect.addEventListener("change", handleUserChange);
}

function handleUserChange(event) {
  state.selectedUser = event.target.value;
  renderApp();
}

function renderApp() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "";

  if (!state.selectedUser) {
    mainContent.textContent = "Please select a user to view their spaced repetition schedule.";
  } else {
    mainContent.textContent = `Displaying spaced repetition schedule for user: ${state.selectedUser}`;
    addTopicsForm();
    // displayTopicsForUser(state.selectedUser);
  }
} 


function addTopicsForm() {
	const mainContent = document.getElementById('main-content');
	const form = document.createElement('form');
	form.id = 'add-topic-form';

	const input = document.createElement('input');
	input.type = 'text';
	input.placeholder = 'Enter topic name';
	input.required = true;

	const dateInput = document.createElement('input');
	dateInput.type = 'date';
	dateInput.required = true;
	dateInput.value = new Date().toISOString().split('T')[0];

	const submitButton = document.createElement('button');
	submitButton.type = 'submit';
	submitButton.textContent = 'Add Topic';

	form.appendChild(input);
	form.appendChild(dateInput);
	form.appendChild(submitButton);

	form.addEventListener('submit', handleAddTopic);

	mainContent.appendChild(form);
}

function handleAddTopic(event) {
	event.preventDefault();
	const topicName = event.target[0].value;
	const reviewStartDate = event.target[1].value;

	console.log(topicName, reviewStartDate) 
   //logic to get dates and store review

  //reset form after submission
	event.target.reset();
}

window.onload = function () {
  populateUserSelector();
  setupEventListeners();
  renderApp();
};
