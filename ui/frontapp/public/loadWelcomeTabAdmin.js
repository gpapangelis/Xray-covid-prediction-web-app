async function loadWelcomeTabAdmin(){
    let usr = await askForData('/users/me', 'GET').catch( (err) => {
        alert(err);
    });
    if(!usr){
        return;
    }
    if(!usr.is_superuser){
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


    findUserBtn = makeMenuBtn('findUserBtn', 'fas fa-user', ' Find User');
    
    homepageMenuContainer.appendChild(findUserBtn);
    
    
    const contentContainer = document.createElement('div');
    homepageBodyContainer.appendChild(contentContainer);
    contentContainer.setAttribute('id', 'contentContainer');
    // End - Body Container

    findUserBtn.addEventListener('click', (e) => {
        findUserTab();
    });
}
