function displayLoader(){
    const oldLoaderContainer = document.getElementById('loaderContainer');
    if(oldLoaderContainer){
        return;
    }
    const body = document.getElementsByTagName("BODY")[0];

    const loaderContainer = document.createElement('div');
    body.appendChild(loaderContainer);
    loaderContainer.setAttribute('class', 'loaderContainer');
    loaderContainer.setAttribute('id', 'loaderContainer');

    const loadingComponentContainer = document.createElement('div');
    loaderContainer.appendChild(loadingComponentContainer);
    loadingComponentContainer.setAttribute('class', 'loadingComponentContainer');
    loadingComponentContainer.setAttribute('id', 'loadingComponentContainer');
    
    const loading = document.createElement('span');
    loadingComponentContainer.appendChild(loading);
    loading.setAttribute('class', 'loading');
    loading.setAttribute('id', 'loading');

    const percentageLoading = document.createElement('span');
    loaderContainer.appendChild(percentageLoading);
    percentageLoading.setAttribute('class', 'percentageLoading');
    percentageLoading.setAttribute('id', 'percentageLoading');
}

function removeLoader(){
    const loaderContainer = document.getElementById('loaderContainer');
    if(loaderContainer){
        loaderContainer.remove()
    }
}