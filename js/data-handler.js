/* Contains helper functions that other larger functions call

CONTENTS:
	1. Global variable for challenges object, initialized to empty, then filled with localStorage data if it exists
	2. deleteChallengeModal		Variables and function to delete a challenge
	3. saveChanges ()			Saves the challenges object into localStorage
	4. exportFile ()			Exports localStorage to file and downloads it to the user's device
	5. importFile ()			Imports data from a user-uploaded file and validates the contents
	6. deleteData ()			Deletes all distance tracker user data from localStorage
	7. addMilestone ()			Adds a row for a new milestone when creating a new challenge
	8. deleteMilestone ()		Deletes a milestone row, by unique ID passed from the row's delete button
	9. addChallenge ()			Add a new challenge to the challenges object
*/


let challenges = {}; // Initialize challenges object to empty

// If localStorage contains a challenges object, copy that data into our challenges object
if (JSON.parse(window.localStorage.getItem('distanceTracker'))) {
	challenges = JSON.parse(window.localStorage.getItem('distanceTracker'));
}

// Deletes a challenge based on ID passed by the button that opens the modal, after confirming deletion via modal
const deleteChallengeModal = document.getElementById('deleteChallengeModal');
let deleteChallengeID = '';
deleteChallengeModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	deleteChallengeID = button.getAttribute('data-bs-challenge');
	const modalBodyInput = deleteChallengeModal.querySelector('.modal-body #challenge-delete-name');
	modalBodyInput.value = challenges[deleteChallengeID].name.replace(/&amp;/g, '&');
});
function deleteChallenge () {
	delete challenges[deleteChallengeID];
	resetPage ();
}

// Saves the challenges object into localStorage
function saveChanges () {
	window.localStorage.setItem('distanceTracker', JSON.stringify(challenges));
}

// Exports localStorage to file and downloads it to the user's device
function exportFile () {
	let fileOutput = document.createElement("a"); // Creates a link element to download the file
	fileOutput.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(challenges))); // Sets link target to JSON string from challenges object
	fileOutput.setAttribute("download", "distance-tracker-data-export.txt"); // Tells the browser to download the data, using the specified filename
	fileOutput.style.display = "none"; // Hides the link from view
	document.body.appendChild(fileOutput); // Adds the link to the end of the HTML document
	fileOutput.click(); // Triggers a click event on the link
	document.body.removeChild(fileOutput); // Removes the link from the end of the HTML document
}

// Imports data from a user-uploaded file and validates the contents
function importFile (event) {
	let userUpload = event.target.files; // When a user uploads a file
	let file = userUpload[0]; // Get the data from the first item in the array
	
	// Validate file name, file size, and file type
	if (file.name === 'distance-tracker-data-export.txt' && file.size < 5000 && file.size > 50 && file.type === 'text/plain') { 
		let reader = new FileReader(); // Create a new reader object
		reader.onload = (function(theFile) { // When the reader is invoked
			return function(e) {
				if (e.target.result.charAt(0) != '\{') {
					alert ('File validation error: incorrect file contents');
					return;
				}
				let userData = JSON.parse(e.target.result); // Parse the JSON and load that into a temporary holding object
				if (Object.keys(userData).length === 0) { // Check to see if there is usable data in that object
					alert ('File validation error: empty file');
				} else {
					validateUpload(userData);
				}
			};
		})(file); // Pass the user-uploaded file into the anonymous function
		reader.readAsText(file); // Invoke reader on the user-uploaded file
	} else if (file.name != 'distance-tracker-data-export.txt') {
		alert ('File validation error: file name incorrect.');
	} else if (file.size == 0) {
		alert ('File validation error: file too small');
	} else if (file.size > 5000) {
		alert ('File validation error: file too large');
	} else if (file.type != 'text/plain') {
		alert ('File validation error: incorrect file type');
	} else {
		alert ('File validation error: unknown error');
	}
}
document.getElementById('uploadFile').addEventListener('change', importFile, false); // Event handler to trigger upload once user selects a file with the browser

// Deletes all distance tracker user data from localStorage
function deleteData () {
	window.localStorage.removeItem('distanceTracker'); // Removes distanceTracker from localStorage
	challenges = {}; // Sets challenges object to empty
	resetPage ();
}

// Adds a row for a new milestone when creating a new challenge
let milestoneCounter = 0; // Counter for number of milestones added, so that they each have a unique ID
function addMilestone (container) {
	const milestonesDiv = document.getElementById(container); // Variable to put milestone content into
	let milestonesContent = '<div class="row mb-3" id="milestone' + milestoneCounter + '">';
	
	// Create new milestone row with unique ID
	milestonesContent += '<div class="col-6"><input type="text" class="form-control" name="milestone' + milestoneCounter + '-name" id="milestone' + milestoneCounter + '-name" placeholder="Milsetone name" /></div>';
	milestonesContent += '<div class="col-5"><input type="number" class="form-control" name="milestone' + milestoneCounter + '-distance" id="milestone' + milestoneCounter + '-distance" placeholder="Distance" /></div>';
	milestonesContent += '<div class="col-1"><button class="btn btn-link btn-sm m-1" type="button" onclick="deleteMilestone(\'milestone' + milestoneCounter + '\')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg></button></div></div>'; // Creates button to delete, with matching unique ID
	milestonesDiv.insertAdjacentHTML('beforeend', milestonesContent); // Adds the new row, without overwriting div contents like with innerHTML
	milestoneCounter++;
}

// Deletes a milestone row, by unique ID passed from the row's delete button
function deleteMilestone (milestoneID) {
	const milestone = document.getElementById(milestoneID);
	milestone.parentNode.removeChild(milestone);
}

// Add a new challenge to the challenges object
function addChallenge () {
	// Grab all values from the add new challenge modal's form
	const name = document.getElementById('challenge-new-name').value;
	let challengeID = name.toLowerCase().replace(/ /g,'_').replace(/-/g, '_');
	if (!isNaN(challengeID.charAt(0))) {
		challengeID = 'dg_' + challengeID;
	}
	
	const company = document.getElementById('challenge-new-company').value;
	let distance;
	if (parseFloat(document.getElementById('enter-distance-new').value) > 0) {
		distance = parseFloat(document.getElementById('enter-distance-new').value); // Convert to number; will discard any non-numeric values
	} else if (parseFloat(document.getElementById('enter-distance-new').value) <= 0) {
		alert ('Error: invalid distance. Please enter a number greater than 0.');
		return;
	} else if (typeof document.getElementById('enter-distance-new').value == 'string') {
		alert ('Error: invalid format for distance. Please enter a number using the digits 0-9. Decimal places are allowed.');
		return;
	}
	
	const unitList = document.querySelectorAll('input[name="distance-new"]');
	let distanceUnit;
	for (const unit of unitList) { // Get the selected unit from the list of units available
		if (unit.checked) {
			distanceUnit = unit.value;
			break;
		}
	}
	let period;
	if (parseFloat(document.getElementById('challenge-new-period').value) > 0 || document.getElementById('challenge-new-period').value == '') {
		period = parseFloat(document.getElementById('challenge-new-period').value); // Convert to number to prevent weird math errors; will discard any non-numeric values
	} else if (parseFloat(document.getElementById('challenge-new-period').value) <= 0) {
		alert ('Error: invalid time period. Please enter a number greater than 0.');
		period = '';
	} else {
		alert ('Error: invalid format for time period. Please enter a whole number without a decimal point using the digits 0-9.');
		return;
	}
	
	const periodUnit = document.getElementById('challenge-new-period-unit').value;
	let start;
	if (document.getElementById('challenge-new-start').value) {
		start = document.getElementById('challenge-new-start').value;
	} else {
		const today = new Date();
		start = today.getFullYear() + '-' + today.getMonth() + '-' + today.getdate();
	}
	const hasMilestones = document.getElementById('hasMilestones').checked;
	const milestones = document.getElementById('milestones-container');
	
	// Calculate period in days using start date and number-unit combination from user entry
	let duration = false;
	if (period) {
		const startDate = new Date (start.split('-'));
		let endDate = new Date (start.split('-'));
		if (periodUnit == 'day') {
			endDate.setDate(endDate.getDate() + period);
		} else if (periodUnit == 'month') {
			endDate.setMonth(endDate.getMonth() + period);
		} else if (periodUnit == 'year') {
			endDate.setYear(endDate.getFullYear() + period);
		} else {
			alert ('Error with date format entry');
		}
		duration = endDate.getTime() - startDate.getTime(); // Get difference between end time and start time, in milliseconds 
		duration = Math.floor(duration / (1000 * 3600 * 24)); // Convert millisecond duration into days (1000ms/s, 3600s/hr, 24hr/day) and round down
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
	
	// If a challenge with this unique ID does not exist, create new challenge object within challenges and save it to localStorage
	if (!challenges[challengeID]) {
		challenges[challengeID] = {};
		challenges[challengeID].name = name;
		challenges[challengeID].company = company;
		challenges[challengeID].distance = distance;
		challenges[challengeID].unit = distanceUnit;
		challenges[challengeID].period = duration;
		challenges[challengeID].start = start + 'T00:00:00';
		challenges[challengeID].progress = 0;
		challenges[challengeID].complete = false;
		challenges[challengeID].milestones = milestonesArray;
		saveChanges();
	} else { // If a challenge with this unique ID already exists, throw an error
		alert ('Error: challenge already exists');
	}
}