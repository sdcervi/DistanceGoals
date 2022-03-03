const inProgress = document.getElementById("in-progress");
const complete = document.getElementById("complete");

function writeCard () {
	for (const counter in challenges) {
		const challenge = challenges[counter];
		if (challenge.progress >= challenge.distance && !challenge.complete) {
			challenge.complete = new Date();
		}
		if (!challenge.complete) {
			const today = new Date ();
			const startDate = new Date (challenge.start);
			let endDate = new Date (challenge.start);
			endDate.setDate(endDate.getDate() + challenge.period);
			let timeSoFar = today.getTime() - startDate.getTime();
			timeSoFar = Math.floor(timeSoFar / (1000 * 3600 * 24));
			let progress = Math.floor((challenge.progress / challenge.distance) * 100);
			let cardContent = '<article class="col" id="' + counter +'"><div class="card race-card">';
			cardContent += '<div class="card-header race-name"><button class="btn btn-sm btn-secondary progress-edit" data-bs-toggle="modal" data-bs-target="#editProgressModal" data-bs-challenge="' + counter + '"><img src="assets/edit-icon.svg" alt="Edit" class="icon-white" />&nbsp;Progress</button><h3>' + challenge.name + '</h3></div>';
			cardContent += '<div class="card-body">';
			if (challenge.period) {
				cardContent += '<p class="race-period">Finishes: ' + endDate.toDateString() + '</p>';
			}
			cardContent += '<h4 class="card-title race-company">' + challenge.company + '</h4>';
			cardContent += '<div class="race-progress"><div class="row"><div class="col-3 progress-header">Distance</div><div class="col-9 progress-display"><div class="progress">';
			if (challenge.milestones) {
				let stepCounter = 1;
				let stepSize = 0;
				let previousStep = 0;
				let currentStep = 0;
				for (const step in challenge.milestones) {
					const milestone = challenge.milestones[step];
					if (challenge.progress > milestone.distance) {
						currentStep = milestone.distance;
						stepSize = currentStep - previousStep;
						const numSteps = Object.keys(challenge.milestones).length;
						const opacity = (100 / numSteps) * stepCounter;
						cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + (stepSize / challenge.distance) * 100 + '%; background-color: darkgreen; opacity: ' + opacity + '%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
						previousStep = currentStep;
					} else {
						currentStep = challenge.progress;
						stepSize = currentStep - previousStep;
						previousStep = currentStep;
						const numSteps = Object.keys(challenge.milestones).length;
						const opacity = (100 / numSteps) * stepCounter;
						cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + (stepSize / challenge.distance) * 100 + '%; background-color: darkgreen; opacity: ' + opacity + '%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
						break;
					}
					stepCounter++;
				}
			} else {
				cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + progress + '%;" aria-valuenow="' + progress + '" aria-valuemin="0" aria-valuemax="100">' + progress + '%</div>'
			}
			if (challenge.period) {
				cardContent += '</div></div></div><div class="row"><div class="col-3 progress-header">Time</div><div class="col-9 progress-display"><div class="progress">';
				cardContent += '<div class="progress-bar progress-time" role="progressbar" style="width: ' + (timeSoFar / challenge.period) * 100 + '%;" aria-valuenow="' + (timeSoFar / challenge.period) * 100 + '" aria-valuemin="0" aria-valuemax="100"></div>';
			}
			cardContent += '</div></div></div></div>';
			cardContent += '<div class="race-details"><p><strong>Goal:</strong> ' + challenge.distance + " " + challenge.unit + '</p><p><strong>Progress:</strong> ' + challenge.progress + " " + challenge.unit + '</p>';
			if (challenge.milestones) {
				cardContent += '<p><strong>Milestones:</strong></p></div><div class="milestone-progress"><div class="table-responsive"><table class="table table-sm table-borderless milestone-table">';
				let stepCounter = 0;
				let previousStep = 0;
				let currentStep = 0;
				for (const step in challenge.milestones) {
					const milestone = challenge.milestones[step];
					if (challenge.progress > milestone.distance) {
						currentStep = milestone.distance;
						cardContent += '<tr><td class="progress-header">' + milestone.name + '</td>';
						cardContent += '<td class="progress-display"><div><div class="progress"><div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Complete!</div></div></div></td>';
						cardContent += '</tr>';
						previousStep = currentStep;
					} else {
						currentStep = Math.max(challenge.progress - previousStep, 0);
						let nextStep = challenge.milestones[stepCounter].distance - previousStep;
						cardContent += '<tr><td class="progress-header">' + milestone.name + '</td>';
						cardContent += '<td class="progress-display"><div><div class="progress"><div class="progress-bar" role="progressbar" style="width: ' + (currentStep / nextStep) * 100 + '%;" aria-valuenow="' + nextStep + '" aria-valuemin="0" aria-valuemax="100">' + currentStep.toFixed(2) + " / " + nextStep + '</div></div></div></td>';
						cardContent += '</tr>';
						previousStep = challenge.milestones[stepCounter].distance;
					}
					stepCounter++;
				}
				cardContent += '</table></div>';
			}
			cardContent += '</div></div></div></article>';
			inProgress.innerHTML += cardContent;
		} else {
			const endDate = new Date (challenge.complete);		
			let cardContent = '<article class="col"><div class="card race-card">';
			cardContent += '<div class="card-header race-name"><h3>' + challenge.name + '</h3></div>';
			cardContent += '<div class="card-body">';
			cardContent += '<p class="race-period">Finished: ' + endDate.toDateString() + '</p>';
			cardContent += '<h4 class="card-title race-company">' + challenge.company + '</h4>';
			cardContent += '<div class="race-progress"><div class="row"><div class="col-3 progress-header">Distance</div><div class="col-9 progress-display"><div class="progress">';
			if (challenge.milestones) {
				let stepCounter = 1;
				let stepSize = 0;
				let previousStep = 0;
				let currentStep = 0;
				for (const step in challenge.milestones) {
					const milestone = challenge.milestones[step];
					currentStep = milestone.distance;
					stepSize = currentStep - previousStep;
					const numSteps = Object.keys(challenge.milestones).length;
					const opacity = (100 / numSteps) * stepCounter;
					cardContent += '<div class="progress-bar" role="progressbar" style="width: ' + (stepSize / challenge.distance) * 100 + '%; background-color: darkgreen; opacity: ' + opacity + '%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>';
					previousStep = currentStep;
					stepCounter++;
				}
			} else {
				cardContent += '<div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Complete!</div>'
			}
			cardContent += '</div></div></div></div>';
			cardContent += '<div class="race-details"><p><strong>Goal:</strong> ' + challenge.distance + " " + challenge.unit + '</p><p><strong>Progress:</strong> ' + challenge.progress + " " + challenge.unit + '</p>';
			if (challenge.milestones) {
				cardContent += '<p><strong>Milestones:</strong></p></div><div class="milestone-progress"><div class="table-responsive"><table class="table table-sm table-borderless milestone-table">';
				let stepCounter = 0;
				let previousStep = 0;
				let currentStep = 0;
				for (const step in challenge.milestones) {
					const milestone = challenge.milestones[step];
					currentStep = milestone.distance;
					cardContent += '<tr><td class="progress-header">' + milestone.name + '</td>';
					cardContent += '<td class="progress-display"><div><div class="progress"><div class="progress-bar" role="progressbar" style="width: 100%;" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100">Complete!</div></div></div></td>';
					cardContent += '</tr>';
					previousStep = currentStep;
					stepCounter++;
				}
				cardContent += '</table></div>';
			}
			cardContent += '</div></div></div></article>';
			complete.innerHTML += cardContent;
		}
	}
}

writeCard();