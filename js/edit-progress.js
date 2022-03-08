// Set variables to access modals for editing a challenge's details and progress
const editProgressModal = document.getElementById('editProgressModal');
const addProgressModal = document.getElementById('addProgressModal');
let challengeID = "";

// Gets a challenge's name via challenge ID passed by button, and places that into the modal
editProgressModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	challengeID = button.getAttribute('data-bs-challenge');
	const modalBodyInput = editProgressModal.querySelector('.modal-body #challenge-edit-name');
	modalBodyInput.value = challenges[challengeID].name.replace(/&amp;/g, "&");
});

// Gets a challenge's name via challenge ID passed by button, and places that into the modal
addProgressModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	challengeID = button.getAttribute('data-bs-challenge');
	const modalBodyInput = addProgressModal.querySelector('.modal-body #challenge-add-name');
	modalBodyInput.value = challenges[challengeID].name.replace(/&amp;/g, "&");
});

// Add to a challenge's progress, incrementing by user-entered amount
function addProgress () {
	const distance = parseFloat(document.getElementById('enter-distance-add').value); // Get the user's entered amount and convert it to a number
	
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
	
	// Make sure that the data is entered in the correct unit, by converting it if necessary
	if (selectedUnit == challenge.unit) {
		challenge.progress += distance;
	} else if (selectedUnit == "miles" && challenge.unit == "kilometers") {
		challenge.progress += distance * 1.60934;
	} else if (selectedUnit == "kilometers" && challenge.unit == "miles") {
		challenge.progress += distance * 0.621371;
	} else {
		alert ("Unit conversion error.");
	}
	
	// Reset page contents, regenerate challenge cards, and save the updated data to localStorage
	inProgress.innerHTML = "";
	complete.innerHTML = "";
	writeCard();
	saveChanges();
}

// Set a challenge's progress; this will eventually be phased out in favor of editing all details 
function editProgress () {
	const distance = parseFloat(document.getElementById('enter-distance').value);
	const units = document.querySelectorAll('input[name="distance"]');
	const challenge = challenges[challengeID];
	let selectedUnit;
	for (const unit of units) {
		if (unit.checked) {
			selectedUnit = unit.value;
			break;
		}
	}
	if (selectedUnit == challenge.unit) {
		challenge.progress = distance;
	} else if (selectedUnit == "miles" && challenge.unit == "kilometers") {
		challenge.progress = distance * 1.60934;
	} else if (selectedUnit == "kilometers" && challenge.unit == "miles") {
		challenge.progress = distance * 0.621371;
	} else {
		alert ("Unit conversion error.");
	}
	inProgress.innerHTML = "";
	complete.innerHTML = "";
	writeCard();
	saveChanges();
}

// Edit a challenge's details
function editDetails () {
	
}