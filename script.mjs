import {
	getUserIds,
	getReviewDates,
	getTopicsReadyToDisplayForUser,
} from './common.mjs';
import { addData } from './storage.mjs';

const state = {
	selectedUser: null,
};

function populateUserSelector() {
	const userSelect = document.getElementById('user-select');
	const users = getUserIds();
	users.forEach((user) => {
		const option = document.createElement('option');
		option.value = user;
		option.textContent = `User ${user}`;
		userSelect.appendChild(option);
	});
}

function setupEventListeners() {
	const userSelect = document.getElementById('user-select');
	userSelect.addEventListener('change', handleUserChange);
	const formContainer = document.getElementById('form-container');
	formContainer.addEventListener('submit', handleAddTopic);
}

function handleUserChange(event) {
	state.selectedUser = event.target.value;
	renderSchedule();
}

function renderSchedule() {
	const scheduleContainer = document.getElementById('schedule-container');
	scheduleContainer.innerHTML = '';
	const formContainer = document.getElementById('form-container');
	formContainer.innerHTML = '';
	renderTopicsForm();
	if (!state.selectedUser) {
		scheduleContainer.textContent =
			'Please select a user to view their spaced repetition schedule.';
	} else {
		scheduleContainer.textContent = `Displaying spaced repetition schedule for User ${state.selectedUser}`;
		const reviewContainer = document.createElement('div');
		reviewContainer.id = 'review-container';
		scheduleContainer.appendChild(reviewContainer);
		const topics = getTopicsReadyToDisplayForUser(state.selectedUser);
		if (topics && topics.length > 0) {
			displayTopicsForUser(state.selectedUser);
		} else {
			reviewContainer.textContent =
				' No topics found. Please add a topic to get started.';
		}
	}
}

function displayTopicsForUser(userId) {
	const reviewContainer = document.getElementById('review-container');
	const reviewTable = document.createElement('table');
	const headerRow = document.createElement('tr');
	const topicHeader = document.createElement('th');
	topicHeader.textContent = 'Topic';
	const dateHeader = document.createElement('th');
	dateHeader.textContent = 'Review Date';
	headerRow.appendChild(topicHeader);
	headerRow.appendChild(dateHeader);
	reviewTable.appendChild(headerRow);
	const topicsToDisplay = getTopicsReadyToDisplayForUser(userId);
	topicsToDisplay.forEach(({ topic, reviewDate }) => {
		const row = document.createElement('tr');
		const topicCell = document.createElement('td');
		topicCell.textContent = topic;
		const dateCell = document.createElement('td');
		dateCell.textContent = reviewDate;
		row.appendChild(topicCell);
		row.appendChild(dateCell);
		reviewTable.appendChild(row);
	});
	reviewContainer.appendChild(reviewTable);
}

function renderTopicsForm() {
	const formContainer = document.getElementById('form-container');
	const form = document.createElement('form');
	form.id = 'add-topic-form';
	const topicGroup = document.createElement('div');
	topicGroup.className = 'form-group';
	const topicLabel = document.createElement('label');
	topicLabel.htmlFor = 'topic-input';
	topicLabel.textContent = 'Topic name:';
	const input = document.createElement('input');
	input.type = 'text';
	input.id = 'topic-input';
	input.placeholder = 'Enter topic name';
	input.required = true;
	input.autocomplete = 'off';
	topicGroup.appendChild(topicLabel);
	topicGroup.appendChild(input);
	const dateGroup = document.createElement('div');
	dateGroup.className = 'form-group';
	const dateLabel = document.createElement('label');
	dateLabel.htmlFor = 'date-input';
	dateLabel.textContent = 'Review start date:';
	const dateInput = document.createElement('input');
	dateInput.type = 'date';
	dateInput.id = 'date-input';
	dateInput.required = true;
	dateInput.value = new Date().toISOString().split('T')[0];
	dateGroup.appendChild(dateLabel);
	dateGroup.appendChild(dateInput);
	const buttonGroup = document.createElement('div');
	buttonGroup.className = 'form-group';
	const submitButton = document.createElement('button');
	submitButton.type = 'submit';
	submitButton.textContent = 'Add Topic And Review Dates';
	buttonGroup.appendChild(submitButton);
	form.appendChild(topicGroup);
	form.appendChild(dateGroup);
	form.appendChild(buttonGroup);
	formContainer.appendChild(form);
}

function handleAddTopic(event) {
	event.preventDefault();
	const userId = state.selectedUser;
	if (!userId) {
		showNotification('Please select a user before adding a topic.', true);
		return;
	}
	const topicName = event.target[0].value.trim();
	if (!topicName) {
		showNotification('Please enter a topic name.', true);
		return;
	}
	const reviewStartDate = event.target[1].value;
	const reviewDates = getReviewDates(reviewStartDate);
	const newTopics = reviewDates.map((date) => ({
		topic: topicName,
		reviewDate: date,
	}));
	addData(state.selectedUser, newTopics);
  showNotification(`Topic "${topicName}" added successfully with review dates.`);
	renderSchedule();
	event.target.reset();
	event.target['date-input'].value = new Date().toISOString().split('T')[0];
}

function showNotification(message, error = false, duration = 3000) {
	const notificationContainer = document.getElementById(
		'notification-container',
	);
	notificationContainer.textContent = message;
	notificationContainer.style.display = 'block';
	notificationContainer.style.backgroundColor = error ? '#b80000' : '#008000';
	notificationContainer.style.opacity = '1';
	setTimeout(() => {
		notificationContainer.style.opacity = '0';
		setTimeout(() => {
			notificationContainer.style.display = 'none';
		}, 300);
	}, duration);
}

function setup() {
	populateUserSelector();
	setupEventListeners();
	renderTopicsForm();
	renderSchedule();
}

window.onload = setup;
