/* 
 --- Tristate Checkbox ---
v 0.9.1 18th Dec 2008
By Shams Mahmood
http://shamsmi.blogspot.com 
*/

var STATE_NONE = 0;
var STATE_SOME = 1;
var STATE_ALL = 2;

var UNCHECKED_NORM = 'UNCHECKED_NORM';
var UNCHECKED_HILI = 'UNCHECKED_HILI';
var INTERMEDIATE_NORM = 'INTERMEDIATE_NORM';
var INTERMEDIATE_HILI = 'INTERMEDIATE_HILI';
var CHECKED_NORM = 'CHECKED_NORM';
var CHECKED_HILI = 'CHECKED_HILI';

var DEFAULT_CONFIG = {
	UNCHECKED_NORM : 'http://lh6.ggpht.com/_c_AszxFWLLs/SUrdffHaeiI/AAAAAAAACkw/uXPxlSq7ZME/s144/unchecked.gif',
	UNCHECKED_HILI : 'http://lh4.ggpht.com/_c_AszxFWLLs/SUrdfZ1ojEI/AAAAAAAACk4/5YVi4rip30A/s144/unchecked_highlighted.gif',
	INTERMEDIATE_NORM : 'http://lh5.ggpht.com/_c_AszxFWLLs/SUrdbwoLc0I/AAAAAAAACkg/SvmbPidI2-o/s144/intermediate.gif',
	INTERMEDIATE_HILI : 'http://lh5.ggpht.com/_c_AszxFWLLs/SUrdbwtXDOI/AAAAAAAACko/82v692p5tno/s144/intermediate_highlighted.gif',
	CHECKED_NORM : 'http://lh3.ggpht.com/_c_AszxFWLLs/SUrdbiLuQCI/AAAAAAAACkQ/faUYorb0WT8/s144/checked.gif',
	CHECKED_HILI : 'http://lh4.ggpht.com/_c_AszxFWLLs/SUrdb6se_WI/AAAAAAAACkY/Khw5XhX0T5Y/s144/checked_highlighted.gif'
};

function getNextStateFromValue(theValue) {
	if (theValue == STATE_SOME) { return STATE_ALL; }
	if (theValue == STATE_ALL) { return STATE_NONE; }
	return STATE_SOME;
}
function getStateFromValue(theValue, highlightedState) {
	if (theValue == STATE_SOME) { return (!highlightedState) ? INTERMEDIATE_NORM : INTERMEDIATE_HILI; }
	if (theValue == STATE_ALL) { return (!highlightedState) ? CHECKED_NORM : CHECKED_HILI; }
	return (!highlightedState) ? UNCHECKED_NORM : UNCHECKED_HILI;
}

function getFieldAndContainerIds(imageId) {
	var triStateBoxId = imageId.substring(0, imageId.length - '.Img'.length);
	var triStateBoxFieldId = document.getElementById(triStateBoxId + '.Field').value;
	var triStateBoxContainerNodeId = document.getElementById(triStateBoxId + '.Container').value;
	return [triStateBoxFieldId, triStateBoxContainerNodeId];
}

function getAllCheckboxesInContainer(triStateBoxContainerNodeId) {
	var triStateBoxContainerNode = document.getElementById(triStateBoxContainerNodeId);
	var inputElements = triStateBoxContainerNode.getElementsByTagName('input');
	var checkboxes = new Array();
	var index = 0;
	
	for (var x = 0; x < inputElements.length; x++) {
		var loopElement = inputElements[x];
		if (loopElement.type == 'checkbox') {
			checkboxes[index++] = loopElement;
		}
	}
	
	return checkboxes;
}
function selectOrUnselectBoxes(checkBoxes, selectBoxes) {
	for (var x in checkBoxes) {
		checkBoxes[x].checked = selectBoxes;
	}
}
function areAllBoxesInGivenCheckedState(checkBoxes, boxesSelected) {
	var result = true;
	for (var x = 0; x < checkBoxes.length; x++) {
		if (checkBoxes[x].checked != boxesSelected) {
			result = false;
			break;
		}
	}
	return result;
}

function replaceImage(imageId, imageSrc) {
	var image = document.getElementById(imageId);
	if (image.src != imageSrc) {
		image.src = imageSrc;
	}
}
function mouseOverOutOfImageFunction(imageId, mouseOverMode) {
	
	var fieldAndContainerIds = getFieldAndContainerIds(imageId);
	var triStateBoxField = document.getElementById(fieldAndContainerIds[0]);
	
	var currentState = getStateFromValue(triStateBoxField.value, mouseOverMode);
	return DEFAULT_CONFIG[currentState];
}
function onMouseOverImageFnc(imageId) {
	return function() {
		var imageSrc = mouseOverOutOfImageFunction(imageId, true);
		replaceImage(imageId, imageSrc)
	};
}
function onMouseOutImageFnc(imageId) { 
	return function() {
		var imageSrc = mouseOverOutOfImageFunction(imageId, false);
		replaceImage(imageId, imageSrc)
	};
}
function onTristateImageClickFnc(imageId) {
	return function() {
		var fieldAndContainerIds = getFieldAndContainerIds(imageId);
		var triStateBoxField = document.getElementById(fieldAndContainerIds[0]);
		
		var nextState = getNextStateFromValue(triStateBoxField.value);
		if (nextState == STATE_SOME) {
			nextState = getNextStateFromValue(nextState);
		}
		triStateBoxField.value = nextState;
		
		var allTheCheckboxes = getAllCheckboxesInContainer(fieldAndContainerIds[1]);
		selectOrUnselectBoxes(allTheCheckboxes, nextState == STATE_ALL);
		
		var imageSrc = mouseOverOutOfImageFunction(imageId, true);
		replaceImage(imageId, imageSrc)
	}
}
function onCheckboxClickFnc(imageId, checkBoxId) {
	return function() {
		var fieldAndContainerIds = getFieldAndContainerIds(imageId);
		var allTheCheckboxes = getAllCheckboxesInContainer(fieldAndContainerIds[1]);
		
		var triStateBoxField = document.getElementById(fieldAndContainerIds[0]);
		updateStateAndImage(allTheCheckboxes, triStateBoxField, imageId)
	}
}

function updateStateAndImage(allTheCheckboxes, triStateBoxField, imageId) {
	var allBoxesSelected = areAllBoxesInGivenCheckedState(allTheCheckboxes, true);
	var allBoxesUnselected = areAllBoxesInGivenCheckedState(allTheCheckboxes, false);
	
	if (allBoxesSelected) {
		triStateBoxField.value = STATE_ALL;
	} else if (allBoxesUnselected) {
		triStateBoxField.value = STATE_NONE;
	} else {
		triStateBoxField.value = STATE_SOME;
	}
	var imageSrc = mouseOverOutOfImageFunction(imageId, false);
	replaceImage(imageId, imageSrc);
}

function initTriStateCheckBox(triStateBoxId, triStateBoxContainerId) {

	var triStateBoxNode = document.getElementById(triStateBoxId);
	
	var triStateBoxFieldId = triStateBoxId + 'Value';
	
	var triStateBoxTextNode = triStateBoxNode.childNodes[0];
	triStateBoxNode.removeChild(triStateBoxTextNode);
	
	var triStateBoxField = document.createElement("input");
	triStateBoxField.id = triStateBoxFieldId;
	triStateBoxField.type = 'hidden';
	triStateBoxField.value = STATE_NONE;
	triStateBoxNode.appendChild(triStateBoxField);
	
	var imageNode = new Image();
	imageNode.id = triStateBoxId + '.Img';
	imageNode.src = DEFAULT_CONFIG[UNCHECKED_NORM];
	triStateBoxNode.appendChild(imageNode);
	if (triStateBoxNode.addEventListener) {
        triStateBoxNode.addEventListener('mouseover', onMouseOverImageFnc(imageNode.id), false);
		triStateBoxNode.addEventListener('mouseout', onMouseOutImageFnc(imageNode.id), false);
		triStateBoxNode.addEventListener('click', onTristateImageClickFnc(imageNode.id), false);
	} else if (triStateBoxNode.attachEvent) {
		triStateBoxNode.attachEvent('onmouseover', onMouseOverImageFnc(imageNode.id));
		triStateBoxNode.attachEvent('onmouseout', onMouseOutImageFnc(imageNode.id));
		triStateBoxNode.attachEvent('onclick', onTristateImageClickFnc(imageNode.id));
	}
	
	var fieldNode = document.createElement("input");
	fieldNode.id = triStateBoxId + '.Field';
	fieldNode.type = 'hidden';
	fieldNode.value = triStateBoxFieldId;
	triStateBoxNode.appendChild(fieldNode);
	
	var containerNode = document.createElement("input");
	containerNode.id = triStateBoxId + '.Container';
	containerNode.type = 'hidden';
	containerNode.value = triStateBoxContainerId;
	triStateBoxNode.appendChild(containerNode);
	
	triStateBoxNode.appendChild(triStateBoxTextNode);
	
	var allTheCheckboxes = getAllCheckboxesInContainer(triStateBoxContainerId);
	for (var x in allTheCheckboxes) {
		var loopCheckBox = allTheCheckboxes[x];
		if (loopCheckBox.addEventListener) {
	        loopCheckBox.addEventListener('click', onCheckboxClickFnc(imageNode.id, loopCheckBox.id), false);
		} else if (loopCheckBox.attachEvent) {
			loopCheckBox.attachEvent('onclick', onCheckboxClickFnc(imageNode.id, loopCheckBox.id));
		}
	}
	
	updateStateAndImage(allTheCheckboxes, triStateBoxField, imageNode.id);
}
