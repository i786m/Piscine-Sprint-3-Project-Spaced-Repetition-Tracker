import {
	getUserIds,
	getReviewDates,
	getSortedReviewTopicsForUser,
} from './common.mjs';
import { getData, addData, clearData } from './storage.mjs';

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
}

function handleUserChange(event) {
	state.selectedUser = event.target.value;
	renderSchedule();
}

function renderSchedule() {
	const mainContent = document.getElementById('main-content');
	mainContent.innerHTML = '';
	if (!state.selectedUser) {
		mainContent.textContent =
			'Please select a user to view their spaced repetition schedule.';
	} else {
		mainContent.textContent = `Displaying spaced repetition schedule for user: ${state.selectedUser}`;
		const reviewContainer = document.createElement('div');
		reviewContainer.id = 'review-container';
		mainContent.appendChild(reviewContainer);
		const topics = getData(state.selectedUser);
		if (topics && topics.length > 0) {
			displayTopicsForUser(state.selectedUser);
		} else {
			reviewContainer.textContent =
				' No topics found. Please add a topic to get started.';
		}
		addTopicsForm();
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
	const reviewTopics = getSortedReviewTopicsForUser(userId);
  const todayUTC = new Date(
		Date.UTC(
			new Date().getUTCFullYear(),
			new Date().getUTCMonth(),
			new Date().getUTCDate(),
		),
  )
		.toISOString()
		.split('T')[0];
	const topicsToDisplay = reviewTopics.filter((topic) => {
		return topic.reviewDate >= todayUTC;
	});
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
	const reviewDates = getReviewDates(reviewStartDate);
	const newTopics = reviewDates.map((date) => ({
		topic: topicName,
		reviewDate: date,
	}));
	addData(state.selectedUser, newTopics);
	renderSchedule();
	event.target.reset();
}

window.onload = function () {
	populateUserSelector();
	setupEventListeners();
};
