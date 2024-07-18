// console.log("Home");

// async function getAllData() {
//     const token = localStorage.getItem('usertoken')
//     const URL = `/user/getAllPost`
//     const response = await fetch(URL, {
//         method: "GET",
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     });
//     if (!response.ok) {
//         throw new Error('Network response was not ok ' + response.statusText);
//     }
//     const data = await response.json();
//     console.log(data);

//     // const mainContainer = document.getElementById('mainContainer');

//     for (let i = data.data.length-1; i >= 0; i--) {
//         const postContainer = document.getElementById('postContainer');

//         const cardContainer = document.createElement('div');
//         cardContainer.className = 'cardContainer';

//         const imgContainer = document.createElement('div');
//         imgContainer.className = 'imgContainer';
//         const img = document.createElement('img');
//         img.src = data.data[i].postImage;

//         const titleContainer = document.createElement('div');
//         titleContainer.className = 'titleContainer';
//         const h2 = document.createElement('h2');
//         h2.innerText = data.data[i].title;
//         titleContainer.appendChild(h2);

//         const creatorContainer = document.createElement('div');
//         creatorContainer.className = 'creatorContainer';
//         const author = document.createElement('p');
//         author.className = 'author';
//         author.innerText = data.data[i].authorName;
//         const date = document.createElement('p');
//         date.className = 'date';
//         date.innerHTML = new Date(data.data[i].publishdate).toDateString();
//         creatorContainer.appendChild(author);
//         creatorContainer.appendChild(date);

//         const readMoreContainer = document.createElement('div');
//         readMoreContainer.className = 'readMoreContainer';
//         const readMoreTag = document.createElement('a');
//         readMoreTag.className = 'readMoreTag';
//         readMoreTag.href = `/post/${data.data[i]._id}`;
//         readMoreTag.innerText = "Read More";
//         readMoreContainer.appendChild(readMoreTag);
//         readMoreContainer.addEventListener('click', () => {
//             window.location.href = readMoreTag.href;
//         });

//         imgContainer.appendChild(img);
//         cardContainer.appendChild(imgContainer);
//         cardContainer.appendChild(titleContainer);
//         cardContainer.appendChild(creatorContainer);
//         cardContainer.appendChild(readMoreContainer);
//         postContainer.appendChild(cardContainer);
//     }
//     // mainContainer.appendChild(postContainer);
// }

// getAllData();




let currentPage = 0;
const postsPerPage = 4;
let isFetching = false;  // Prevents multiple simultaneous fetch requests

async function fetchPosts(page, limit) {
    const URL = `/user/getAllPost?page=${page}&limit=${limit}`;
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
    return data;
}

function createPostCard(postData) {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'cardContainer';

    const imgContainer = document.createElement('div');
    imgContainer.className = 'imgContainer';
    const img = document.createElement('img');
    img.src = postData.postImage;
    imgContainer.appendChild(img);

    const titleContainer = document.createElement('div');
    titleContainer.className = 'titleContainer';
    const h2 = document.createElement('h2');
    h2.innerText = postData.title;
    titleContainer.appendChild(h2);

    const creatorContainer = document.createElement('div');
    creatorContainer.className = 'creatorContainer';
    const author = document.createElement('p');
    author.className = 'author';
    author.innerText = postData.authorName;
    const date = document.createElement('p');
    date.className = 'date';
    date.innerHTML = new Date(postData.publishdate).toDateString();
    creatorContainer.appendChild(author);
    creatorContainer.appendChild(date);

    const readMoreContainer = document.createElement('a');
    readMoreContainer.className = 'readMoreContainer';
    readMoreContainer.href = `/post/${postData._id}`;
    readMoreContainer.innerText = "Read More";

    cardContainer.appendChild(imgContainer);
    cardContainer.appendChild(titleContainer);
    cardContainer.appendChild(creatorContainer);
    cardContainer.appendChild(readMoreContainer);

    return cardContainer;
}

async function loadInitialPosts() {
    try {
        const data = await fetchPosts(currentPage, postsPerPage);
        const postContainer = document.getElementById('postContainer');
        data.data.forEach(post => {
            const postCard = createPostCard(post);
            postContainer.appendChild(postCard);
        });
    } catch (error) {
        console.error('Error fetching initial posts:', error);
    }
}

async function loadMorePosts() {
    if (isFetching) return;  // Prevent fetching if a fetch request is already in progress

    isFetching = true;  // Set fetching flag to true
    try {
        currentPage++;
        const data = await fetchPosts(currentPage, postsPerPage);
        const postContainer = document.getElementById('postContainer');
        data.data.forEach(post => {
            const postCard = createPostCard(post);
            postContainer.appendChild(postCard);
        });
        isFetching = false;  // Reset fetching flag
    } catch (error) {
        console.error('Error fetching more posts:', error);
        isFetching = false;  // Reset fetching flag
    }
}

window.addEventListener('scroll', () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
        loadMorePosts();
    }
});

loadInitialPosts();