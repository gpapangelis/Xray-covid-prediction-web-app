async function loadHomeTab(){
    const usr = await askForData('/users/me', 'GET').catch( (err) => {
        alert('Code: ' + err.status + '\nText: ' + err.statusText);
        loadLoginTab();
    });
    if(!usr){
        return;
    }
    const usrImages = await askForData('/users/me/images', 'GET').catch( (err) => {
        alert('Code: ' + err.status + '\nText: ' + err.statusText);
        loadLoginTab();
    });
    if(!usrImages){
        return;
    }

    // Reconstruct Containers
    const contentContainer = reConstructContainers('Home');
    
    // Build Home Container
    const homeContainer = document.createElement('div');
    contentContainer.appendChild(homeContainer);
    homeContainer.setAttribute('id', 'homeContainer');
    
    // Add Components
    const nameInfo = makeInfo('Name: ', 'fas fa-user', usr.name);
    const emailInfo = makeInfo('Email: ', 'fas fa-envelope', usr.email);
    const numberOfImagesInfo = makeInfo('Number of Images: ', 'fas fa-images', usrImages.length);

    homeContainer.appendChild(nameInfo);
    homeContainer.appendChild(emailInfo);
    homeContainer.appendChild(numberOfImagesInfo);
}

async function loadDownloadTab(){
    
    let listOfImages = await askForData('/users/me/images', 'GET').catch( (err) => {
        alert('Code: ' + err.status + '\nText: ' + err.statusText);
        loadLoginTab();
    });
    if(listOfImages === undefined){
        return;
    }
    // Reconstruct Containers
    const contentContainer = reConstructContainers('Images');

    // Build Images Container
    const imagesContainer = document.createElement('div');
    contentContainer.appendChild(imagesContainer);
    imagesContainer.setAttribute('id', 'imagesContainer');

    // Add Components
    for(let img of listOfImages){
        
        const readyImg = makeImage(img);
        imagesContainer.appendChild(readyImg);
    }
}

async function loadImageSettingsTab(image_id){
    const img = await askForData('/users/me/images/'+image_id, 'GET').catch( (err) => {
        alert('Code: ' + err.status + '\nText: ' + err.statusText);
        loadLoginTab();
    });
    if(!img){
        return;
    }
    const imgID = img.image_id;
    let imgFilename = img.filename;
    if(imgFilename.length>10){
        imgFilename = imgFilename.substring(0, 5)+"..."+imgFilename.substring(imgFilename.length-5, imgFilename.length);
    }
    const imgData = img.image_data;
    let imgModelResult = img.model_result;
    if(!imgModelResult){
        imgModelResult = 'No result';
    }
    
    // Reconstruct Containers
    const contentContainer = reConstructContainers();

    // Build Image Settings Container
    const imageSettingsContainer = document.createElement('div');
    contentContainer.appendChild(imageSettingsContainer);
    imageSettingsContainer.setAttribute('id', 'imageSettingsContainer');
    
    // Add Components
    const imageSettingsInfoContainer = document.createElement('div');
    imageSettingsContainer.appendChild(imageSettingsInfoContainer);
    imageSettingsInfoContainer.setAttribute('id', 'imageSettingsInfoContainer');

    const image = document.createElement('img');
    imageSettingsContainer.appendChild(image)
    image.setAttribute('class', 'base64image');
    image.setAttribute('id', 'base64image');
    image.setAttribute('src', 'data:image/jpeg;base64, '+imgData);

    const imageSettingsEditContainer = document.createElement('div');
    imageSettingsContainer.appendChild(imageSettingsEditContainer);
    imageSettingsEditContainer.setAttribute('id', 'imageSettingsEditContainer');

    const filename = makeInfoImageSettings('filename', imgFilename);
    const imageID = makeInfoImageSettings('image Id', imgID);
    const imageModelResult = makeInfoImageSettings('Image Model Result', imgModelResult);

    imageSettingsInfoContainer.appendChild(filename);
    imageSettingsInfoContainer.appendChild(imageID);
    imageSettingsInfoContainer.appendChild(imageModelResult);

    const getModelResultImageSettingsBtn = makeGeneralBtn('getModelResultImageSettingsBtn',"fas fa-project-diagram", 'Get Result', 'imageSettingsGeneralBtn');
    imageSettingsEditContainer.appendChild(getModelResultImageSettingsBtn);
    const deleteImageSettingsBtn = makeGeneralBtn('deleteImageSettingsBtn',"fas fa-trash-alt", 'Delete', 'imageSettingsGeneralBtn');
    imageSettingsEditContainer.appendChild(deleteImageSettingsBtn);

    getModelResultImageSettingsBtn.addEventListener('click', async (e)=>{
        const imageWithResult = await askForData('/users/me/images/'+imgID+'/result', 'GET').catch( (err) => {
            alert('Code: ' + err.status + '\nText: ' + err.statusText);
            loadLoginTab();
        });
        imageModelResult.textContent = "Image Model Result: "+imageWithResult.model_result;
    });

    deleteImageSettingsBtn.addEventListener('click', async (e)=>{
        const imageDelete = await askForData('/users/me/images/'+imgID, 'DELETE').catch( (err) => {
            alert('Code: ' + err.status + '\nText: ' + err.statusText);
            loadLoginTab();
        });
        if(!imageDelete){
            return;
        }
        loadDownloadTab();
    });

}

async function loadUploadTab(){
    // Reconstruct Containers
    const contentContainer = reConstructContainers('Upload New Image');

    // Build Home Container
    const uploadContainer = document.createElement('div');
    contentContainer.appendChild(uploadContainer);
    uploadContainer.setAttribute('id', 'uploadContainer');

    // <input type="file" id="myFile" name="filename">
    // Add Components
    const btnFileInput = document.createElement('button');
    uploadContainer.appendChild(btnFileInput);
    btnFileInput.setAttribute('id', 'btnFileInput');
    const icon = document.createElement('i');
    btnFileInput.appendChild(icon);
    icon.setAttribute('class', 'fas fa-upload');
    const txtFilenameNode = document.createElement('span');
    btnFileInput.appendChild(txtFilenameNode);
    txtFilenameNode.appendChild(document.createTextNode('Choose an image...'));
    txtFilenameNode.setAttribute('id','txtFilenameNode');
    const icon2 = document.createElement('i');
    btnFileInput.appendChild(icon2);
    icon2.setAttribute('class', 'fas fa-upload');
    const fileInput = document.createElement('input');
    btnFileInput.appendChild(fileInput);
    fileInput.setAttribute('type', 'file');
    fileInput.setAttribute('id', 'fileInput');
    // accept="image/png, image/jpeg">
    fileInput.setAttribute('accept', 'image/*');
    
    fileInput.addEventListener('change', (e) => {
        const theFile = e.target.files[0];
        if (!theFile){
            txtFilenameNode.textContent = 'Choose an image...';
            return;
        }
        let filename = theFile.name;
        if(filename.length>16){
            filename = filename.substring(0, 7)+"..."+filename.substring(filename.length-9, filename.length);
        }
        txtFilenameNode.textContent  = filename;
    });
    btnFileInput.addEventListener('click', (e) => {
        fileInput.click();
    });

    const btnUploadImage = document.createElement('button');
    uploadContainer.appendChild(btnUploadImage);
    btnUploadImage.setAttribute('id', 'btnUploadImage');
    btnUploadImage.appendChild(document.createTextNode('Upload'));
    
    const txtMessageUploadImage = document.createElement('p');
    uploadContainer.appendChild(txtMessageUploadImage);
    txtMessageUploadImage.setAttribute('id', 'txtMessageUploadImage');
    txtMessageUploadImage.setAttribute('class', 'txtMessageUploadImage');
    
    btnUploadImage.addEventListener('click', async (e) => {
        // const file_data = fileInput.files[0]
        // if(!file_data){
        //     return;
        // }

        // let response = await fetch('http://'+IPPORT+'/users/me/images', {
        //     method: 'POST',
        //     headers: {
        //         'Authorization': 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).access_token
        //       },
        //     body: toformdata({'img': file_data})
        // }).then(response => response.json())
        // .then(data => console.log(data)).catch((err) => {console.log('asdadsasdasd' + err)});
        
        const file = fileInput.files[0]
        if(!file){
            return;
        }
        const filename = file.name
        const url = IPPORT+'/users/me/images';
        const async = true;
        const method = "POST";
        const xhr = new XMLHttpRequest ();
        displayLoader();
        xhr.open(method,url,async);

        xhr.setRequestHeader("Authorization", 'Bearer ' + JSON.parse(sessionStorage.getItem('token')).access_token);
        
        xhr.send(toformdata({'img': file}));
        
        xhr.onerror = function() {
            showErrorMessage('txtMessageUploadImage', 'Failure: Couldn\'t Uploaded!');
            removeLoader();
        };
        xhr.onabort = function(){
            showErrorMessage('txtMessageUploadImage', 'Failure: Couldn\'t Uploaded!');
            removeLoader();
        }
        xhr.onload = function(){
            if(xhr.status == 401 || xhr.status==403 || xhr.status==422){
                showErrorMessage('txtMessageUploadImage', 'Failure: Couldn\'t Uploaded!');
            }
            if(xhr.status == 200){
                showSuccessMessage('txtMessageUploadImage', 'Success: Image Uploaded!');
            }
            removeLoader();
            if(xhr.status == 401){
                loadLoginTab();
            }
        }
    });
}

async function loadSettingsTab(){
    
    // Reconstruct Containers
    const contentContainer = reConstructContainers('Settings');

    // Build Home Container
    const settingsContainer = document.createElement('div');
    contentContainer.appendChild(settingsContainer);
    settingsContainer.setAttribute('id', 'settingsContainer');
    settingsContainer.setAttribute('class','settingsContainer signContainer');

    // Add Components
    const txtMessageSettings = document.createElement('p');
    settingsContainer.appendChild(txtMessageSettings);
    txtMessageSettings.appendChild(document.createTextNode(''));
    txtMessageSettings.setAttribute('id', 'txtMessageSettings');
    txtMessageSettings.setAttribute('class','txtMessageSettings txtMessageSign');
    
    const txtFormSettings = document.createElement('form');
    settingsContainer.appendChild(txtFormSettings);
    txtFormSettings.setAttribute('class', 'txtFormSettings signForm');
    txtFormSettings.setAttribute('id', 'txtFormSettings');
    txtFormSettings.setAttribute('action', 'someIP');
    txtFormSettings.setAttribute('method', 'POST');

    const headerTitleVerifySettings = document.createElement('h1');
    txtFormSettings.appendChild(headerTitleVerifySettings);
    headerTitleVerifySettings.setAttribute('id', 'headerTitleVerifySettings');
    headerTitleVerifySettings.setAttribute('class', 'headerTitleVerifySettings signHeader');
    headerTitleVerifySettings.appendChild(document.createTextNode('Identity Verify'));

    const txtInputOldEmailSettings = document.createElement('input');
    txtFormSettings.appendChild(txtInputOldEmailSettings);
    txtInputOldEmailSettings.setAttribute('type','text');
    txtInputOldEmailSettings.setAttribute('id', 'txtInputOldEmailSettings');
    txtInputOldEmailSettings.setAttribute('placeholder', 'example@example.com');
    txtInputOldEmailSettings.setAttribute('class', 'txtInputOldEmailSettings txtInputSign');

    const txtInputOldPasswordSettings = document.createElement('input');
    txtFormSettings.appendChild(txtInputOldPasswordSettings);
    txtInputOldPasswordSettings.setAttribute('type','password');
    txtInputOldPasswordSettings.setAttribute('id', 'txtInputOldPasswordSettings');
    txtInputOldPasswordSettings.setAttribute('placeholder', 'Current Password...');
    txtInputOldPasswordSettings.setAttribute('class', 'txtInputOldPasswordSettings txtInputSign');

    const headerTitleSettings = document.createElement('h1');
    txtFormSettings.appendChild(headerTitleSettings);
    headerTitleSettings.setAttribute('id', 'headerTitleSettings');
    headerTitleSettings.setAttribute('class', 'headerTitleSettings signHeader');
    headerTitleSettings.appendChild(document.createTextNode('Update Account'));

    const txtInputNewEmailSettings = document.createElement('input');
    txtFormSettings.appendChild(txtInputNewEmailSettings);
    txtInputNewEmailSettings.setAttribute('type','text');
    txtInputNewEmailSettings.setAttribute('id', 'txtInputNewEmailSettings');
    txtInputNewEmailSettings.setAttribute('placeholder', '[Optional] new_example@example.com');
    txtInputNewEmailSettings.setAttribute('class', 'txtInputNewEmailSettings txtInputSign');

    const txtInputNewPasswordSettings = document.createElement('input');
    txtFormSettings.appendChild(txtInputNewPasswordSettings);
    txtInputNewPasswordSettings.setAttribute('type','password');
    txtInputNewPasswordSettings.setAttribute('id', 'txtInputNewPasswordSettings');
    txtInputNewPasswordSettings.setAttribute('placeholder', '[Optional] New Password...');
    txtInputNewPasswordSettings.setAttribute('class', 'txtInputNewPasswordSettings txtInputSign');

    const txtInputConfirmPasswordSettings = document.createElement('input');
    txtFormSettings.appendChild(txtInputConfirmPasswordSettings);
    txtInputConfirmPasswordSettings.setAttribute('type','password');
    txtInputConfirmPasswordSettings.setAttribute('id', 'txtInputConfirmPasswordSettings');
    txtInputConfirmPasswordSettings.setAttribute('placeholder', 'Confirm New Password...');
    txtInputConfirmPasswordSettings.setAttribute('class', 'txtInputConfirmPasswordSettings txtInputSign');

    const btnSubmitSettings = document.createElement('input');
    txtFormSettings.appendChild(btnSubmitSettings);
    btnSubmitSettings.setAttribute('type','submit');
    btnSubmitSettings.setAttribute('id', 'btnSubmitSettings');
    btnSubmitSettings.setAttribute('value', 'Submit');
    btnSubmitSettings.setAttribute('class', 'btnSubmitSettings btnSign');

    txtFormSettings.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const oldMail = document.getElementById('txtInputOldEmailSettings').value;
        const newMail = document.getElementById('txtInputNewEmailSettings').value;
        const oldPassword = document.getElementById('txtInputOldPasswordSettings').value;
        const newPassword = document.getElementById('txtInputNewPasswordSettings').value;
        const confirmNewPassword = document.getElementById('txtInputConfirmPasswordSettings').value;

        
        if(!oldMail){
            showErrorMessage('txtMessageSettings', 'Old Email is required!');
            return;
        }
        if(!oldPassword){
            showErrorMessage('txtMessageSettings', 'Old Password is required!');
            return;
        }
        let updateInfo = {'old_email': oldMail, 'old_password': oldPassword}
        if((!newMail) && (!newPassword)){
            showErrorMessage('txtMessageSettings', 'New Mail or New Password or must be set!');
            return;
        }
        if(newMail){
            if(!validateEmail(newMail)){
                showErrorMessage('txtMessageSettings', 'Email is not Valid!');
                return;
            } else {
                updateInfo['new_email'] = newMail;
            }
        }
        if((newPassword) || (confirmNewPassword)){
            if(!(newPassword === confirmNewPassword)) {
                showErrorMessage('txtMessageSettings', 'Password and Confirm Password do not match!');
                return;
            } else {
                updateInfo['new_password'] = newPassword;
            }
        }


        
        const data = await askForData('/users/me/update', 'POST', {'Content-Type':'application/json'}, updateInfo, false).catch((err) => {
            
            if(err.status == 403){
                showErrorMessage('txtMessageSettings', 'Email already exists!');
                return;
            }
            if(err.status == 401){
                showErrorMessage('txtMessageSettings', 'Wrong Email or Password!');
                return;
            }
            showErrorMessage('txtMessageSettings', 'Something went wrong 403!');
            alert('Code: ' + err.status + '\nText: ' + err.statusText);
            return;
        });
        if(!data){
            return;
        }
        showSuccessMessage('txtMessageSettings', 'Personal Data changed successfully!');
        alert('Personal Data changed successfully!\n\nPlease Login again.')
        loadLoginTab();
    });
}

async function findUserTab(){

    // Reconstruct Containers
    const contentContainer = reConstructContainers('Find User');
    
    // Build Home Container
    const findUserContainer = document.createElement('div');
    contentContainer.appendChild(findUserContainer);
    findUserContainer.setAttribute('id', 'findUser');
    
    // Add Components
    const mainPage = document.createElement('div');
    findUserContainer.appendChild(mainPage);
    mainPage.setAttribute('id', 'mainPageID');
    mainPage.setAttribute('class', 'mainPage');

    const divHeaderContainer = document.createElement('div');
    mainPage.appendChild(divHeaderContainer);
    divHeaderContainer.setAttribute('id', 'divHeaderContainer');
    divHeaderContainer.setAttribute('class', 'divHeaderContainer');

    const divMainHeader = document.createElement('div')
    divHeaderContainer.appendChild(divMainHeader);
    divMainHeader.setAttribute('id', 'divMainHeader');
    divMainHeader.setAttribute('class', 'divMainHeader');

    const txtInputSearch=document.createElement('input');
    divMainHeader.appendChild(txtInputSearch);
    txtInputSearch.setAttribute('type', 'text');
    txtInputSearch.setAttribute('id', 'txtInputSearch');
    txtInputSearch.setAttribute('placeholder', 'Search Email...');
    txtInputSearch.setAttribute('class', 'txtInputSearch');

    const divSecondHeader=document.createElement('div');
    divHeaderContainer.appendChild(divSecondHeader);
    divMainHeader.setAttribute('id', 'divSecondHeader');
    divMainHeader.setAttribute('class', 'divSecondHeader');

    const btnGO=document.createElement('input');
    divSecondHeader.appendChild(btnGO)
    btnGO.setAttribute('type', 'button');
    btnGO.setAttribute('id', 'btnGO');
    btnGO.setAttribute('value', 'Go!');
    btnGO.setAttribute('class', 'btnHead');

    const idmailnameSlk = document.createElement('select');
    divSecondHeader.appendChild(idmailnameSlk);
    idmailnameSlk.setAttribute('id', 'idmailnameSlk');
    idmailnameSlk.setAttribute('class', 'selectHead');
    
    const optSelectId = document.createElement('option');
    idmailnameSlk.appendChild(optSelectId);
    optSelectId.setAttribute('id', 'optSelectId');
    optSelectId.setAttribute('value', 'userId');
    optSelectId.appendChild(document.createTextNode('Id'));

    const optSelectEmail = document.createElement('option');
    idmailnameSlk.appendChild(optSelectEmail);
    optSelectEmail.setAttribute('id', 'optSelectEmail');
    optSelectEmail.setAttribute('value', 'email');
    optSelectEmail.appendChild(document.createTextNode('Email'));

    const optSelectName = document.createElement('option');
    idmailnameSlk.appendChild(optSelectName);
    optSelectName.setAttribute('id', 'optSelectName');
    optSelectName.setAttribute('value', 'userName');
    optSelectName.appendChild(document.createTextNode('Name'));


    const divBodyContainer1 = document.createElement('div');
    mainPage.appendChild(divBodyContainer1);
    divBodyContainer1.setAttribute('class', 'divBodyContainer1');
    divBodyContainer1.setAttribute('id', 'divBodyContainer1');

    const divTableContainer = document.createElement('div');
    divBodyContainer1.appendChild(divTableContainer);
    divTableContainer.setAttribute('class', 'divTableContainer');
    divTableContainer.setAttribute('id', 'divTableContainer');

    const divPaginationContainer = document.createElement('div');
    divBodyContainer1.appendChild(divPaginationContainer);
    divPaginationContainer.setAttribute('class', 'divPaginationContainer');
    divPaginationContainer.setAttribute('id', 'divPaginationContainer');

    //    -------->    TODO!!!    <----------
    //  THIS IS FOR FIXME TODO FIX-ME TO-DO 
    let isRunning=false;
    document.getElementById('txtInputSearch').addEventListener('keydown', (e)=>{
        if (e.key === 'Enter') {
          document.getElementById("btnGO").click();
        }
    
    });
    
    document.getElementById('btnGO').addEventListener('click', async (e)=>{
        const txtSearch =document.getElementById('txtInputSearch').value;
        const selectIdMailNameTemp = document.getElementById("idmailnameSlk");
        
        if(isRunning){
            return;
        }
        if(txtSearch.length<1){
            return;
        }
        isRunning=true;
        
        // correct mistakes, null, not found,
        // if all ok then go further....
    
        // Take divTable Container To Place Loading...
        const divTableContainerOLD = document.getElementById('divTableContainer');
    
        // search for old table/pagination divs if != null then remove them
        const oldTableElement = document.getElementById('tableMovies');
        const oldTablePaginationElement = document.getElementById('tablePagination');
        if(oldTableElement != null){
          oldTableElement.remove();
        }
        if(oldTablePaginationElement!=null){
          oldTablePaginationElement.remove();
        }
    
        //    -------->    Start with a Clean html    <----------
        
        
        // create and set text "Loading..." to Table Container
        optionSelectedPath = selectIdMailNameTemp.value;
        if(optionSelectedPath == "userId"){
            optionSelectedPath = optionSelectedPath+"/";
        }else if(optionSelectedPath == "email"){
            optionSelectedPath = selectIdMailNameTemp.value + "/?user_email="
        }else {
            optionSelectedPath = selectIdMailNameTemp.value + "/?user_name="
        }
        //    -------->    Start DATA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    <----------
        
        const usrDATA = await askForData('/users/'+optionSelectedPath+txtSearch, 'GET').catch( (err) => {
            alert('Code: ' + err.status + '\nText: ' + err.statusText);
            isRunning=false;
        });
        if(!usrDATA){
            isRunning=false;
            return;
        }
        
        const arrayOfMovies = usrDATA;
        //    -------->    END DATA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!    <----------

        // TESTTTTTTTTTTTTTTTTTTT
        // arrayOfMovies = []
        // for(let i=1; i<2;i++){
        //     let item = {name:"name_"+i, id:i, email:"mail_"+i+"_mail@mail.com"}
        //     arrayOfMovies.push(item)
        // }
        
        if(arrayOfMovies.length!=0){
            const numberOfrowsAvailableInPage = 5;
            const pages=Math.ceil(arrayOfMovies.length/numberOfrowsAvailableInPage);

            // place a Table without Body                
            placeTableNoBody(pages);
            // Place Body
            placePage(numberOfrowsAvailableInPage,1,arrayOfMovies);
            // Place Pagination Elements IF needed
            if(pages>1){
                placePaginationElements(numberOfrowsAvailableInPage,pages,arrayOfMovies);
            }  
        } else {
            // If there is no results!
            const nomoviesContainer = document.createElement('div');
            const nomoviesTxtNode = document.createTextNode('No matches found. Try a different search ...');
            nomoviesContainer.appendChild(nomoviesTxtNode);
            nomoviesContainer.setAttribute('id','tableMovies');
            divTableContainerOLD.appendChild(nomoviesContainer);
        }
        isRunning=false;
        // Setup everything to send request
    });
}



function placeTableNoBody(pages){

    const divTableContainer = document.getElementById('divTableContainer');
    
    // Create Paginationg IF we have more than 1 pages
    if(pages>1){
        const divPaginationContainer = document.getElementById('divPaginationContainer');
        const tablePagination = document.createElement('div');
        divPaginationContainer.appendChild(tablePagination);
        tablePagination.setAttribute('id','tablePagination');
        tablePagination.setAttribute('class','tablePagination');
    }
  
    // Construct Table
    const table = document.createElement('table');
    table.setAttribute('id','tableMovies');
    table.setAttribute('class','tableMovies');
    // Append Table
    divTableContainer.appendChild(table);
  
    // Construct Table Head
    const tableHeadElement = document.createElement('thead');
    tableHeadElement.setAttribute('id', 'tableMoviesHead');
    tableHeadElement.setAttribute('class', 'tableMoviesHead');       
  
    // Construct Row and Headers for the Table Head and Append them
    const tableRowHeader = document.createElement('tr');
    table.appendChild(tableRowHeader);
    const tableHeaderTitle = document.createElement('th');
    const tableHeaderGenre = document.createElement('th');
    tableRowHeader.appendChild(tableHeaderTitle);
    tableRowHeader.appendChild(tableHeaderGenre);
    tableHeaderTitle.setAttribute('class','tableMoviesHeader');
    tableHeaderGenre.setAttribute('class','tableMoviesHeader');
    // Fill the Header Texts                        ----------> in title and genre or blank1 and 2 we can put headers <----------
    const titleHeader = document.createTextNode('');
    const genreHeader = document.createTextNode('');                
    tableHeaderTitle.appendChild(titleHeader);
    tableHeaderGenre.appendChild(genreHeader);
    // add blank cells for better looking 
    // (resizing problems in table when press a star "button")
    const blank1 = document.createElement('th');
    const blank2 = document.createElement('th');
    tableRowHeader.appendChild(blank1);
    tableRowHeader.appendChild(blank2);
}

function placePage(numberOfrowsAvailableInPage,page,arrayOfMovies){
    // Remove old Body in order to place the next body/page
    const oldTableBody = document.getElementById('tableMoviesBody');
    if(oldTableBody != null){
        oldTableBody.remove();
    }

    // Construct new Table Body and Append it
    const newtableBody = document.createElement('tbody');
    const table = document.getElementById('tableMovies');
    table.appendChild(newtableBody);
    newtableBody.setAttribute('id', 'tableMoviesBody');
    newtableBody.setAttribute('class', 'tableMoviesBody');
    
    // Place new Page of Table... Fill every row with Elements
    for(let i=(page-1)*numberOfrowsAvailableInPage; i<Math.min((page*numberOfrowsAvailableInPage),arrayOfMovies.length);i++){
        
        // Place Row, Table Data (3 cells title, genres, rating stars) 
        // Fill Cells With info from arrayOfMovies From end of previous page To End Of current page
        const tmpRow = document.createElement('tr');
        newtableBody.appendChild(tmpRow);
        
        
        const tmpDataTitle = document.createElement('td');
        const tmpDataGenre = document.createElement('td');
        tmpRow.appendChild(tmpDataTitle);
        tmpRow.appendChild(tmpDataGenre);
        tmpDataTitle.setAttribute('class','titleTD');
        tmpDataGenre.setAttribute('class','genreTD');

        const tmpTextNodeTitle = document.createTextNode(arrayOfMovies[i].user_id)
        const tmpTextNodeGenre = document.createTextNode(arrayOfMovies[i].email)
        tmpDataTitle.appendChild(tmpTextNodeTitle);
        tmpDataGenre.appendChild(tmpTextNodeGenre);
        
        const tmpRating = document.createElement('td');
        tmpRating.setAttribute('class','ratingTD');
        tmpRow.appendChild(tmpRating);


        const tmpDel = document.createElement('td');
        tmpDel.setAttribute('class','submitTD');
        
        tmpRow.appendChild(tmpDel);
        
        // Costruct stars (5-star) 
        // Append class for checked/unchecked (change in event listener)
        // Append Event Listener to take Rating
        // Show a Submit Button in order to submit rating

        adminControlSetAdminBtn = makeMenuBtn('adminControlSetAdminBtn', 'fas fa-user-shield', ' Set Admin');
        adminControlDeleteBtn = makeMenuBtn('adminControlDeleteBtn', 'fas fa-trash-alt', ' Delete');
        tmpRating.appendChild(adminControlSetAdminBtn);
        tmpDel.appendChild(adminControlDeleteBtn);
       
        tmpRating.addEventListener('click', async (e)=>{
            tmpUSRid = tmpDel.parentElement.children[0].textContent;
            if (confirm('Are you sure you want to set user with user_id '+tmpUSRid+' as Admin?')) {
                const userSetAdmin = await askForData('/users/setAdmin/'+tmpUSRid, 'GET').catch( (err) => {
                    alert('Code: ' + err.status + '\nText: ' + err.statusText);
                });
                if(!userSetAdmin){
                    return;
                }
                alert("User with user_id "+tmpUSRid+" is now Admin")
            } else {
                return;
            }
        })

        tmpDel.addEventListener('click', async (e)=>{
            console.log(tmpDel.parentElement);
            
            tmpUSRid = tmpDel.parentElement.children[0].textContent;
            const userDelete = await askForData('/users/'+tmpUSRid, 'DELETE').catch( (err) => {
                alert('Code: ' + err.status + '\nText: ' + err.statusText);
            });
            if(!userDelete){
                return;
            }
            for(let itemIndex=0; itemIndex<arrayOfMovies.length; itemIndex++){
                if ( arrayOfMovies[itemIndex].user_id == tmpUSRid) { 
                    arrayOfMovies.splice(i, 1);
                    break;
                }
            }
            tmpDel.parentElement.remove();
    
            // search for old table/pagination divs if != null then remove them
            const oldTableElementAfterDel = document.getElementById('tableMovies');
            const oldTablePaginationElementAfterDel = document.getElementById('tablePagination');
            if(oldTableElementAfterDel != null){
            oldTableElementAfterDel.remove();
            }
            if(oldTablePaginationElementAfterDel!=null){
            oldTablePaginationElementAfterDel.remove();
            }
            const pagesAfterDel=Math.ceil(arrayOfMovies.length/numberOfrowsAvailableInPage);
            if(arrayOfMovies.length!=0){
                placeTableNoBody(pagesAfterDel);
                placePage(numberOfrowsAvailableInPage,1,arrayOfMovies);
                // Place Pagination Elements IF needed
                if(pagesAfterDel>1){
                    placePaginationElements(numberOfrowsAvailableInPage,pagesAfterDel,arrayOfMovies);
                }
            } else {
                placeTableNoBody(pagesAfterDel);
            }
        });

        // tmpDel.addEventListener('click', async (e)=>{
        //     const data = await askForData('/users/me/update', 'POST', {'Content-Type':'application/json'}, updateInfo, false).catch((err) => {
        //         alert('Code: ' + err.status + '\nText: ' + err.statusText);
        //         return;
        //     });
        //     if(!data){
        //         return;
        //     }
        // })

    }
}

function placePaginationElements(numberOfrowsAvailableInPage,pages,arrayOfMovies){
    const divPaginationContainer = document.getElementById('tablePagination');

    
    // Setup Next and Previous Button, type, id, class, value
    const nextBtn = document.createElement('input');
    const previousBtn = document.createElement('input');
    nextBtn.setAttribute('id','btnNext');
    nextBtn.setAttribute('class','btnNext');
    nextBtn.setAttribute('type','button');
    nextBtn.setAttribute('value','Next');
    previousBtn.setAttribute('id','btnPrevious');
    previousBtn.setAttribute('class','btnPrevious');
    previousBtn.setAttribute('type','button');
    previousBtn.setAttribute('value','previous');

    // Append Button in the correvt order
    divPaginationContainer.appendChild(previousBtn);
    divPaginationContainer.appendChild(nextBtn);

    // Setup label for pages to inform user
    const divLabelContainer = document.createElement('div');
    const spanCurrentPage = document.createElement('span');
    const spanTotalPages = document.createElement('span');
    divLabelContainer.setAttribute('id','lblContainer');
    spanCurrentPage.setAttribute('id','lblCurrentPage');
    spanTotalPages.setAttribute('id','lblTotalPages');

    // Append
    divPaginationContainer.appendChild(divLabelContainer);
    divLabelContainer.appendChild(document.createTextNode('Page: '));
    divLabelContainer.appendChild(spanCurrentPage);
    divLabelContainer.appendChild(document.createTextNode('/'));
    divLabelContainer.appendChild(spanTotalPages);

    // Number first page and total
    const txtCurrentPage = document.createTextNode(1);
    const txtTotalPages = document.createTextNode(pages);
    spanCurrentPage.appendChild(txtCurrentPage);
    spanTotalPages.appendChild(txtTotalPages);

    nextPage(numberOfrowsAvailableInPage,pages,arrayOfMovies);
    previousPage(numberOfrowsAvailableInPage,arrayOfMovies);
}

function nextPage(numberOfrowsAvailableInPage,pages,arrayOfMovies){
    document.getElementById('btnNext').addEventListener('click', (e)=>{
        const currentPageElement = document.getElementById('lblCurrentPage');
        let currentPage = currentPageElement.childNodes[0].textContent;
        if(currentPage<pages){
            currentPage++;
            placePage(numberOfrowsAvailableInPage,currentPage,arrayOfMovies);
            currentPageElement.childNodes[0].nodeValue=currentPage;
        }
    });
}


// ------->    PREVIOUS PAGE   <------------
function previousPage(numberOfrowsAvailableInPage,arrayOfMovies){
    document.getElementById('btnPrevious').addEventListener('click', (e)=>{
        const currentPageElement = document.getElementById('lblCurrentPage');
        let currentPage = currentPageElement.childNodes[0].textContent;
        if(currentPage>1){
            currentPage--;
            placePage(numberOfrowsAvailableInPage,currentPage,arrayOfMovies);
            currentPageElement.childNodes[0].nodeValue=currentPage;
        }
    });
}