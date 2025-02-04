import React from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {

    const navigate = useNavigate();

    const setCurUser = (user) => {
        localStorage.setItem("cur_user", JSON.stringify(user));
    }

    const verify_user = (event) => {
        event.preventDefault();
        const url = 'http://localhost:3002/users';
        const userName = event.target.querySelector('#name').value;
        const password = event.target.querySelector('#password').value;

        fetch(`${url}?username=${userName}&website=${password}`, { method: 'GET' })
            .then(data => data.json())
            .then(data => {
                if (data.length > 0) {
                    alert(`welcome ${userName}!`);
                    setCurUser(data[0]);
                    navigate(`/home/users/${data[0].id}`);
                     window.history.pushState({ loggedIn: true }, "", `/home/users/${data[0].id}`);
             
                }
                else {
                    alert("user does not exist please register");
                    event.target.querySelector('#name').value = "";
                    event.target.querySelector('#password').value = "";
                }
            });
    }

    return (
        <div className='getInForm' id="login">
            <form onSubmit={verify_user}>
                <label htmlFor="name">name: </label>
                <input type='text' id='name' required />
                <br />
                <label htmlFor="password">password: </label>
                <input type='password' id='password' required />
                <br />
                <button type="submit">login</button>
            </form>
            <button onClick={() => { navigate("/register") }}>register</button>
        </div>
    );

}

export default Login