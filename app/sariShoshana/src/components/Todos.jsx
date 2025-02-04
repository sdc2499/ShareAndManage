import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTodo from './AddTodo';
import Todo from './Todo';

const Todos = () => {

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("cur_user"));
    const url = 'http://localhost:3002/todos';
    const [todos, setTodosArr] = useState(null);
    const [todosDiv, setTodosDiv] = useState(null);
    const [searchArr, setSearch] = useState([]);
    const [showSearchForm, setShowSearchForm] = useState({ status: 0, type: "" });

    const setTodosScreen = () => {
        setTodosDiv(todos && todos.map((t) => (
            <Todo todos={todos} setTodosArr={setTodosArr} todo={t} />)))
    }

    function fetchArr() {
        fetch(`${url}?userId=${user.id}`)
            .then(response => response.json())
            .then(data => setTodosArr(data))
    }

    useEffect(() => {
        fetchArr();
    }, []);

    const search = (event) => {
        event.preventDefault();
        let input_value = event.target.querySelector('#search').value;

        switch (showSearchForm.type) {
            case "id":
                todos.map(t => {
                    (t.id == input_value) ? setSearch(searchArr.push(t)) : null;
                });
                break;
            case "title":
                todos.map(t => {
                    (t.title == input_value) ? setSearch(searchArr.push(t)) : null;
                });
                break;
            case "completed":
                todos.map(t => {
                    (t.completed == (input_value == "true") ? true : false) ? setSearch(searchArr.push(t)) : null;
                });
                break;
            default:
                break;
        }

        if (searchArr.length) {
            setTodosDiv(searchArr.map((t) => (
                <Todo todos={todos} setTodosArr={setTodosArr} todo={t} />)))
            navigate(`?${showSearchForm.type}=${input_value}`);
        }
        else {
            alert(`todo with ${showSearchForm.type}: ${input_value} does not exist`);
        }
        event.target.querySelector('#search').value = "";
        setSearch([]);
    }

    const handleSearchSelect = (value) => {
        switch (value) {
            case "id":
                setShowSearchForm({ status: 1, type: "id" });
                break;
            case "title":
                setShowSearchForm({ status: 1, type: "title" });
                break;
            case "completed (true/false)":
                setShowSearchForm({ status: 1, type: "completed" });
                break;
            default:
                setShowSearchForm({ status: 0, type: "none" });
                setTodosScreen();
                navigate("");
        }
        setSearch([]);
    };

    const handleSortSelect = (value) => {
        switch (value) {
            case "id":
                setTodosArr(todos.sort((a, b) => a.id - b.id));
                break;
            case "a-z":
                setTodosArr(todos.sort((a, b) => (a.title > b.title) ? 1 : -1));
                break;
            case "z-a":
                setTodosArr(todos.sort((a, b) => (a.title < b.title) ? 1 : -1));
                break;
            case "completed":
                setTodosArr(todos.sort((a, b) => (b.completed - a.completed)));
                break;
            default:
        }
        setTodosScreen();
    };

    const sortOptions = ["none", "id", "a-z", "z-a", "completed"]
    const searchOptions = ["none", "id", "title", "completed (true/false)"]

    return (
        <>

            <h3>Todos:</h3>

            <div className='listOption'>

                {todos && (<>
                    <label htmlFor="sort_selection">order by: </label>
                    <select id='sort_selection' onChange={(e) => handleSortSelect(e.target.value)}>
                        {sortOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select><br />
                </>)}

                <label htmlFor="search_selection">search by: </label>
                <select id='search_selection' onChange={(e) => handleSearchSelect(e.target.value)}>
                    {searchOptions.map(option => <option key={option} value={option}>{option}</option>)}
                </select>

                <form style={{ display: showSearchForm.status ? "inline" : "none" }}
                    id="searchForm" onSubmit={search}>
                    <input id="search" type="text" />
                    <button type="submit" >search</button>
                </form>

                <AddTodo todos={todos} setTodosArr={setTodosArr} />
            </div>
            
            <div className='itemList'>
                {(!todosDiv && todos) ? todos.map((t) => (
                    <Todo key={t.id} todos={todos} setTodosArr={setTodosArr} todo={t} />)) : todosDiv}
            </div>
        </>
    );
};

export default Todos;
