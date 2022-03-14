/* Contains functions to edit a challenge's details and add progress to it

CONTENTS:
	1. Global variables for edit and add modals
	2. editChallengeModal event listener		Gets a challenge's name via challenge ID passed by button, and places that into the modal for editing
	3. addProgressModal event listener			Gets a challenge's name via challenge ID passed by button, and places that into the modal for reference
	4. addProgress ()							Add to a challenge's progress, incrementing by user-entered amount
	5. editChallenge ()							Edits a challenge's details
*/

// Set variables to access modals for editing a challenge's details and progress
const editChallengeModal = document.getElementById('editChallengeModal');
const addProgressModal = document.getElementById('addProgressModal');

let challengeID = '';

// Gets a challenge's name via challenge ID passed by button, and places that into the modal for editing
editChallengeModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	challengeID = button.getAttribute('data-bs-challenge'); // Get challenge's ID from the button clicked
	const challenge = challenges[challengeID]; // Pull challenge data into variable for easy access
	
	// Get HTML IDs for passing in values
	const editName = editChallengeModal.querySelector('.modal-body #challenge-edit-name');
	const editCompany = editChallengeModal.querySelector('.modal-body #challenge-edit-company');
	const editDistance = editChallengeModal.querySelector('.modal-body #challenge-edit-distance');
	const editDistanceUnits = document.querySelectorAll('input[name="distance-edit"]');
	const editProgress = editChallengeModal.querySelector('.modal-body #challenge-edit-progress');
	const editComplete = editChallengeModal.querySelector('.modal-body #is-complete');
	const editPeriod = editChallengeModal.querySelector('.modal-body #challenge-edit-period');
	const editPeriodUnit = editChallengeModal.querySelector('.modal-body #challenge-edit-period-unit');
	const editStart = editChallengeModal.querySelector('.modal-body #challenge-edit-start');
	const editHasMilestones = editChallengeModal.querySelector('.modal-body #edit-hasMilestones');
	const editMilestones = editChallengeModal.querySelector('.modal-body #milestones-edit-container');
	
	// Generate date string for inputting into form field
	const currentStart = getDateString (challenge.start);
	
	// Pass in all the values
	editName.value = challenge.name.replace(/&amp;/g, '&');
	editCompany.value = challenge.company;
	editDistance.value = challenge.distance;
	for (const unit of editDistanceUnits) { // Set radio button
		if (unit.value == challenge.unit) {
			unit.checked = true;
		} else {
			unit.checked = false;
		}
	}
	editProgress.value = parseFloat(challenge.progress.toFixed(2));
	if (challenge.complete) { // Check completed box if challenge is completed
		editComplete.checked = true;
	}
	editPeriod.value = parseFloat(challenge.period); // Will be empty if no period specified
	editPeriodUnit.value = 'day';
	editStart.value = currentStart;
	
	// Initialize milestones to empty and hasMilestones not checked
	editMilestones.innerHTML = '';
	editHasMilestones.checked = false;
	document.getElementById('collapseEditMilestones').classList.remove('show');
	
	// If milestones are present in the challenge data, check hasMilestones, show the div, and generate rows for editing the milestones
	if (Object.keys(challenge.milestones).length > 0) {
		editHasMilestones.checked = true;
		document.getElementById('collapseEditMilestones').classList.add('show');
		
		let milestoneCounter = 0;
		for (const counter in challenge.milestones) {
			const milestone = challenge.milestones[counter];
			// Create new milestone row with unique ID
			let milestonesContent = '<div class="row mb-3" id="milestone' + milestoneCounter + '">';
			milestonesContent += '<div class="col-6"><input type="text" class="form-control" name="milestone' + milestoneCounter + '-name" id="milestone' + milestoneCounter + '-name" value="' + milestone.name + '" /></div>';
			milestonesContent += '<div class="col-5"><input type="number" class="form-control" name="milestone' + milestoneCounter + '-distance" id="milestone' + milestoneCounter + '-distance" value="' + milestone.distance + '" /></div>';
			milestonesContent += '<div class="col-1"><button class="btn btn-link btn-sm m-1" type="button" onclick="deleteMilestone(\'milestone' + milestoneCounter + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></button></div></div>'; // Creates button to delete, with matching unique ID
			editMilestones.insertAdjacentHTML('beforeend', milestonesContent); // Adds the new row, without overwriting div contents like with innerHTML
			milestoneCounter++;
		}
	}
});

// Gets a challenge's name via challenge ID passed by button, and places that into the modal for reference
addProgressModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	challengeID = button.getAttribute('data-bs-challenge'); // Get the challenge's ID from the button clicked
	const modalBodyInput = addProgressModal.querySelector('.modal-body #challenge-add-name');
	modalBodyInput.value = challenges[challengeID].name.replace(/&amp;/g, '&'); // Send the challenge name to the modal, replacing any escaped ampersands with the character
});

// Add to a challenge's progress, incrementing by user-entered amount
function addProgress () {
	// Get the user's entered amount and convert it to a number
	let distance;
	if (parseFloat(document.getElementById('enter-distance-add').value)) {
		distance = parseFloat(document.getElementById('enter-distance-add').value); // Convert to number; will discard any non-numeric values
	} else if (typeof document.getElementById('enter-distance-add').value == 'string') {
		alert ('Error: invalid format for distance. Please enter a number using the digits 0-9. Decimal places are allowed.');
		return;
	}
	
	// Get the selected unit from the list of units
	const units = document.querySelectorAll('input[name="distance-add"]');
	const challenge = challenges[challengeID];
	let selectedUnit;
	for (const unit of units) {
		if (unit.checked) {
			selectedUnit = unit.value;
			break;
		}
	}
	
	// Convert distance if needed
	if (selectedUnit == challenge.unit) {
		distance *= 1;
	} else if (selectedUnit == 'miles' && challenge.unit == 'kilometers') {
		distance *= 1.60934;
	} else if (selectedUnit == 'kilometers' && challenge.unit == 'miles') {
		distance += 0.621371;
	} else {
		alert ('Unit conversion error.');
		return;
	}
	
	// Make sure that it won't make the challenge's progress negative
	if (distance < 0 && challenge.progress + distance < 0) {
		challenge.progress = 0;
	} else {
		challenge.progress += distance;
	}
	
	// Reset page contents, regenerate challenge cards, and save the updated data to localStorage
	resetPage();
}

// Edit a challenge's details
function editChallenge () {
	// Set up access to this challenge's data
	const name = document.getElementById('challenge-edit-name').value;
	console.log (challengeID);
	const challenge = challenges[challengeID];
	
	// Get the rest of the data
	const company = document.getElementById('challenge-edit-company').value
	let distance;
	if (parseFloat(document.getElementById('challenge-edit-distance').value) > 0) {
		distance = parseFloat(document.getElementById('challenge-edit-distance').value); // Convert to number; will discard any non-numeric values
	} else if (parseFloat(document.getElementById('challenge-edit-distance').value) <= 0) {
		alert ('Error: invalid distance. Please enter a number greater than 0.');
		distance = challenge.distance;
	} else if (typeof document.getElementById('challenge-edit-distance').value == 'string') {
		alert ('Error: invalid format for distance. Please enter a number using the digits 0-9. Decimal places are allowed.');
		return;
	}
	const unitList = document.querySelectorAll('input[name="distance-edit"]');
	let distanceUnit;
	for (const unit of unitList) { // Get the selected unit from the list of units available
		if (unit.checked) {
			distanceUnit = unit.value;
			break;
		}
	}
	let progress;
	if (parseFloat(document.getElementById('challenge-edit-progress').value) >= 0) { // If the user entered a number, entered 0, or left it blank
		progress = parseFloat(document.getElementById('challenge-edit-progress').value); // Convert to number to prevent weird math errors; will discard any non-numeric values
	} else if (document.getElementById('challenge-edit-progress').value == '' || parseFloat(document.getElementById('challenge-edit-progress').value) < 0) {
		progress = 0;
	} else { // If the user entered an invalid value somehow
		alert ('Error: invalid format for progress. Please enter a number using the digits 0-9. Decimal places are allowed.');
		return;
	}
	const isComplete = document.getElementById('is-complete').checked;
	let period;
	if (parseFloat(document.getElementById('challenge-edit-period').value) > 0 || document.getElementById('challenge-edit-period').value == '') {
		period = parseFloat(document.getElementById('challenge-edit-period').value); // Convert to number to prevent weird math errors; will discard any non-numeric values
	} else if (parseFloat(document.getElementById('challenge-edit-period').value) <= 0) {
		alert ('Error: invalid time period. Please enter a number greater than 0.');
		period = '';
	} else {
		alert ('Error: invalid format for time period. Please enter a whole number without a decimal point using the digits 0-9.');
		return;
	}
	const periodUnit = document.getElementById('challenge-edit-period-unit').value;
	const start = document.getElementById('challenge-edit-start').value;
	const hasMilestones = document.getElementById('edit-hasMilestones').checked;
	const milestones = document.getElementById('milestones-edit-container');
	
	// Calculate period in days using start date and number-unit combination from user entry
	let duration = false;
	if (period) {
		const startDate = new Date (start.split('-'));
		let endDate = new Date (start.split('-'));
		if (periodUnit == 'day') {
			endDate.setDate(endDate.getDate() + period + 1); // To correct off-by-one error
		} else if (periodUnit == 'month') {
			endDate.setMonth(endDate.getMonth() + period);
		} else if (periodUnit == 'year') {
			endDate.setYear(endDate.getFullYear() + period);
		} else {
			alert ('Error with date format entry');
		}
		duration = getDuration (startDate, endDate);
	}
	
	let milestonesArray = []; // Initialize milestones array to be empty
	if (milestones.innerHTML !== '' && hasMilestones) { // Only if the user entered content (milestones div is not empty), AND the milestones checkbox is checked
		for (let counter = 0; counter < milestones.children.length; counter++) { // Iterate through using a counter since milestone unique IDs may skip a number
			// Get the milestone's name and distance
			let milestoneID = milestones.children[counter].id; // Get HTML element's unique ID
			let milestoneName = document.getElementById(milestoneID + '-name').value; // Get the name of the milestone
			// Get distance of milestone, validated as a number
			let milestoneDistance;
			if (parseFloat(document.getElementById(milestoneID + '-distance').value)) {
				milestoneDistance = parseFloat(document.getElementById(milestoneID + '-distance').value); // Convert to number; will discard any non-numeric values
			} else if (typeof document.getElementById(milestoneID + '-distance').value == 'string') {
				alert ('Error: invalid format for milestone distance. Please enter a number using the digits 0-9. Decimal places are allowed.');
				return;
			}
			milestonesArray.push({ name: milestoneName.replace(/ /g, '\u00a0'), distance : milestoneDistance }); // Push new object into array with any spaces in name converted to &nbsp;
		}
	}
	
	// Store all new data into the challenge object
	challenge.name = name.replace(/&/g, '&amp;');
	challenge.company = company;
	challenge.distance = distance;
	challenge.unit = distanceUnit;
	challenge.period = duration;
	challenge.start = start + 'T00:00:00';
	challenge.progress = progress;
	if (isComplete && progress >= distance) {
		challenge.complete = new Date ();
	} else if (isComplete && !challenge.complete) {
		challenge.complete = new Date ();
		challenge.progress = distance
	} else {
		challenge.complete = false;
	}
	challenge.milestones = milestonesArray;
	
	resetPage();
}