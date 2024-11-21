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




// let currentPage = 0;
// const postsPerPage = 10;
// let isFetching = false;  // Prevents multiple simultaneous fetch requests

// async function fetchPosts(page, limit) {
//     const URL = `/user/getAllPost?page=${page}&limit=${limit}`;
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
//     return data;
// }

// function createPostCard(postData) {
//     const cardContainer = document.createElement('div');
//     cardContainer.className = 'cardContainer';

//     const imgContainer = document.createElement('div');
//     imgContainer.className = 'imgContainer';
//     const img = document.createElement('img');
//     if(postData.postImage){
//         img.src = postData.postImage;
//     }else{
//         img.src = `https://grassworksmanufacturing.com/wp-content/themes/i3-digital/images/no-image-available.png`;
//     }
//     imgContainer.appendChild(img);

//     const titleContainer = document.createElement('div');
//     titleContainer.className = 'titleContainer';
//     const h2 = document.createElement('h2');
//     h2.innerText = postData.title;
//     titleContainer.appendChild(h2);

//     const creatorContainer = document.createElement('div');
//     creatorContainer.className = 'creatorContainer';
//     const author = document.createElement('p');
//     author.className = 'author';
//     author.innerText = postData.authorName;
//     const date = document.createElement('p');
//     date.className = 'date';
//     date.innerHTML = new Date(postData.publishdate).toDateString();
//     creatorContainer.appendChild(author);
//     creatorContainer.appendChild(date);

//     const readMoreContainer = document.createElement('a');
//     readMoreContainer.className = 'readMoreContainer';
//     readMoreContainer.href = `/post/${postData._id}`;
//     readMoreContainer.innerText = "Read More";

//     cardContainer.appendChild(imgContainer);
//     cardContainer.appendChild(titleContainer);
//     cardContainer.appendChild(creatorContainer);
//     cardContainer.appendChild(readMoreContainer);

//     return cardContainer;
// }

// async function loadInitialPosts() {
//     try {
//         const data = await fetchPosts(currentPage, postsPerPage);
//         const postContainer = document.getElementById('postContainer');
//         data.data.forEach(post => {
//             const postCard = createPostCard(post);
//             postContainer.appendChild(postCard);
//         });
//     } catch (error) {
//         console.error('Error fetching initial posts:', error);
//     }
// }

// async function loadMorePosts() {
//     if (isFetching) return;  // Prevent fetching if a fetch request is already in progress

//     isFetching = true;  // Set fetching flag to true
//     try {
//         currentPage++;
//         const data = await fetchPosts(currentPage, postsPerPage);
//         const postContainer = document.getElementById('postContainer');
//         data.data.forEach(post => {
//             const postCard = createPostCard(post);
//             postContainer.appendChild(postCard);
//         });
//         isFetching = false;  // Reset fetching flag
//     } catch (error) {
//         console.error('Error fetching more posts:', error);
//         isFetching = false;  // Reset fetching flag
//     }
// }

// window.addEventListener('scroll', () => {
//     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
//         loadMorePosts();
//     }
// });

// loadInitialPosts();

let currentPage = 0;
const postsPerPage = 10;
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
    console.log(data);

    return data;
}

function createPostCard(postData) {
    const listItem = document.createElement('li');
    listItem.className = 'articles-v3__item-grid';

    const imgWrapper = document.createElement('a');
    imgWrapper.href = `/post/${postData._id}`;
    imgWrapper.className = 'articles-v3__img-wrapper';
    const img = document.createElement('img');
    img.src = postData.postImage || 'https://grassworksmanufacturing.com/wp-content/themes/i3-digital/images/no-image-available.png';
    img.alt = 'Image description';
    imgWrapper.appendChild(img);

    const contentDiv = document.createElement('div');

    const headline = document.createElement('h2');
    headline.className = 'articles-v3__headline';
    const headlineLink = document.createElement('a');
    headlineLink.href = `/post/${postData._id}`;
    headlineLink.innerText = postData.title;
    headline.appendChild(headlineLink);

    const description = document.createElement('p');
    description.className = 'articles-v3__description';
    description.innerText = postData.content || 'No description available.';

    const authorDiv = document.createElement('div');
    authorDiv.className = 'articles-v3__author';

    const authorImgWrapper = document.createElement('a');
    authorImgWrapper.href = `/user/getuserById/${postData.authorId._id}`;;
    authorImgWrapper.className = 'articles-v3__author-img';
    const authorImg = document.createElement('img');
    authorImg.src = postData.authorId.profileImage || 'https://grassworksmanufacturing.com/wp-content/themes/i3-digital/images/no-image-available.png';
    authorImg.alt = 'Author picture';
    authorImgWrapper.appendChild(authorImg);

    const authorInfo = document.createElement('div');
    authorInfo.className = 'articles-v3__author-info';
    const authorName = document.createElement('p');
    const authorNameLink = document.createElement('a');
    authorNameLink.href = `/user/getuserById/${postData.authorId._id}`;
    authorNameLink.className = 'articles-v3__author-name';
    authorNameLink.rel = 'author';
    authorNameLink.innerText = postData.authorName;
    authorName.appendChild(authorNameLink);
    const date = document.createElement('p');
    date.className = 'articles-v3__date';
    date.innerHTML = `<time>${new Date(postData.publishdate).toDateString()}</time>, &mdash; ${postData.readTime || '5'} min read`;

    authorInfo.appendChild(authorName);
    authorInfo.appendChild(date);

    authorDiv.appendChild(authorImgWrapper);
    authorDiv.appendChild(authorInfo);

    contentDiv.appendChild(headline);
    contentDiv.appendChild(description);
    contentDiv.appendChild(authorDiv);

    listItem.appendChild(imgWrapper);
    listItem.appendChild(contentDiv);

    return listItem;
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