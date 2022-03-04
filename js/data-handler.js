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

function resetData () {
	challenges = {
		zodiac: {
			name:			"600 Mile Zodiac Challenge",
			company:		"Medal Chasers",
			distance:		600,
			unit:			"miles",
			period:			365,
			start:			"2022-02-28T00:00:00",
			progress:		384.39,
			complete:		false,	
			milestones:	[
				{	name:	"Capricorn",	distance:	50		},
				{	name:	"Aquarius",		distance:	100		},
				{	name:	"Pisces",		distance:	150		},
				{	name:	"Aries",		distance:	200		},
				{	name:	"Taurus",		distance:	250		},
				{	name:	"Gemini",		distance:	300		},
				{	name:	"Cancer",		distance:	350		},
				{	name:	"Leo",			distance:	400		},
				{	name:	"Virgo",		distance:	450		},
				{	name:	"Libra",		distance:	500		},
				{	name:	"Scorpio",		distance:	550		},
				{	name:	"Saggitarius",	distance:	600		}]
		},
		rise_and_run: {
			name:			"Rise &amp; Run",
			company:		"Medal Chasers",
			distance:		5,
			unit:			"kilometers",
			period:			false,
			start:			"2022-03-01T00:00:00",
			progress:		2.53,
			complete:		false
		},
		dragon: {
			name:			"Unleash the Dragon Within",
			company:		"Medal Chasers",
			distance:		5,
			unit:			"kilometers",
			period:			false,
			start:			"2022-03-01T00:00:00",
			progress:		3.46,
			complete:		false
		},
		ring: {
			name:			"One Run to Rule Them All",
			company:		"Medal Chasers",
			distance:		5,
			unit:			"kilometers",
			period:			false,
			start:			"2022-03-01T00:00:00",
			progress:		4.70,
			complete:		false
		},
		space_race: {
			name:			"Space Race",
			company:		"Virtual Running Club",
			distance:		400,
			unit:			"miles",
			period:			false,
			start:			"2022-02-03T00:00:00",
			progress:		101.81,
			complete:		false,	
			milestones:	[
				{	name:	"Mercury",	distance:	25		},
				{	name:	"Venus",	distance:	70		},
				{	name:	"Earth",	distance:	120		},
				{	name:	"Mars",		distance:	170		},
				{	name:	"Jupiter",	distance:	225		},
				{	name:	"Saturn",	distance:	280		},
				{	name:	"Uranus",	distance:	340		},
				{	name:	"Neptune",	distance:	400		}]
		},
		dino_might: {
			name:			"Dino-Might Challenge",
			company:		"Virtual Running Club",
			distance:		100,
			unit:			"miles",
			period:			false,
			start:			"02/03/2022",
			progress:		100,
			complete:		"02/28/2022",
			milestones:	[
				{	name:	"Parasaurolophus",		distance:	10		},
				{	name:	"Triceratops",			distance:	20		},
				{	name:	"Brachiosaurus",		distance:	40		},
				{	name:	"Stegosaurus",			distance:	60		},
				{	name:	"Velociraptor",			distance:	80		},
				{	name:	"Tyrannosaurus&nbsp;Rex",	distance:	99.9	}]
		}
	};
	inProgress.innerHTML = "";
	complete.innerHTML = "";
	writeCard();
	saveChanges();
}

document.getElementById('uploadFile').addEventListener('change', importFile, false);
const outputDiv = document.getElementById('uploadedFileOutput');