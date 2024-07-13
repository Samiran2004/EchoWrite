console.log("Home");

async function getAllData() {
    const token = localStorage.getItem('usertoken')
    const URL = `/user/getAllPost`
    const response = await fetch(URL, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    console.log(data);
}

const postContainer = document.getElementById('postContainer');

const cardContainer = document.createElement('div');
cardContainer.className = 'cardContainer';

const imgContainer = document.createElement('div');
imgContainer.className = 'imgContainer';
const img = document.createElement('img');

getAllData();