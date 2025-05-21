const getUserdata = async () => {
    try {
        const token = localStorage.getItem('usertoken');
        
        const URL = `/user/profileinfo/${encodeURIComponent(token)}`;
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
        // console.log(data.postData[0]._id);

        document.querySelector('#username').innerText = data.userdata.name;
        document.querySelector('#useremail').innerText = data.userdata.email;
        document.querySelector('#userBio').innerText = data.userdata.bio;
        document.querySelector('#postCount').innerText = data.postData.length;

        const imgUrl = data.userdata.profileImage;
        console.log(imgUrl);
        
        if (imgUrl) {
            document.getElementById('profileimage').src = imgUrl;
        } else {
            document.getElementById('profileimage').src = 'default-image-path.jpg';
        }

        const postCardContainer = document.getElementById('postCardContainers');
        postCardContainer.innerHTML = "";

        for (let i = data.postData.length - 1; i >= 0; i--) {
            const postCard = document.createElement('div');
            postCard.className = 'profilepostcard';

            const cardTitle = document.createElement('span');
            cardTitle.className = 'card__title';
            cardTitle.innerText = 'POST';

            const cardContent = document.createElement('p');
            cardContent.className = 'card__content';

            const cardForm = document.createElement('form');
            cardForm.className = 'card__form';

            const postImage = document.createElement('div');
            postImage.className = 'profilepostImage';
            const img = document.createElement('img');
            img.src = data.postData[i].postImage;
            img.alt = 'Reload';
            postImage.appendChild(img);

            const cardButton = document.createElement('a');
            cardButton.className = 'card__button';
            cardButton.href = `/post/${data.postData[i]._id}`;
            cardButton.innerText = 'READ';

            cardForm.appendChild(cardButton);

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

            postCard.appendChild(cardTitle);
            postCard.appendChild(cardContent);
            postCard.appendChild(postImage);
            postCard.appendChild(cardForm);
            postCard.appendChild(title);

            postCardContainer.appendChild(postCard);
        }

    } catch (error) {
        console.error("Fetch error: ", error);
    }
}

getUserdata();
