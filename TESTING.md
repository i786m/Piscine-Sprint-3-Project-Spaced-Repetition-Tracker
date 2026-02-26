## Rubric and how I tested to ensure it is met

All of the below requirements must be met for the project to be considered complete:

- The website must contain a drop-down which lists exactly 5 users
    - **_Tested manually by loading the site and confirming the user select dropdown contains 5 users_**
    - **_Unit test in common.test.mjs to ensure getUserIds returns 5 users_**

- No user is selected on page load
    - **_Tested manually by loading the site and confirming the no user is selected and no schedule is displayed_**

- All of the users must have no agenda when first loading (i.e. with clear `localStorage`). Data should be persisted across page loads (which is handled by the code in `storage.mjs`).
    - **_Tested manually by loading the site, cleared local storage and then reloaded the site, selected each user and confirmed there is no data displayed for the user and local storage is empty_**

- Selecting a user must load the relevant user's agenda from storage
    - **_Tested manually by loading the site, selected a user and added a topic for user. Reloaded the page and selected the same user and confirmed a schedule is now displayed_**

- Selecting a user must display the agenda for the relevant user (see manual testing below)
    - **_Tested manually by loading the site adding topics for different users and then reloaded the pages and reselected users to confirm only the topics added previously were being displayed_**

    - **_Unit tests in common.test.mjs that simulate the manual testing steps were written and passed_**

- If there is no agenda for the selected user, a message is displayed to explain this
    - **_Tested manually by loading the site clearing local storage, reloaded the site, selected a user and confirmed no dat was being displayed, and a message indicating there is no review topics for this user is displayed_**

- The website must contain a form with inputs for a topic name and a date picker. The form should also have a submit button.
    - **_Tested manually by loading the site and confirming visually and via devtools that the site contains a form with inputs and submit button_**

- The date picker must default to today’s date on first page load
    - **_Tested manually by loading the site and confirming the date in the date picker is today_**

- The form has validation to ensure that both the topic name and and selected date have been set by the user
    - **_Tested manually by loading the site and confirming if the user tries to submit the form without a topic name there is a message saying please fill in this field when submission is attempted. There is also a notification to the user in the event a whitespace topic is submitted. The date picker defaults to today so will always have a default date on submission.The user is notified when submission is either successful or unsuccessful_**

- Submitting the form adds a new topic to revise for the relevant user only. The topic’s dates to revise are calculated as one week, one month, three months, six months and one year from the selected date (see manual testing below)
    - **_Tested manually by loading the site and adding a topic for the user and visually confirming the dates match the schedule set out i.e one week etc_**

    - **_Unit test in common.test.js to confirm review dates at the desired intervals are created when form is submitted_**

- After creating a new topic to revise, the agenda for the current user is shown, including the new topic
    - **_Tested manually by loading the site adding a topic for a user and seeing the topic and review dates being rendered, added another topic to the same user and seeing the new topic and old topic both being rendered_**

- The website must score 100 for accessibility in Lighthouse
    - **_Tested manually by loading the site and confirming accessibility score of 100 across multiple views. Also used the lighthouse plugin in netlify to see a lighthouse score when making pull requests_**

- Unit tests must be written for at least one non-trivial function
    - **_Unit tests written for a number of functions in common.test.mjs. Each of these functions form a core part of the logic such as adding topics, getting review dates, getting topics in chronological order and getting topics to display for a user ensuring past events are not to be displayed. As such all these functions are considered to be non trivial. Additionally the manual steps stipulated in the rubric for testing the app have been mocked in the test file and are passing_**

Below are some manual testing steps and expected results, which will be run on all websites to fairly assess them. All of the dates are intended to be exact - if dates are off by one day, that counts as a failure.

Pick the year after the current one (e.g. in 2025, pick 2026).

Where an instruction says `${YEAR}`, use that year. Where an instruction says `${YEAR+1}`, use the following year.

Steps:

1. Select user 1 from the drop-down
1. Add “Functions in JS” to the text input
1. Select the date 19th July ${YEAR} from the date picker
1. Submit the form

Expected result:

- The agenda for user 1 is shown, with the revision dates shown as follows:
    - Functions in JS, 26th July ${YEAR}
    - Functions in JS, 19th August ${YEAR}
    - Functions in JS, 19th October ${YEAR}
    - Functions in JS, 19th January ${YEAR+1}
    - Functions in JS, 19th July ${YEAR+1}
- Each of the revision dates show the topic name and the relevant date (styling/formatting does not matter as long as it is understandable)
- The form remains on the website (allowing for further topics to be added)

Steps:

1. Select user 2 from the drop-down
1. Add “Variables in Python” to the text input
1. Select the date 5th November ${YEAR} from the date picker
1. Submit the form
1. Add “Functions in Python” to the text input
1. Select the date 5th October ${YEAR} from the date picker
1. Submit the form

Expected result:

- The agenda for user 2 is shown, with the revision dates shown as follows:
    - Functions in Python, 12th October ${YEAR}
    - Functions in Python, 5th November ${YEAR}
    - Variables in Python, 12th November ${YEAR}
    - Variables in Python, 5th December ${YEAR}
    - Functions in Python, 5th January ${YEAR+1}
    - Variables in Python, 5th February ${YEAR+1}
    - Functions in Python, 5th April ${YEAR+1}
    - Variables in Python, 5th May ${YEAR+1}
    - Functions in Python, 5th October ${YEAR+1}
    - Variables in Python, 5th November ${YEAR+1}
    - Each of the revision dates show the topic name and the relevant date (styling/formatting does not matter as long as it is understandable)
- The form remains on the website (allowing for further topics to be added)

Steps:

1. Select User 3 from the drop-down
1. Add “Codewars” to the text input
1. Select the date exactly one month ago (e.g. if it's currently July 26th, select June 26th this year) from the date picker
1. Submit the form

Expected result:

- The agenda for user 3 is shown, with the revision dates shown as follows:
    - (No topic is shown for 1 week after the selected date, as this is in the past)
    - Codewars, Today's date (e.g. if it's currently July 26th, shows: July 26th)
    - Codewars, Two months in the future (e.g. if it's currently July 26th, shows: September 26th)
    - Codewars, 5 months in the future (e.g. if it's currently July 26th, shows: December 26th)
    - Codewars, 11 months in the future, (e.g. if it's currently July 26th, shows: June 26th)
- Each of the revision dates show the topic name and the relevant date (styling/formatting does not matter as long as it is understandable)
- The form remains on the website (allowing for further topics to be added)

Go back and check User 1, User 2, and User 3 still show the correct outputs.

- **_Each of these manual steps were carried out on the deployed site and the behaviour stipulated in these steps was confirmed visually. When changing users the data persisted. The data also persisted across site reloads i.e close the tab reopen a tab navigate to site and select respective users and data is still displayed as expected and in line with the steps above_**

- **_These steps have also been simulated in tests in common.test.js_**
