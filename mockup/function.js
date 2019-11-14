let oldTab = 'menu';
let isCalOpen = 0;
let calAmout = 0;
let calBy = 0;
let calOperater = '';
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
		document.body.setAttribute('cal',1);
		isCalOpen = 1;
	}
	else{
		document.body.setAttribute('cal',0);
		isCalOpen = 0;
	}
}

function switchPay(el){
	let thisStatus = el.getAttribute('pay');
	newStatus = 1-thisStatus;
	el.setAttribute('pay',newStatus);
}

function togglePopup(panelName,status){
	bodyPopup = 0;
	panelShow = 0;
	thisPanel = document.getElementById('popup_'+panelName);
	if (status == 'open') {
		bodyPopup = 1;
		panelShow = 1;
	}
	thisPanel.setAttribute('show',panelShow);
	document.body.setAttribute('popup',bodyPopup);
}

function calInsert(pad){
	num = pad.innerText;
	calInsertNum(num);
}
function calInsertNum(num){
	amout = input_menuAmout.value;
	newAmout = amout+num;
	input_menuAmout.value = newAmout;
	if (calOperater == '') {
		calAmout = parseInt(newAmout);
	}else{
		console.log('calby: '+calBy);
		console.log('num: '+num);
		newCalby = calBy+num;
		calBy = parseInt(newCalby);
	}
}
function calBackspace(){
	amout = input_menuAmout.value;
	newAmout = amout.substring(0, amout.length - 1);
	input_menuAmout.value = newAmout;
	if (calOperater == '') {
		calAmout = parseInt(newAmout);
	}
	else{
		console.log('calby: '+calBy);
		newCalby = calBy+'';
		newCalby = newCalby.substring(0, newCalby.length - 1);
		if (newCalby != '') {
			calBy = parseInt(newCalby);
		}
		else{
			calBy = 0;
			calOperater = '';
		}
		console.log('newCalBy: '+newCalby);
	}
	
}
function calClear(){
	input_menuAmout.value = '';
	calAmout = 0;
}
function calSubmit(){
	if (input_menuAmout.value == '') {
		input_menuAmout.value = 0;
	}
	calEq();
	toggleCalPanel('close');
}

function calDoOperate(){
	if (calOperater == "+") {
		calAmout = calAmout+calBy;
	}else if(calOperater == "-") {
		calAmout = calAmout-calBy;
	}else if(calOperater == "*") {
		calAmout = calAmout*calBy;
	}else if(calOperater == "/") {
		calAmout = calAmout/calBy;
	}
	calOperater = '';
	calBy = 0;
}

function calEq(){
	calDoOperate();
	input_menuAmout.value = calAmout;
}
function calAddOp(op){
	calEq();
	calOperater = op;
	calInsertNum(op);
}
window.addEventListener("keydown", calCheckEvent, true);

function calCheckEvent(e){
	if (isCalOpen) {
		let k = e.key;
		console.log('K: '+k);
		if (!isNaN(parseInt(k))) {
			calInsertNum(k);
		}

		else if(k == 'Enter'){
			calOk.click();
		}
		else if(k == 'Backspace'){
			calBackspace();
		}
		else if(k == '+' || k == '-' || k == '*' || k == '/'){
			calAddOp(k);
		}
		else if(k == "="){
			calEq();
		}
	}
}