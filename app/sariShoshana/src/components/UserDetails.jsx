import React, { useState, useContext, useEffect } from 'react'
import { curUser } from '../App';
import { useNavigate } from 'react-router-dom';

const UserDetails = () => {

  const url = 'http://localhost:3002'
  let id;
  const { cur_user, set_User } = useContext(curUser);
  const navigate = useNavigate()

  const setLocalUser = (user) => {
    localStorage.setItem("cur_user", JSON.stringify(user));
  }

  function fetchID() {
    fetch(`${url}/config_id`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        id = json[0].nextUserId
      });
  }

  useEffect(() => {
    fetchID();
  }, []);

  const setUser = (event) => {
    const user = {
      "id": `${id}`,
      "name": event.target.querySelector('#name').value,
      "username": cur_user.name,
      "email": event.target.querySelector('#email').value,
      "address": {
        "street": event.target.querySelector('#street').value,
        "suite": event.target.querySelector('#suite').value,
        "city": event.target.querySelector('#city').value,
        "zipcode": event.target.querySelector('#zipcode').value,
        "geo": {
          "lat": event.target.querySelector('#lat').value,
          "lng": event.target.querySelector('#lng').value
        }
      },
      "phone": event.target.querySelector('#phone').value,
      "website": cur_user.password,
      "company": {
        "name": event.target.querySelector('#company_name').value,
        "catchPhrase": event.target.querySelector('#catchPhrase').value,
        "bs": event.target.querySelector('#bs').value
      }
    }

    fetch(`${url}/users`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      }
    }).catch(error=>console.log(error));

    const next_id = {
      "nextUserId": id + 1
    }

    fetch(`${url}/config_id/nextUserId`, {
      method: "PUT",
      body: JSON.stringify(next_id),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).catch(error=>console.log(error));
      

    setLocalUser(user);
    alert(`welcome ${cur_user.name}!`);
    navigate(`/home/users/${id}`);
  }

  return (
    <div id="details">
      <form onSubmit={setUser} action="">
        <label htmlFor="name">name: </label>
        <input type='text' id='name' required />
        <br />
        <label htmlFor="email">email: </label>
        <input type='email' id='email' required />
        <br />
        <h4>address:</h4>
        <label htmlFor="street"> street: </label>
        <input type='text' id='street' required />
        <br />
        <label htmlFor="suite"> suite: </label>
        <input type='text' id='suite' required />
        <br />
        <label htmlFor="city"> city: </label>
        <input type='text' id='city'  required/>
        <br />
        <label htmlFor="zipcode"> zipcode: </label>
        <input type='text' id='zipcode' required/>
        <br />
        <h4>geo:</h4>
        <label htmlFor="lat"> lat: </label>
        <input type='text' id='lat'  />
        <br />
        <label htmlFor="lng"> lng: </label>
        <input type='text' id='lng' />
        <br />
        <label htmlFor="phone"> phone: </label>
        <input type="number" id='phone' required />
        <br />
        <h4>company:</h4>
        <label htmlFor="company_name"> name: </label>
        <input type='text' id='company_name' />
        <label htmlFor="catchPhrase"> catchPhrase: </label>
        <input type='text' id='catchPhrase' />
        <label htmlFor="bs"> bs: </label>
        <input type='text' id='bs' />
        <br />
        <button type="submit">register </button>
      </form>
    </div>
  );
}

export default UserDetails;
