let oldTab = 'menu';
function switchTab(tabName){
	newTab = tabName;
	thisPanel = document.querySelector('#'+tabName);
	if (tabName == "menu") {
		oldPanel = document.querySelector('#people');
	}
	else{
		oldPanel = document.querySelector('#menu');	
	}
	oldPanel.style.display = "none";
	thisPanel.style.display = "block";
	if (oldTab != newTab) {
		document.querySelectorAll('.tabName')[0].classList.toggle('cl-grey');
		document.querySelectorAll('.tabName')[1].classList.toggle('cl-grey');
		document.querySelectorAll('.tabLine')[0].classList.toggle('bg-grey-2');
		document.querySelectorAll('.tabLine')[1].classList.toggle('bg-grey-2');
	}
	oldTab = newTab;
}

function toggleCalPanel(status){
	console.log('toggle '+status);
	if (status == 'open') {
		document.body.style.setProperty('--calHeight','200px');
	}
	else{
		document.body.style.setProperty('--calHeight','0px');
	}
}