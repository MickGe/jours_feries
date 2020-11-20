const urlAPI = "https://calendrier.api.gouv.fr/jours-feries/";
const zones = [
	"alsace - moselle",
	"guadeloupe",
	"guyane",
	"la - reunion",
	"martinique",
	"mayotte",
	"metropole",
	"nouvelle - caledonie",
	"polynesie - francaise",
	"saint - barthelemy",
	"saint - martin",
	"saint - pierre - et - miquelon",
	"wallis - et - futuna",
];
const defaultZoneId = 6;
let today = formatToday(new Date());
let nextDayOff = "bah là... je ne trouve pas !";
let daysOffSorted;

async function fetchDatas(zoneId = defaultZoneId, yearSearch = null) {
	const urlToGet = yearSearch
		? urlAPI.concat(zones[zoneId], "/", yearSearch.toString(), ".json")
		: urlAPI.concat(zones[zoneId], ".json");
	try {
		let result = await fetch(urlToGet);
		return result.json();
	} catch (error) {
		console.error(error);
	}
}

function formatToday(day) {
	return `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`;
}

async function findNextDay() {
	await main();
	for (const row of daysOffSorted) {
		if (today <= row[0]) {
			nextDayOff = row[1];
			return;
		} else nextDayOff = "bah là... je ne trouve pas !";
	}
}

async function main() {
	const result = await fetchDatas(undefined, undefined);
	daysOffSorted = Object.entries(result).sort();
}

async function changeToday(event = undefined) {
	today = event ? event.target.value : today;
	await findNextDay();
	document.getElementById("dayOff").innerHTML = nextDayOff;
}

function checkDocumentReady(callbackFunction) {
	if (document.readyState != "loading") callbackFunction();
	else document.addEventListener("DOMContentLoaded", callbackFunction);
}
checkDocumentReady(() => {
	const dateSelector = document.getElementById("dateSelector");
	dateSelector.value = today;
	dateSelector.addEventListener("change", changeToday);
	changeToday();
});
