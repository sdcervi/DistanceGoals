let challenges = JSON.parse(window.localStorage.getItem('distanceTest'));
function saveChanges () {
	window.localStorage.setItem('distanceTest', JSON.stringify(challenges));
}
function exportFile () {
	let fileOutput = document.createElement("a");
	fileOutput.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(JSON.stringify(challenges)));
	fileOutput.setAttribute("download", "export-test.txt");
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
			window.localStorage.setItem('distanceTest', e.target.result);
			challenges = JSON.parse(e.target.result);
		};
	})(file);
	reader.readAsText(file);
}
function deleteData () {
	window.localStorage.removeItem('distanceTest');
}
document.getElementById('uploadFile').addEventListener('change', importFile, false);
const outputDiv = document.getElementById('uploadedFileOutput');
//outputDiv.innerHTML = JSON.stringify(challenges, null, 2);