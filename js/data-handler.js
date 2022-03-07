let challenges = JSON.parse(window.localStorage.getItem('distanceTracker'));

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
}

function deleteData () {
	window.localStorage.removeItem('distanceTracker');
	challenges = {};
	inProgress.innerHTML = "";
	complete.innerHTML = "";
	writeCard();
	saveChanges();
}

document.getElementById('uploadFile').addEventListener('change', importFile, false);