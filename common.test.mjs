//mock localStorage for testing
global.localStorage = {
	store: {},
	getItem(key) {
		return this.store[key] || null;
	},
	setItem(key, value) {
		this.store[key] = value.toString();
	},
	clear() {
		this.store = {};
	},
};

import {
	getUserIds,
	getReviewDates,
	getSortedReviewTopicsForUser,
	getTopicsReadyToDisplayForUser,
} from './common.mjs';
import { getData, addData } from './storage.mjs';
import assert from 'node:assert';
import test, { beforeEach } from 'node:test';

beforeEach(() => {
	localStorage.clear();
});

test('getUserIds returns an array of 5 user IDs', () => {
	const userIds = getUserIds();
	assert(Array.isArray(userIds), 'getUserIds should return an array');
	assert(userIds.length === 5, 'getUserIds should return 5 user IDs');
});

test('getReviewDates returns correct review dates given start date', () => {
	const reviewDates = getReviewDates('2024-01-01');
	assert.deepStrictEqual(reviewDates, [
		'2024-01-08',
		'2024-02-01',
		'2024-04-01',
		'2024-07-01',
		'2025-01-01',
	]);
});

test('getReviewDates handles leap year correctly', () => {
	const reviewDates = getReviewDates('2024-02-29');
	assert.deepStrictEqual(reviewDates, [
		'2024-03-07',
		'2024-03-29',
		'2024-05-29',
		'2024-08-29',
		'2025-03-01',
	]);
});

test('getReviewDates handles end of month correctly', () => {
	const reviewDates = getReviewDates('2024-01-31');
	assert.deepStrictEqual(reviewDates, [
		'2024-02-07',
		'2024-03-02',
		'2024-05-01',
		'2024-07-31',
		'2025-01-31',
	]);
});

test('getSortedReviewTopicsForUser returns sorted review topics for a user', () => {
	const userId = '1';
	const topics = [
		{ topic: 'Topic A', reviewDate: '2024-02-01' },
		{ topic: 'Topic B', reviewDate: '2024-01-08' },
		{ topic: 'Topic C', reviewDate: '2024-04-01' },
	];
	addData(userId, topics);

	const sortedTopics = getSortedReviewTopicsForUser(userId);
	assert.deepStrictEqual(sortedTopics, [
		{ topic: 'Topic B', reviewDate: '2024-01-08' },
		{ topic: 'Topic A', reviewDate: '2024-02-01' },
		{ topic: 'Topic C', reviewDate: '2024-04-01' },
	]);
});

test('getSortedReviewTopicsForUser returns empty array if no topics found for user', () => {
	const userId = '2';
	const sortedTopics = getSortedReviewTopicsForUser(userId);
	assert.deepStrictEqual(sortedTopics, []);
});

test('no duplicate review dates for a topic', () => {
	const reviewDates = getReviewDates('2024-01-01');
	const uniqueDates = new Set(reviewDates);
	assert.strictEqual(
		uniqueDates.size,
		reviewDates.length,
		'Review dates should be unique',
	);
});

test('getTopicsReadyToDisplayForUser filters topics that occur on or after today', () => {
	const userId = '1';
	addData(userId, [
		{ topic: 'Past', reviewDate: '2026-02-24' },
		{ topic: 'Today', reviewDate: '2026-02-25' },
		{ topic: 'Future', reviewDate: '2026-03-01' },
	]);
	// Mock Date to return 2026-02-25
	const realDate = Date;
	global.Date = class extends realDate {
		constructor(...args) {
			if (args.length === 0) return new realDate('2026-02-25');
			return new realDate(...args);
		}
		static now() {
			return new realDate('2026-02-25').getTime();
		}
	};
	const result = getTopicsReadyToDisplayForUser(userId);
	assert.deepStrictEqual(result, [
		{ topic: 'Today', reviewDate: '2026-02-25' },
		{ topic: 'Future', reviewDate: '2026-03-01' },
	]);
	global.Date = realDate;
});

test('Manual test from rubric: User 1, Functions in JS, start date 19th July 2026', () => {
	const userId = '1';
	const topic = 'Functions in JS';
	const startDate = '2026-07-19';
	const reviewDates = getReviewDates(startDate);
	const topics = reviewDates.map((date) => ({ topic, reviewDate: date }));
	addData(userId, topics);
	const realDate = Date;
	global.Date = class extends realDate {
		constructor(...args) {
			if (args.length === 0) return new realDate('2026-07-19');
			return new realDate(...args);
		}
		static now() {
			return new realDate('2026-07-19').getTime();
		}
	};

	const result = getTopicsReadyToDisplayForUser(userId);
	assert.deepStrictEqual(result, [
		{ topic, reviewDate: '2026-07-26' },
		{ topic, reviewDate: '2026-08-19' },
		{ topic, reviewDate: '2026-10-19' },
		{ topic, reviewDate: '2027-01-19' },
		{ topic, reviewDate: '2027-07-19' },
	]);
	global.Date = realDate;
});

test('Manual test from rubric: User 2, Variables in Python and Functions in Python', () => {
	const userId = '2';
	const topic1 = 'Variables in Python';
	const topic2 = 'Functions in Python';
	const startDate1 = '2026-11-05';
	const startDate2 = '2026-10-05';
	const reviewDates1 = getReviewDates(startDate1);
	const reviewDates2 = getReviewDates(startDate2);
	const topics = [
		...reviewDates1.map((date) => ({ topic: topic1, reviewDate: date })),
		...reviewDates2.map((date) => ({ topic: topic2, reviewDate: date })),
	];
	addData(userId, topics);
	const realDate = Date;
	global.Date = class extends realDate {
		constructor(...args) {
			if (args.length === 0) return new realDate('2026-10-05');
			return new realDate(...args);
		}
		static now() {
			return new realDate('2026-10-05').getTime();
		}
	};
	const result = getTopicsReadyToDisplayForUser(userId);
	assert.deepStrictEqual(result, [
		{ topic: topic2, reviewDate: '2026-10-12' },
		{ topic: topic2, reviewDate: '2026-11-05' },
		{ topic: topic1, reviewDate: '2026-11-12' },
		{ topic: topic1, reviewDate: '2026-12-05' },
		{ topic: topic2, reviewDate: '2027-01-05' },
		{ topic: topic1, reviewDate: '2027-02-05' },
		{ topic: topic2, reviewDate: '2027-04-05' },
		{ topic: topic1, reviewDate: '2027-05-05' },
		{ topic: topic2, reviewDate: '2027-10-05' },
		{ topic: topic1, reviewDate: '2027-11-05' },
	]);
	global.Date = realDate;
});

test('Manual test from rubric: User 3, Codewars, start date one month ago', () => {
	const userId = '3';
	const topic = 'Codewars';
	const startDate = '2026-06-26';
	const reviewDates = getReviewDates(startDate);
	const topics = reviewDates.map((date) => ({ topic, reviewDate: date }));
	addData(userId, topics);
	const realDate = Date;
	global.Date = class extends realDate {
		constructor(...args) {
			if (args.length === 0) return new realDate('2026-07-26');
			return new realDate(...args);
		}
		static now() {
			return new realDate('2026-07-26').getTime();
		}
	};
	const result = getTopicsReadyToDisplayForUser(userId);
	assert.deepStrictEqual(result, [
		{ topic, reviewDate: '2026-07-26' },
		{ topic, reviewDate: '2026-09-26' },
		{ topic, reviewDate: '2026-12-26' },
		{ topic, reviewDate: '2027-06-26' },
	]);
	global.Date = realDate;
});
