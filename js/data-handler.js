let challenges = JSON.parse(window.localStorage.getItem('distanceTracker'));
const deleteChallengeModal = document.getElementById('deleteChallengeModal');
let deleteChallengeID = "";

deleteChallengeModal.addEventListener('show.bs.modal', function (event) {
	const button = event.relatedTarget;
	deleteChallengeID = button.getAttribute('data-bs-challenge');
	const modalBodyInput = deleteChallengeModal.querySelector('.modal-body #challenge-delete-name');
	modalBodyInput.value = challenges[deleteChallengeID].name;
});

let milestoneCounter = 0;

function saveChanges () {
	window.localStorage.setItem('distanceTracker', JSON.stringify(challenges));
}

function exportFile () {
	let fileOutput = document.createElement("a");
	fileOutput.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(challenges)));
	fileOutput.setAttribute("download", "distance-tracker-data-export.txt");
	fileOutput.style.display = "none";
	document.body.appendChild(fileOutput);
	fileOutput.click();
	document.body.removeChild(fileOutput);
}

function importFile (evt) {
	let userUpload = evt.target.files;
	let file = userUpload[0];
	let reader = new FileReader();
	reader.onload = (function(theFile) {
		return function(e) {
			jQuery('#uploadedFileOutput').val(e.target.result);
			window.localStorage.setItem('distanceTracker', e.target.result);
			challenges = JSON.parse(e.target.result);
		};
	})(file);
	reader.readAsText(file);
	location.reload();
}

function deleteData () {
	window.localStorage.removeItem('distanceTracker');
	challenges = {};
	inProgress.innerHTML = "";
	complete.innerHTML = "";
	writeCard();
	saveChanges();
}

function addMilestone () {
	const milestonesDiv = document.getElementById('milestones-container');
	let milestonesContent = '<div class="row mb-3" id="milestone' + milestoneCounter + '">';
	milestonesContent += '<div class="col-8"><input type="text" class="form-control" name="milestone' + milestoneCounter + '-name" id="milestone' + milestoneCounter + '-name" placeholder="Milsetone name" /></div>';
	milestonesContent += '<div class="col-3"><input type="text" class="form-control" name="milestone' + milestoneCounter + '-distance" id="milestone' + milestoneCounter + '-distance" placeholder="Distance" /></div>';
	milestonesContent += '<div class="col-1"><button class="btn btn-secondary btn-sm m-1" type="button" onclick="deleteMilestone(\'milestone' + milestoneCounter + '\')"><img src="assets/clear-icon.svg" alt="Remove milestone" class="icon-white" /></button></div></div>';
	milestonesDiv.insertAdjacentHTML('beforeend', milestonesContent);
	milestoneCounter++;
}

function deleteMilestone (milestoneID) {
	const milestone = document.getElementById(milestoneID);
	milestone.parentNode.removeChild(milestone);
}

function addChallenge () {
	const name = document.getElementById('challenge-new-name').value;
	const challengeID = name.toLowerCase().replace(/ /g,"_");
	const company = document.getElementById('challenge-new-company').value;
	const distance = parseFloat(document.getElementById('enter-distance-new').value);
	const unitList = document.querySelectorAll('input[name="distance-new"]');
	let distanceUnit;
	for (const unit of unitList) {
		if (unit.checked) {
			distanceUnit = unit.value;
			break;
		}
	}
	const period = parseFloat(document.getElementById('challenge-new-period').value);
	const periodUnit = document.getElementById('challenge-new-period-unit').value;
	const start = document.getElementById('challenge-new-start').value;
	const hasMilestones = document.getElementById('hasMilestones').checked;
	const milestones = document.getElementById('milestones-container');
	
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
			alert ("Error with date format entry");
		}
		duration = endDate.getTime() - startDate.getTime();
		duration = Math.floor(duration / (1000 * 3600 * 24));
	}
	
	let milestonesArray = [];
	if (milestones.innerHTML !== "" && hasMilestones) {
		for (let counter = 0; counter < milestones.children.length; counter++) {
			let milestoneID = milestones.children[counter].id;
			let milestoneName = document.getElementById(milestoneID + "-name").value;
			let milestoneDistance = parseFloat(document.getElementById(milestoneID + "-distance").value);
			milestonesArray.push({ name: milestoneName.replace(/ /g, '\u00a0'), distance : milestoneDistance });
		}
	}
	
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
	} else {
		alert ("Error: challenge already exists");
	}
}

function deleteChallenge () {
	delete challenges[deleteChallengeID];
	saveChanges();
	location.reload();
}

document.getElementById('uploadFile').addEventListener('change', importFile, false);