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
        console.log(data);

        document.querySelector('#username').innerText = data.userdata.name;
        document.querySelector('#useremail').innerText = data.userdata.email;
        document.querySelector('#postCount').innerText = data.postData.length;

        const imgUrl = data.userdata.profileImage;
        document.getElementById('profileImage').src = imgUrl;
    } catch (error) {
        console.error("Fetch error: ", error);
    }
}

getUserdata();
