const getUserdata = async () => {
    try {
        const token = localStorage.getItem('usertoken')
        const URL = `/user/profileinfo/${encodeURIComponent(token)}`
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

        document.querySelector('#username').innerText = data.userdata.name;
        document.querySelector('#useremail').innerText = data.userdata.email;
        document.querySelector('#postCount').innerText = data.postData.length;

        const imgUrl = data.userdata.profileImage;
        document.getElementById('profileImage').src = imgUrl;


        const postCardContainer = document.getElementById('postCardContainers');
        postCardContainer.innerHTML = "";

        for(i = data.postData.length-1; i>=0; i--){
            const postCard = document.createElement('div');
            postCard.className = 'postCard';

            const postImage = document.createElement('div');
            postImage.className = 'postImage';
            const img = document.createElement('img');
            img.src = data.postData[i].postImage;
            img.alt = 'Reload';
            postImage.appendChild(img);

            const title = document.createElement('div');
            title.className = 'title';

            const postDate = document.createElement('h4');
            postDate.className = 'postDate';
            postDate.innerHTML = new Date(data.postData[i].publishdate).toLocaleDateString();

            const titleTxt = document.createElement('h2');
            titleTxt.className = 'titleTxt';
            titleTxt.innerHTML = data.postData[i].title;

            title.appendChild(postDate);
            title.appendChild(titleTxt);

            postCard.appendChild(postImage);
            postCard.appendChild(title);

            postCardContainer.appendChild(postCard);
        }

    } catch (error) {
        console.error("Fetch error: ", error);
    }
}

getUserdata();
