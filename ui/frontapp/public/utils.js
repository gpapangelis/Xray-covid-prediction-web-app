function showErrorMessage(elementId, message){
    const msgElement = document.getElementById(elementId);
    if(msgElement.hasAttribute('style')){
        msgElement.removeAttribute('style');
    }
    msgElement.setAttribute('style', 'color: rgb(255, 88, 88);');
    msgElement.textContent = message
}

function showWarningMessage(elementId, message){
    const msgElement = document.getElementById(elementId);
    if(msgElement.hasAttribute('style')){
        msgElement.removeAttribute('style');
    }
    msgElement.setAttribute('style', 'color: rgb(255, 188, 88);');
    msgElement.textContent = message
}

function showSuccessMessage(elementId, message){
    const msgElement = document.getElementById(elementId);
    if(msgElement.hasAttribute('style')){
        msgElement.removeAttribute('style');
    }
    msgElement.setAttribute('style', 'color: rgb(24, 196, 150);');
    msgElement.textContent = message
}

// Accept email in the form of __@__._ no other forms
function validateEmail(email){
    const regExpression = /\S+@\S+\.\S+/;
    return regExpression.test(email)
}

function toformdata(jsonData){
    let form_data = new FormData();
    for (let key in jsonData) {
        form_data.append(key, jsonData[key]);
    }
    return form_data;
}

function saveToken(token){

    try{
        if(sessionStorage.getItem('token')){
            sessionStorage.removeItem('token');
            sessionStorage.setItem("token", token);
        } else{
            sessionStorage.setItem("token", token);
        }
        return true;
    } catch (error){
        alert(error);
        alert('Try again or Restart');
        return false;
    }
}

// headers = {} (dictionary/JSON), requestbody = {} JSON. in order to read it. 
// headers = JSON = Key=Header  Value=HeaderValue eg. {'Content-Type':'application/json', 'other header': 'value of header'}
// requestBody = JSON eg. {"name": "abc", "password": 1234}
function askForData(endpoint, httpmethod, headers, requestBody, form_data) {
    return new Promise(function(resolve, reject) {
        const url = IPPORT+endpoint;
        const async = true;
        const method = httpmethod;
        const xhr = new XMLHttpRequest ();
        displayLoader();
        xhr.open(method,url,async);
        const txtLoader = document.getElementById('percentageLoading');
        xhr.setRequestHeader("Authorization", 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).access_token);
        if(headers){
            for(key in headers){
                xhr.setRequestHeader(key, headers[key]);
            }
        }
        if(form_data){
            xhr.send(toformdata({'username': txtUsername, 'password': txtPassword}));
        } else {
            if(requestBody){
                xhr.send(JSON.stringify(requestBody));
            } else {
                xhr.send();
            }
        }
        
        
        xhr.onload = function() {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({status: xhr.status, statusText: xhr.statusText});
            }
            removeLoader();
        };
        xhr.onerror = function() {
            removeLoader();
            reject({status: xhr.status, statusText: xhr.statusText});
        };
        xhr.onprogress = function(e) {
            txtLoader.textContent = Math.round((e.loaded / e.total) * 100) + "%";
        };
    });
}

function reConstructContainers(tab){
    // Set Header Nav
    const homepageNavHeader = document.getElementById('homepageNavHeader');
    homepageNavHeader.textContent = tab;

    // Delete previous Content Container
    const oldContentContainer = document.getElementById('contentContainer');
    oldContentContainer.remove();

    // Add new Content Container (to display Home) and Add it to homepageBodyContainer
    const homepageBodyContainer = document.getElementById('homepageBodyContainer');
    const contentContainer = document.createElement('div');
    homepageBodyContainer.appendChild(contentContainer);
    contentContainer.setAttribute('id', 'contentContainer');

    return contentContainer;
}

function makeMenuBtn(btnId, btnIcon, txtNode){
    const btn = document.createElement('button');
    btn.setAttribute('class', 'menuBtn');
    btn.setAttribute('id', btnId);
    const icon = document.createElement('i');
    btn.appendChild(icon);
    icon.setAttribute('class', btnIcon)
    btn.appendChild(document.createTextNode(txtNode));
    return btn;
}

function makeGeneralBtn(btnId, btnIcon, txtNode, btnClass){
    const btn = document.createElement('button');
    btn.setAttribute('class', btnClass);
    btn.setAttribute('id', btnId);
    const icon = document.createElement('i');
    btn.appendChild(icon);
    icon.setAttribute('class', btnIcon)
    btn.appendChild(document.createTextNode(txtNode));
    return btn;
}

function makeInfo(usrLabel, labelIcon, usrInfo){
    const userInfoHomeTabContainer = document.createElement('div');
    userInfoHomeTabContainer.setAttribute('class', 'userInfoHomeTabContainer');
    
    const label = document.createElement('span');
    const icon = document.createElement('i');
    label.appendChild(icon);
    icon.setAttribute('class', 'labelIcon ' + labelIcon);
    label.setAttribute('class', 'userInfoHomeTab userInfoHomeTabLabels');
    label.appendChild(document.createTextNode(usrLabel));

    const info = document.createElement('span');
    info.setAttribute('class', 'userInfoHomeTab userInfoHomeTabInfos');
    info.appendChild(document.createTextNode(usrInfo));

    userInfoHomeTabContainer.appendChild(label);
    userInfoHomeTabContainer.appendChild(info);
    return userInfoHomeTabContainer;
}

function makeInfoImageSettings(label, info){
    const infoElement = document.createElement('span');
    infoElement.appendChild(document.createTextNode(label + ': '+ info));
    infoElement.setAttribute('id', 'imageSettings'+label);
    infoElement.setAttribute('class', 'imageSettingsInfo');
    return infoElement;
}

function makeImage(img){
    const image = document.createElement('img');
    
    image.setAttribute('class', 'imageThumbnail');
    let tempTXT = 'imageThumbnail: '+img.filename;
    if(tempTXT.length>50){
        tempTXT = tempTXT.substring(0, 50)+"...";
    }
    image.setAttribute('id', tempTXT);
    image.setAttribute('src', 'data:image/jpeg;base64, '+img.image_data)

    const imageThumbnailContainer = document.createElement('div');
    imageThumbnailContainer.setAttribute('class', 'imageThumbnailContainer');
    imageThumbnailContainer.appendChild(image);
    const imageThumbnailLabel = document.createElement('p');
    imageThumbnailLabel.appendChild(document.createTextNode(image.id));
    imageThumbnailContainer.appendChild(imageThumbnailLabel);
    imageThumbnailLabel.setAttribute('class', 'imageThumbnailLabel');
    const imageThumbnailButton = document.createElement('button');
    imageThumbnailContainer.appendChild(imageThumbnailButton);
    imageThumbnailButton.setAttribute('class', 'imageThumbnailButton');
    const icon = document.createElement('i');
    imageThumbnailButton.appendChild(icon);
    icon.setAttribute('class', 'fas fa-tools');

    imageThumbnailContainer.addEventListener('mouseenter', (e) => {
        imageThumbnailButton.setAttribute('style','visibility: visible;');
    });
    imageThumbnailContainer.addEventListener('mouseleave', (e) => {
        imageThumbnailButton.removeAttribute('style');
    });
    imageThumbnailButton.addEventListener('click', (e) => {
        loadImageSettingsTab(img.image_id);
    });
    return imageThumbnailContainer;
}



function addListenersToMenuBtns(){
    document.getElementById('homeBtn').addEventListener('click', (e) => {
        loadHomeTab();
    });
    document.getElementById('downloadBtn').addEventListener('click', (e) => {
        loadDownloadTab();
    });
    document.getElementById('uploadBtn').addEventListener('click', (e) => {
        loadUploadTab();
    });
    document.getElementById('settingsBtn').addEventListener('click', (e) => {
        loadSettingsTab();
    });
}