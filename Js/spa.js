// SPA
// script to change of view according to SPA (Single Page Application).

const container = document.getElementById('content');

// Get the name of each view from 'hash'.
function getViewFromHash(){
    const hash = location.hash.slice(2);
    return hash || 'home';
}

// Dynamically loads the HTML view.

function loadView(nameOfView){
    //************************************************** */
    const user = JSON.parse(localStorage.getItem('login_success'));
    // Vistas permitidas para user
    const userAllowed = ['home', 'course', 'report'];
    if (user && user.role !== 'admin' && !userAllowed.includes(nameOfView)) {
        container.innerHTML = `<h2>Denied Access</h2><p>You don't have authorization to watch this section.</p>`;
        return;
    }
    //************************************************** */

    fetch(`views/${nameOfView}.html`)    // It's mandatory that "views" will be the same name of the folder that contains the views in html, except index.html
        .then(res => {
            if(!res.ok) throw new Error(`It was not possible charging this view: ${nameOfView}`);
            return res.text();
        })
        .then(html => {
            container.innerHTML = html;

            // Execute specific logic of each view.
            if(nameOfView === 'addStudent'){
                initAddEvent(); // Calling a function declared on app.js   ###################
            }
            if (nameOfView === 'users'){
                getEvents(); // Calling the function to list all users.   ########################
            }
        })
        .catch(err => {
            container.innerHTML = `<h4>Error charging view: "${nameOfView}"</h4>`;
            console.log(err);
        })
}

// It listening changes in the hash (the user push back / foward )
window.addEventListener('hashchange', () => {
    const view = getViewFromHash();
    loadView(view);
});


// When the page loads for first time.
document.addEventListener('DOMContentLoaded', () => {
    const view = getViewFromHash();
    loadView(view);
})

