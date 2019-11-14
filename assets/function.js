let oldTab = 'menu';
let isCalOpen = 0;
let calAmout = 0;
let calBy = 0;
let calOperater = '';
let peoples = {};
let menus = {};
let peopleSize = 0;
let menuPrice = 0;
let lastMenu = '';
let lastPeople = '';

function arrayHave(arr,value){
	if (arr.includes(value) != true) {
		arr.push(value);
		arr.sort();
	}
}
function arrayRemove(arr,value){
	var index = arr.indexOf(value);
	if (index > -1) {
		arr.splice(index, 1);
	}
}

function togglePopup(panelName,status){
	bodyPopup = 0;
	panelShow = 0;
	thisPanel = document.getElementById('popup_'+panelName);
	if (status == 'open') {
		bodyPopup = 1;
		panelShow = 1;
		if (panelName == 'menu') {
			popupMenu_title.innerText = lastMenu;
			input_menuAmout.value = menus[lastMenu].price;
			calAmout = menus[lastMenu].price;
			updatePeopleList();
			updateMenuPeopleSize();
			updateMenuAmout(lastMenu);
		}
		if (panelName == 'people') {
			popupPeople_title.innerText = lastPeople;
			popupPeople_amout.innerText = peoples[lastPeople].amout;
			updatePeopleMenuList();
		}
	}
	else{
		updateCache();
		renderAll();

	}
	thisPanel.setAttribute('show',panelShow);
	document.body.setAttribute('popup',bodyPopup);
}

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
	updateCache();
}
function switchPayPaid(el){
	let pName = lastPeople;
	let pay = el.getAttribute('pay');
	if (pay == 0) {
		peoples[pName].paid = 1;
	}
	else{
		peoples[pName].paid = 0;
	}
	switchPay(el);
}

function menuPeoplePay(el){
	let pName = el.getAttribute('data-pname');
	let mName = lastMenu;
	let pay = el.getAttribute('pay');
	if (pay == 0) {
		arrayHave(menus[mName].people,pName);
	}
	else{
		arrayRemove(menus[mName].people,pName);
	}
	updateMenuPeopleSize();
	updateMenuAmout(mName);
	switchPay(el);
}

function peopleMenuPay(el){
	let pName = lastPeople;
	let mName = el.getAttribute('data-mname');
	let pay = el.getAttribute('pay');
	if (pay == 0) {
		arrayHave(menus[mName].people,pName);
	}
	else{
		arrayRemove(menus[mName].people,pName);
	}
	updateMenuAmout(mName);
	updatePeopleMenuList();
	updatePeopleAmout();
	popupPeople_amout.innerText = peoples[lastPeople].amout;
	switchPay(el);
}

function updateMenuPeopleSize(){
	peopleInMenu_wrap.innerText = menus[lastMenu].people.length;
}
function updateMenuAmout(mName){
	if (menus[mName].people.length != 0) {
		menus[mName].amout = Math.ceil(menus[mName].price/menus[mName].people.length);
		if (isNaN(menus[mName].amout)) {
			menus[mName].amout = 0;
		}
	}
	else{
		menus[mName].amout = 0;
	}
	menuAmout_wrap.innerText = menus[mName].amout;
}

function calInsert(pad){
	num = pad.innerText;
	calInsertNum(num);
}
function calInsertNum(num){
	amout = input_menuAmout.value;
	if (isNaN(amout) == true) {
		amout = 0;
	}
	if (amout != 0) {
		newAmout = amout+num;
		updateMenuAmout(lastMenu);
	}
	else{
		newAmout = num;
		updateMenuAmout(lastMenu);
	}
	input_menuAmout.value = newAmout;
	if (calOperater == '') {
		calAmout = parseInt(newAmout);
	}else{
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
		newCalby = calBy+'';
		newCalby = newCalby.substring(0, newCalby.length - 1);
		if (newCalby != '') {
			calBy = parseInt(newCalby);
		}
		else{
			calBy = 0;
			calOperater = '';
		}
	}
	if (isNaN(newAmout) == true) {
		amout = 0;
	}

}
function calClear(){
	input_menuAmout.value = '0';
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
	if (isNaN(calAmout) == true) {
		calAmout = 0;
	}
	calAmout = Math.ceil(calAmout);
	menus[lastMenu].price = calAmout;
	input_menuAmout.value = calAmout;
	updateMenuAmout(lastMenu);
	updateBillPrice();
	updatePeopleAmout();
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

function addPeople(e){
	let pName = e.value;
	if (pName != '') {
		e.value = '';
		peoples[pName] = {
			amout:0,
			paid:0,
			hue:pNameToHue(pName),
		};
		updatePeopleList();
		updatePeopleSize();
		updateCache();
	}
	return false;

}

function addPeople2(e){
	let pName = e.value;
	addPeople(e);
	document.querySelector(`.people-list[data-pname="${pName}"]`).click();
	updateCache();
	return false;
}

function updatePeopleSize(){
	peopleSize_wrap.innerText = peopleSize;
}

function updatePeopleList(){
	let txt = '';
	let txt2 = '';
	peopleSize = 0;
	for (var i in peoples) {
		txt += renderPeopleList(i,peoples[i].amout,peoples[i].paid);
		txt2 += renderPeopleInMenuList(i);
		peopleSize++;
	}
	peopleList.innerHTML = txt;
	peopleInMenuList_wrap.innerHTML = txt2;
}

function renderPeopleList(pName,amout,paid){
	let txt = `
	<box col="8" mob="8"><inner class="people-main-list" pay="${paid}" onclick="switchPayPaid(this)" style="--hue:${peoples[pName].hue};">
	${pName} <span class="paid-label">จ่ายแล้ว</span>
	</inner></box>
	<box col="2" mob="2"><inner class="t-right v-middle-wrap">
	${amout}
	</inner></box>
	<box col="2" mob="2" onclick="openPeople('${pName}')"><inner class="t-center v-middle-wrap">
	<i class="cl-grey size-s fas fa-stream"></i>
	</inner></box>
	<sp class="px bg-smoke"></sp>
	`;
	return txt;
}

function renderPeopleInMenuList(pName){
	let pay = 0;
	if (lastMenu != '') {
		if (menus[lastMenu].people.includes(pName) == true) {
			pay = 1;
		}
	}
	let txt = `
	<span data-pname="${pName}" class="people-list" pay="${pay}" style="--hue:${peoples[pName].hue};" onclick="menuPeoplePay(this)"><i class="fas size-xs"></i>&nbsp; ${pName}</span>
	`;
	return txt;
}

function addMenu(e){
	let mName = e.value;
	if (mName != '') {
		if (typeof(menus[mName]) == 'undefined') {
			menus[mName] = {
				price:0,
				people:[],
				amout:0,
			};
			lastMenu = mName;
			togglePopup('menu','open');
			// input_menuAmout.focus();
			input_menuAmout.click();

		}
		else{
			alert('รายการนี้มีแล้ว');
		}
	}
	e.value = '';
	return false;

}

function openMenu(mName){
	lastMenu = mName;
	togglePopup('menu','open');
}
function openPeople(pName){
	lastPeople = pName;
	togglePopup('people','open');
}
function updateMenuList(){
	let txt = '';
	for(let i in menus){
		txt += renderMenuList(i);
	}
	menuList.innerHTML = txt;
}
function renderMenuList(menu){
	let people = menus[menu].people;
	let price = menus[menu].price;
	let amout = menus[menu].amout;
	let txt = `
	<box col="7" mob="7" onclick="openMenu('${menu}')"><inner class="">
	<div>${menu}</div>
	<div class="menu-pay-by">
	`
	for (var i in people) {
		txt += `<span class="paid-label" style="--hue:${peoples[people[i]].hue};">${people[i]}</span>`;
	}
	txt += `</div>
	</inner></box>
	<box col="3" mob="3" onclick="openMenu('${menu}')"><inner class="t-right">
	${price}
	</inner></box>
	<box col="2" mob="2"><inner class="t-right cl-grey size-m">
	${amout}
	</inner></box>
	<sp class="px bg-smoke"></sp>`;
	return txt;
}

function updatePeopleMenuList(){
	let txt = '';
	for(let i in menus){
		txt += renderPeopleMenuList(i);
	}
	popupPeople_menu.innerHTML = txt;
}
function renderPeopleMenuList(i){
	let pay = 0;
	let amout = 0;
	if (menus[i].people.includes(lastPeople)) {
		pay = 1;
		amout = menus[i].amout;
	}
	let price = menus[i].price;
	let txt = `
	<box col="7" mob="7"><inner class="">
	<div class="menu-list" data-mname="${i}" pay="${pay}" onclick="peopleMenuPay(this)">
	<i class="fas size-s"></i>&nbsp; ${i}
	</div>
	</inner></box>
	<box col="2" mob="2"><inner class="t-right cl-grey size-m">
	${price}
	</inner></box>
	<box col="3" mob="3"><inner class="t-right" style="opacity:${amout}.5;">
	${amout}
	</inner></box>
	<sp class="px bg-smoke"></sp>
	`
	return txt;
}

function menuPopupClose(){
	calSubmit();
	updateMenuList();
	togglePopup('menu','close');
}

function updateBillPrice(){
	menuPrice = 0;
	for (let i in menus) {
		menuPrice += menus[i].price;
	}
	price_wrap.innerText = menuPrice;
}

function updatePeopleAmout(){
	for (let i in peoples) {
		peoples[i].amout = 0;
	}
	for (let i in menus) {
		for (let p in menus[i].people) {
			let pName = menus[i].people[p];
			peoples[pName].amout += menus[i].amout;
		}
	}
	updatePeopleList();
}

function checkPeoplePayAll(){
	let peoplePayAll = document.querySelectorAll('.people-list');
	let peoplePayAllSize = peoplePayAll.length;
	for (var i = 0;i<peoplePayAllSize;i++) {
		if (peoplePayAll[i].getAttribute('pay') == 0) {
			peoplePayAll[i].click();
		}
	}
}

function renderAll(){
	updateMenuList();
	updatePeopleList();
	updateBillPrice();
	updatePeopleSize();
	updatePeopleMenuList();
	updatePeopleAmout();
}



function pNameToHue(pName){
	pNameSize = pName.length;
	let hue = 0;
	for (var i = 0; i < pNameSize; i++) {
		hue += (pName[i].charCodeAt(0)*38);
	}
	return hue;
}

function addQr(){
	let newSrc = prompt("ระบุเบอร์โทรศัพท์/เลขบัตรประชาชนที่ลงทะเบียน PrompPay");
	if (newSrc === null || newSrc == '') {
		qr_label.innerText = 'Add PrompPay';
		qr_pic.src = `assets/qr.png`;
		localStorage.bill_qr = undefined;

	}
	else{
		qr_label.innerText = newSrc;
		qr_pic.src = `https://promptpay.io/${newSrc}.png`;
		localStorage.bill_qr = newSrc;
	}
}

function clearCache(type){
	if (confirm('คุณยืนยันการล้างหรือไม่')) {
		if (type == 'menu') {
			menus = {};
			lastMenu = '';
		}
		else{
			peoples = {};
			lastPeople = '';
		}
		updateCache();
		renderAll();
	}
	
}

function updateCache(){
	localStorage.bill_menus = JSON.stringify(menus);
	localStorage.bill_peoples = JSON.stringify(peoples);
}

function ready(){
	if (localStorage.bill_peoples != undefined) {
		peoples = JSON.parse(localStorage.bill_peoples)
	}
	if (localStorage.bill_menus != undefined) {
		menus = JSON.parse(localStorage.bill_menus)
	}
	if (localStorage.bill_qr != undefined) {
		qr_label.innerText = localStorage.bill_qr;
		qr_pic.src = `https://promptpay.io/${localStorage.bill_qr}.png`;
	}
	renderAll();
}
ready();