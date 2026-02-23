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
  const app = document.getElementById("app");
  app.innerHTML = ""; // Clear previous content

  if (!state.selectedUser) {
    app.textContent = "Please select a user to view their spaced repetition schedule.";
    return;
  } else {
    app.textContent = `Displaying spaced repetition schedule for user: ${state.selectedUser}`;
    // Here you would add code to fetch and display the user's schedule
  }
} 

window.onload = function () {
  populateUserSelector();
  setupEventListeners();
  renderApp();
};
