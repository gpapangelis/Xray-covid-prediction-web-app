
window.addEventListener('load',(e) => {
    document.getElementById('loginForm').addEventListener('submit', (e)=>{
        e.preventDefault();
        const txtUsername = document.getElementById('txtInputEmailLogin').value;
        const txtPassword = document.getElementById('txtInputPasswordLogin').value;
        if(!txtUsername){
            showErrorMessage('txtMessageLogin', 'Email is required!');
            return;
        }
        if(!validateEmail(txtUsername)){
            showErrorMessage('txtMessageLogin', 'Email is not Valid!');
            return;
        }
        if(!txtPassword){
            showErrorMessage('txtMessageLogin', 'Password is required!');
            return;
        }
        const url = IPPORT+'/login';
        const async = true;
        const method = "POST";
        const xhr = new XMLHttpRequest ();
        displayLoader();
        xhr.open(method,url,async);
        xhr.send(toformdata({'username': txtUsername, 'password': txtPassword}));
        
        xhr.onerror = function() {
            showErrorMessage('txtMessageLogin', 'Error in Connection');
            removeLoader();
        };
        xhr.onabort = function(){
            removeLoader();
        }
        xhr.onload = function(){
            if(xhr.status == 401 || xhr.status==403){
                showErrorMessage('txtMessageLogin', 'Incorrect Email or Password!');
            }
            if(xhr.status == 200){
                if(saveToken(xhr.responseText)){
                    loadWelcomeTab();
                     
                }
            }
            removeLoader();
        }
    });

    document.getElementById('registerForm').addEventListener('submit', (e)=>{
        e.preventDefault();
        const txtName = document.getElementById('txtInputNameRegister').value;
        const txtUsername = document.getElementById('txtInputEmailRegister').value;
        const txtPassword = document.getElementById('txtInputPasswordRegister').value;
        const txtConfirmPassword = document.getElementById('txtInputConfirmPasswordRegister').value;
        if(!txtName){
            showErrorMessage('txtMessageRegister', 'Name is required!');
            return;
        }
        if(!txtUsername){
            showErrorMessage('txtMessageRegister', 'Email is required!');
            return;
        }
        if(!validateEmail(txtUsername)){
            showErrorMessage('txtMessageRegister', 'Email is not Valid!');
            return;
        }
        if(!txtPassword){
            showErrorMessage('txtMessageRegister', 'Password is required!');
            return;
        }
        if(!txtConfirmPassword){
            showErrorMessage('txtMessageRegister', 'Confirm Password is required!');
            return;
        }
        if(!(txtConfirmPassword === txtPassword)) {
            showErrorMessage('txtMessageRegister', 'Password and Confirm Password do not match!');
            return;
        }
        
        const url = IPPORT+'/register';
        const async = true;
        const method = "POST";
        const xhr = new XMLHttpRequest ();
        displayLoader();
        xhr.open(method,url,async);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({'name':txtName, 'email':txtUsername, 'password':txtPassword}));
        xhr.onerror = function() {
            showErrorMessage('txtMessageLogin', 'Error in Connection');
            removeLoader();
        };
        xhr.onabort = function(){
            removeLoader();
        }
        xhr.onload = function(){
            if(xhr.status==403){
                showErrorMessage('txtMessageRegister', 'Email Already Exists!')
            }
            if(xhr.status == 200){
                if(saveToken(xhr.responseText)){
                    showSuccessMessage('txtMessageRegister', 'Success!');
                }
                document.getElementById('txtInputNameRegister').value = '';
                document.getElementById('txtInputEmailRegister').value = '';
                document.getElementById('txtInputPasswordRegister').value = '';
                document.getElementById('txtInputConfirmPasswordRegister').value = '';
            }
            removeLoader();
        }
    });
});

function loadLoginTab(){
    const oldFormsContainer = document.getElementById("formsContainer");
    if(oldFormsContainer){
        return;
    }
    const homepageMainContainer = document.getElementById("homepageMainContainer");
    homepageMainContainer.remove();

    const body = document.getElementsByTagName("BODY")[0];

    const formsContainer = document.createElement('div');
    body.appendChild(formsContainer);
    formsContainer.setAttribute('id', 'formsContainer');

    const loginContainer = document.createElement('div');
    formsContainer.appendChild(loginContainer);
    loginContainer.setAttribute('id', 'loginContainer');
    loginContainer.setAttribute('class', 'signContainer');

    const registerContainer = document.createElement('div');
    formsContainer.appendChild(registerContainer);
    registerContainer.setAttribute('id', 'registerContainer');
    registerContainer.setAttribute('class', 'signContainer');

    const txtMessageLogin = document.createElement('p');
    loginContainer.appendChild(txtMessageLogin);
    txtMessageLogin.setAttribute('id', 'txtMessageLogin');
    txtMessageLogin.setAttribute('class', 'txtMessageSign');
    const loginForm = document.createElement('form');
    loginContainer.appendChild(loginForm);
    loginForm.setAttribute('id', 'loginForm');
    loginForm.setAttribute('class', 'signForm');

    const txtMessageRegister = document.createElement('p');
    registerContainer.appendChild(txtMessageRegister);
    txtMessageRegister.setAttribute('id', 'txtMessageRegister');
    txtMessageRegister.setAttribute('class', 'txtMessageSign');
    const registerForm = document.createElement('form');
    registerContainer.appendChild(registerForm);
    registerForm.setAttribute('id', 'registerForm');
    registerForm.setAttribute('class', 'signForm');

    const headerTitleLogin = document.createElement('h1');
    loginForm.appendChild(headerTitleLogin);
    headerTitleLogin.setAttribute('id', 'headerTitleLogin');
    headerTitleLogin.setAttribute('class', 'signHeader');
    headerTitleLogin.appendChild(document.createTextNode('Login'));
    const txtInputEmailLogin = document.createElement('input');
    loginForm.appendChild(txtInputEmailLogin);
    txtInputEmailLogin.setAttribute('id', 'txtInputEmailLogin');
    txtInputEmailLogin.setAttribute('type', 'text');
    txtInputEmailLogin.setAttribute('placeholder', 'example@example.com');
    txtInputEmailLogin.setAttribute('class', 'txtInputSign txtInputLogin');
    const txtInputPasswordLogin = document.createElement('input');
    loginForm.appendChild(txtInputPasswordLogin);
    txtInputPasswordLogin.setAttribute('id', 'txtInputPasswordLogin');
    txtInputPasswordLogin.setAttribute('type', 'password');
    txtInputPasswordLogin.setAttribute('placeholder', 'Password...');
    txtInputPasswordLogin.setAttribute('class', 'txtInputSign txtInputLogin');
    const btnLogin = document.createElement('input');
    loginForm.appendChild(btnLogin);
    btnLogin.setAttribute('id', 'btnLogin');
    btnLogin.setAttribute('type', 'submit');
    btnLogin.setAttribute('value', 'Login');
    btnLogin.setAttribute('class', 'btnSign');

    const headerTitleRegister = document.createElement('h1');
    registerForm.appendChild(headerTitleRegister);
    headerTitleRegister.setAttribute('id', 'headerTitleRegister');
    headerTitleRegister.setAttribute('class', 'signHeader');
    headerTitleRegister.appendChild(document.createTextNode('Register'));
    const txtInputNameRegister = document.createElement('input');
    registerForm.appendChild(txtInputNameRegister);
    txtInputNameRegister.setAttribute('id', 'txtInputNameRegister');
    txtInputNameRegister.setAttribute('type', 'text');
    txtInputNameRegister.setAttribute('placeholder', 'Name...');
    txtInputNameRegister.setAttribute('class', 'txtInputSign txtInputRegister');
    const txtInputEmailRegister = document.createElement('input');
    registerForm.appendChild(txtInputEmailRegister);
    txtInputEmailRegister.setAttribute('id', 'txtInputEmailRegister');
    txtInputEmailRegister.setAttribute('type', 'text');
    txtInputEmailRegister.setAttribute('placeholder', 'example@example.com');
    txtInputEmailRegister.setAttribute('class', 'txtInputSign txtInputRegister');
    const txtInputPasswordRegister = document.createElement('input');
    registerForm.appendChild(txtInputPasswordRegister);
    txtInputPasswordRegister.setAttribute('id', 'txtInputPasswordRegister');
    txtInputPasswordRegister.setAttribute('type', 'password');
    txtInputPasswordRegister.setAttribute('placeholder', 'Password...');
    txtInputPasswordRegister.setAttribute('class', 'txtInputSign txtInputRegister');
    const txtInputConfirmPasswordRegister = document.createElement('input');
    registerForm.appendChild(txtInputConfirmPasswordRegister);
    txtInputConfirmPasswordRegister.setAttribute('id', 'txtInputConfirmPasswordRegister');
    txtInputConfirmPasswordRegister.setAttribute('type', 'password');
    txtInputConfirmPasswordRegister.setAttribute('placeholder', 'Confirm Password...');
    txtInputConfirmPasswordRegister.setAttribute('class', 'txtInputSign txtInputRegister');
    const btnRegister = document.createElement('input');
    registerForm.appendChild(btnRegister);
    btnRegister.setAttribute('id', 'btnRegister');
    btnRegister.setAttribute('type', 'submit');
    btnRegister.setAttribute('value', 'Register');
    btnRegister.setAttribute('class', 'btnSign');


    loginForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const txtUsername = document.getElementById('txtInputEmailLogin').value;
        const txtPassword = document.getElementById('txtInputPasswordLogin').value;
        if(!txtUsername){
            showErrorMessage('txtMessageLogin', 'Email is required!');
            return;
        }
        if(!validateEmail(txtUsername)){
            showErrorMessage('txtMessageLogin', 'Email is not Valid!');
            return;
        }
        if(!txtPassword){
            showErrorMessage('txtMessageLogin', 'Password is required!');
            return;
        }
        const url = IPPORT+'/login';
        const async = true;
        const method = "POST";
        const xhr = new XMLHttpRequest ();
        displayLoader();
        xhr.open(method,url,async);
        xhr.send(toformdata({'username': txtUsername, 'password': txtPassword}));
        
        xhr.onerror = function() {
            showErrorMessage('txtMessageLogin', 'Error in Connection');
            removeLoader();
        };
        xhr.onabort = function(){
            removeLoader();
        }
        xhr.onload = function(){
            if(xhr.status == 401 || xhr.status==403){
                showErrorMessage('txtMessageLogin', 'Incorrect Email or Password!');
            }
            if(xhr.status == 200){
                if(saveToken(xhr.responseText)){
                    loadWelcomeTab();
                     
                }
            }
            removeLoader();
        }
    });


    registerForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const txtName = document.getElementById('txtInputNameRegister').value;
        const txtUsername = document.getElementById('txtInputEmailRegister').value;
        const txtPassword = document.getElementById('txtInputPasswordRegister').value;
        const txtConfirmPassword = document.getElementById('txtInputConfirmPasswordRegister').value;
        if(!txtName){
            showErrorMessage('txtMessageRegister', 'Name is required!');
            return;
        }
        if(!txtUsername){
            showErrorMessage('txtMessageRegister', 'Email is required!');
            return;
        }
        if(!validateEmail(txtUsername)){
            showErrorMessage('txtMessageRegister', 'Email is not Valid!');
            return;
        }
        if(!txtPassword){
            showErrorMessage('txtMessageRegister', 'Password is required!');
            return;
        }
        if(!txtConfirmPassword){
            showErrorMessage('txtMessageRegister', 'Confirm Password is required!');
            return;
        }
        if(!(txtConfirmPassword === txtPassword)) {
            showErrorMessage('txtMessageRegister', 'Password and Confirm Password do not match!');
            return;
        }
        
        const url = IPPORT+'/register';
        const async = true;
        const method = "POST";
        const xhr = new XMLHttpRequest ();
        displayLoader();
        xhr.open(method,url,async);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({'name':txtName, 'email':txtUsername, 'password':txtPassword}));
        xhr.onerror = function() {
            showErrorMessage('txtMessageLogin', 'Error in Connection');
            removeLoader();
        };
        xhr.onabort = function(){
            removeLoader();
        }
        xhr.onload = function(){
            if(xhr.status==403){
                showErrorMessage('txtMessageRegister', 'Email Already Exists!')
            }
            if(xhr.status == 200){
                if(saveToken(xhr.responseText)){
                    showSuccessMessage('txtMessageRegister', 'Success!');
                }
                document.getElementById('txtInputNameRegister').value = '';
                document.getElementById('txtInputEmailRegister').value = '';
                document.getElementById('txtInputPasswordRegister').value = '';
                document.getElementById('txtInputConfirmPasswordRegister').value = '';
            }
            removeLoader();
        }
    });

    document.getElementById('registerForm').addEventListener('submit', (e)=>{
        e.preventDefault();
        const txtName = document.getElementById('txtInputNameRegister').value;
        const txtUsername = document.getElementById('txtInputEmailRegister').value;
        const txtPassword = document.getElementById('txtInputPasswordRegister').value;
        const txtConfirmPassword = document.getElementById('txtInputConfirmPasswordRegister').value;
        if(!txtName){
            showErrorMessage('txtMessageRegister', 'Name is required!');
            return;
        }
        if(!txtUsername){
            showErrorMessage('txtMessageRegister', 'Email is required!');
            return;
        }
        if(!validateEmail(txtUsername)){
            showErrorMessage('txtMessageRegister', 'Email is not Valid!');
            return;
        }
        if(!txtPassword){
            showErrorMessage('txtMessageRegister', 'Password is required!');
            return;
        }
        if(!txtConfirmPassword){
            showErrorMessage('txtMessageRegister', 'Confirm Password is required!');
            return;
        }
        if(!(txtConfirmPassword === txtPassword)) {
            showErrorMessage('txtMessageRegister', 'Password and Confirm Password do not match!');
            return;
        }
        
        const url = IPPORT+'/register';
        const async = true;
        const method = "POST";
        const xhr = new XMLHttpRequest ();
        displayLoader();
        xhr.open(method,url,async);
        xhr.setRequestHeader('Content-Type','application/json');
        xhr.send(JSON.stringify({'name':txtName, 'email':txtUsername, 'password':txtPassword}));
        xhr.onerror = function() {
            showErrorMessage('txtMessageLogin', 'Error in Connection');
            removeLoader();
        };
        xhr.onabort = function(){
            removeLoader();
        }
        xhr.onload = function(){
            if(xhr.status==403){
                showErrorMessage('txtMessageRegister', 'Email Already Exists!')
            }
            if(xhr.status == 200){
                if(saveToken(xhr.responseText)){
                    showSuccessMessage('txtMessageRegister', 'Success!');
                }
                document.getElementById('txtInputNameRegister').value = '';
                document.getElementById('txtInputEmailRegister').value = '';
                document.getElementById('txtInputPasswordRegister').value = '';
                document.getElementById('txtInputConfirmPasswordRegister').value = '';
            }
            removeLoader();
        }
    });

}