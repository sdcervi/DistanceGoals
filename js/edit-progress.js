const editProgressModal = document.getElementById('editProgressModal');
const addProgressModal = document.getElementById('addProgressModal');
let challengeID = "";

editProgressModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	challengeID = button.getAttribute('data-bs-challenge');
	const modalBodyInput = editProgressModal.querySelector('.modal-body #challenge-edit-name');
	modalBodyInput.value = challenges[challengeID].name;
});

addProgressModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	challengeID = button.getAttribute('data-bs-challenge');
	const modalBodyInput = addProgressModal.querySelector('.modal-body #challenge-add-name');
	modalBodyInput.value = challenges[challengeID].name;
});

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

function addProgress () {
	const distance = parseFloat(document.getElementById('enter-distance-add').value);
	const units = document.querySelectorAll('input[name="distance-add"]');
	const challenge = challenges[challengeID];
	let selectedUnit;
	for (const unit of units) {
		if (unit.checked) {
			selectedUnit = unit.value;
			break;
		}
	}
	if (selectedUnit == challenge.unit) {
		challenge.progress += distance;
	} else if (selectedUnit == "miles" && challenge.unit == "kilometers") {
		challenge.progress += distance * 1.60934;
	} else if (selectedUnit == "kilometers" && challenge.unit == "miles") {
		challenge.progress += distance * 0.621371;
	} else {
		alert ("Unit conversion error.");
	}
	inProgress.innerHTML = "";
	complete.innerHTML = "";
	writeCard();
	saveChanges();
}