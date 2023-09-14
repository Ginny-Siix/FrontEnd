const formElement = document.querySelector('#form');
const errorElement = document.querySelector('.error')

const login = async (data) => {
 const user = {
    email: data.get('email'),
    password: data.get('password'),
 }

 return await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
 })
}


formElement.addEventListener('submit', async (event) => {
    event.preventDefault()
    // const email = document.querySelector('#email').value
    const data = new FormData(formElement)

    try {
    const response = await login(data)
    const user = await response.json()
        
    if (response.status === 404 || response.status === 401) {
        errorElement.innerHTML = 'Identifiants erronés, veuillez recommencer'
        errorElement.style.backgroundColor = 'red';
        errorElement.style.color = 'white' 

        setTimeout(() => {
           errorElement.innerHTML = ''
        }, 3000);
        
    }

    if (response.status === 200) {
        console.log(user)
        sessionStorage.setItem('token', user.token);
        window.location.assign('/index.html')
    }
    } catch(error) {
        console.log(error)
    }

})