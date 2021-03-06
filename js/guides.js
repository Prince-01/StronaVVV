var mainDivId = "resourcesContent";
var resourcessPath = "/../guides/sites/";
// main controller for angular
var app = angular.module('main', []);
app.controller('mainCtrl', function($scope, $http, $sce) {
	$http.get("datafiles/guides.txt").then(function(response) {
		var rawResourcesTable = response.data.split('\n');
		$scope.resourcesTable = [];
		for (var i = 0; i < rawResourcesTable.length; i++) {
			$scope.resourcesTable.push(rawResourcesTable[i].split(';'));
		}
	});
});

function loadSelectedResources() {
	removePreviousContent();
	fillWithNewContent();
}

function removePreviousContent() {
	$("#" + mainDivId).empty();
}

function fillWithNewContent() {
	getFileContent($("#resourcesSelect").val(), prepareNewContent);
}

function getFileContent(fileName, callback) {
	console.log(document.URL + resourcessPath + fileName);
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", document.URL + resourcessPath + fileName, true);
	xmlHttp.send(null);
}

function prepareNewContent(rawText) {
	var rawRows = rawText.split("\n");
	var contentSection = $("#" + mainDivId);
	for (var i = 0; i < rawRows.length; i++) {
		contentSection.append(processRow(rawRows[i]));
	}
	setHeightForVideos();
}

function processRow(rowText) {
	var rowTab = rowText.split(";");
	rowTab.push("");
	switch (rowTab[0]) {
	case 'title':
		return processTitle(rowTab);
	case 'stitle':
		return processSectionTitle(rowTab);
	case 'text':
		return processText(rowTab);
	case 'table':
		return processTable(rowTab);
	case 'img':
		return processImage(rowTab);
	case 'video':
		return processVideo(rowTab);
	case 'autor':
		return processAuthor(rowTab);
	default:
		console.log("tag is not recognized: " + rowTab[0]);
		return null;
	}
}
function processText(rowTab) {
	var sectionText = document.createElement("section");
	sectionText.className = "resourcesText "+rowTab[2];
	sectionText.innerHTML = rowTab[1];
	return sectionText;
}
function processTitle(rowTab) {
	var sectionTitle = document.createElement("section");
	sectionTitle.className = "resourcesTitle "+rowTab[2];
	sectionTitle.innerHTML = rowTab[1];
	return sectionTitle;
}
function processSectionTitle(rowTab) {
	var sectionTitle = document.createElement("section");
	sectionTitle.className = "resourcesSectionTitle "+rowTab[2];
	sectionTitle.innerHTML = rowTab[1];
	return sectionTitle;
}
function processAuthor(rowTab) {
	var sectionTitle = document.createElement("section");
	sectionTitle.className = "resourcesAuthor "+rowTab[2];
	sectionTitle.innerHTML = rowTab[1];
	return sectionTitle;
}
function processImage(rowTab) {
	var section = document.createElement("section");
	section.className = "resourcesImage "+rowTab[4];
	var image = document.createElement("img");
	image.style.width = rowTab[1];
	image.style.height = rowTab[2];
	image.src = rowTab[3];
	section.append(image);
	return section;
}
function processVideo(rowTab) {
	var section = document.createElement("section");
	section.className = "resourcesVideo "+rowTab[4];
	var video = document.createElement("iframe");
	video.style.width = rowTab[1];
	video.style.height = rowTab[2];
	video.src = rowTab[3].replace("watch?v=", "embed/");
	video.allowfullscreen = true;
	section.append(video);
	return section;
}
// table;kol1|kol2|kol3;kol1|kol2|kol3
function processTable(rowTab) {
	var table = document.createElement("table");
	table.className = "resourcesTable";

	for (var i = 1; i < rowTab.length-1; i++) {
		var tableRow = document.createElement("tr");
		var tableCells = rowTab[i].split("|");
		for (var j = 0; j < tableCells.length; j++) {
			tableRow.append(processSingleCell(tableCells[j],document.createElement("td")));
		}
		table.append(tableRow);
	}
	return table;
}
//args 0-th|td,1-colspan
function processSingleCell(cell, td) {

	if (cell.startsWith("<")) {
		var indexEnd = cell.indexOf(">");
		var args = cell.substring(1, indexEnd).split(",");
		if (args.length > 0) {
			td = document.createElement(args[0]);
		}
		if (args.length > 1) {
			td.setAttribute("colspan", args[1]);
		}
		cell = cell.substring(indexEnd + 1);
	}
	td.innerHTML = cell;
	return td;
}
function setHeightForVideos() {
	var videos = document.querySelectorAll(".resourcesVideo");
	for (i = 0; i < videos.length; i++) {
		videos[i].childNodes[0].style.height = (videos[i].offsetWidth * 9 / 16) + "px";
	}

}