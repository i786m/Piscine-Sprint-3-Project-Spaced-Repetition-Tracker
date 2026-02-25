import { getData } from './storage.mjs';

/**
 * Function to get user IDs
 * Reurns an array of user IDs
 * @returns {string[]} An array of user IDs as strings
 * @example
 * getUserIds();
 * // Returns: ["1", "2", "3", "4", "5"]
 */
export function getUserIds() {
	return ['1', '2', '3', '4', '5'];
}

/**
 * Function to get Review dates for a topic
 * Returns an array of review dates based on the spaced repetition intervals.
 * Uses UTC date handling to ensure consistency across time zones.
 * @param {string} reviewStartDate - The date when the topic was added (in YYYY-MM-DD format)
 * @returns {string[]} An array of review dates in YYYY-MM-DD format at the following intervals after the reviewStartDate: one week, one month, three months, six months, one year.
 * @example
 * getReviewDates("2024-01-01");
 * // Returns: ["2024-01-08", "2024-02-01", "2024-04-01", "2024-07-01", "2025-01-01"]
 */
export function getReviewDates(reviewStartDate) {
	const reviewStart = new Date(reviewStartDate);
	if (isNaN(reviewStart.getTime())) {
		throw new Error('Invalid date format. Please use YYYY-MM-DD.');
	}
	function addWeeks(date, weeks) {
		const result = new Date(date);
		result.setUTCDate(result.getUTCDate() + weeks * 7);
		return result;
	}
	function addMonths(date, months) {
		const result = new Date(date);
		result.setUTCMonth(result.getUTCMonth() + months);
		return result;
	}
	function addYears(date, years) {
		const result = new Date(date);
		result.setUTCFullYear(result.getUTCFullYear() + years);
		return result;
	}

	const reviewDates = [
		addWeeks(reviewStart, 1),
		addMonths(reviewStart, 1),
		addMonths(reviewStart, 3),
		addMonths(reviewStart, 6),
		addYears(reviewStart, 1),
	].map((date) => date.toISOString().split('T')[0]);
	return reviewDates;
}

/**
 * Function to get review topics for a user sorted in chronological order
 * @param {string} userId - The user ID to get review topics for
 * @returns {object[]} An array of review topic objects sorted by review date, where each object has the following structure: { topic: string, reviewDate: string }
 * @example
 * getSortedReviewTopicsForUser("1");
 * // Returns: [
 * //   { topic: "JavaScript Basics", reviewDate: "2024-01-08" },
 * //   { topic: "JavaScript Basics", reviewDate: "2024-02-01" },
 * //   { topic: "JavaScript Basics", reviewDate: "2024-04-01" },
 * //   { topic: "JavaScript Basics", reviewDate: "2024-07-01" },
 * //   { topic: "JavaScript Basics", reviewDate: "2025-01-01" }
 * // ]
 */
export function getSortedReviewTopicsForUser(userId) {
	const reviewTopics = getData(userId) || [];
	return reviewTopics.sort(
		(a, b) => new Date(a.reviewDate) - new Date(b.reviewDate),
	);
}


/**
 * Function to get topics ready to display by filtering out topics that have review dates in the past
 * @param {string} userId - The user ID to get review topics for
 * @returns {object[]} An array of review topic objects that have review dates either today or in the future, where each object has the following structure: { topic: string, reviewDate: string }
 * @example
 * getTopicsReadyToDisplayForUser("1");
 * // Assuming today's date is 2024-01-15, returns: [
 * //   { topic: "JavaScript Basics", reviewDate: "2024-02-01" },
 * //   { topic: "JavaScript Basics", reviewDate: "2024-04-01" },
 * //   { topic: "JavaScript Basics", reviewDate: "2024-07-01" },
 * //   { topic: "JavaScript Basics", reviewDate: "2025-01-01" }
 * // ]
 */
export function getTopicsReadyToDisplayForUser(userId) {
  const reviewTopics = getSortedReviewTopicsForUser(userId);
  const todayUTC = new Date().toISOString().split('T')[0];
  return reviewTopics.filter((topic) => topic.reviewDate >= todayUTC);
}