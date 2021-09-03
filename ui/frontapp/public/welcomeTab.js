async function loadWelcomeTab(){
    let usr = await askForData('/users/me', 'GET').catch( (err) => {
        alert(err);
    });
    if(!usr){
        return;
    }
    if(usr.is_superuser){
        loadWelcomeTabAdmin();
        return
    }
    
    const formsContainer = document.getElementById("formsContainer");
    formsContainer.remove();

    const body = document.getElementsByTagName("BODY")[0];
    const homepageMainContainer = document.createElement('div');
    body.appendChild(homepageMainContainer);
    homepageMainContainer.setAttribute('id', 'homepageMainContainer');
    
    // Start - Header Container
    const homepageHeaderContainer = document.createElement('div');
    homepageMainContainer.appendChild(homepageHeaderContainer);
    homepageHeaderContainer.setAttribute('id', 'homepageHeaderContainer');
    // Here we add user's name.
    const homepageNavHeader = document.createElement('h1');
    homepageHeaderContainer.appendChild(homepageNavHeader);
    homepageNavHeader.setAttribute('id', 'homepageNavHeader');
    homepageNavHeader.appendChild(document.createTextNode('Welcome! '+  usr.name));
    // End - Header Container

    // Start - Body Container
    const homepageBodyContainer = document.createElement('div');
    homepageMainContainer.appendChild(homepageBodyContainer);
    homepageBodyContainer.setAttribute('id', 'homepageBodyContainer');
    const homepageMenuContainer = document.createElement('div');
    homepageBodyContainer.appendChild(homepageMenuContainer);
    homepageMenuContainer.setAttribute('id', 'homepageMenuContainer')
    homeBtn = makeMenuBtn('homeBtn', 'fas fa-home', ' Home');
    downloadBtn = makeMenuBtn('downloadBtn', 'fas fa-cloud-download-alt', ' Images');
    uploadBtn = makeMenuBtn('uploadBtn', 'fas fa-cloud-upload-alt', ' Upload new Image');
    settingsBtn = makeMenuBtn('settingsBtn', 'fas fa-cog', ' Settings');
    homepageMenuContainer.appendChild(homeBtn);
    homepageMenuContainer.appendChild(downloadBtn);
    homepageMenuContainer.appendChild(uploadBtn);
    homepageMenuContainer.appendChild(settingsBtn);
    
    const contentContainer = document.createElement('div');
    homepageBodyContainer.appendChild(contentContainer);
    contentContainer.setAttribute('id', 'contentContainer');
    // End - Body Container

    addListenersToMenuBtns();
}
