const signupForm = document.querySelector('#signupForm');
signupForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    const Users = JSON.parse(localStorage.getItem('users')) || [];
    const isUserRegistered = Users.find(user => user.email === email);
const role = document.querySelector('#role').value || 'user'; // LINE TO ADD ROLE***********************
    if(isUserRegistered){
        return alert('El usuario ya esta registrado.')
    }

    Users.push(
        {
            name: name,
            email: email,
            password: password,
            role: role // LINE TO ADD ROLE***********************
        }
    );

    localStorage.setItem('users', JSON.stringify(Users));

    alert('Successfully register !');

    window.location.href = 'login.html';


})