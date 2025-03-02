// const postComment = async () => {
//     const comment = document.getElementById('commentBox').value;
//     try {
//         const response = await fetch('/post/comment', {
//             method: "POST",
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ comment: comment })
//         });
//         const result = await response.json();
//         console.log('Server response:', result);
//     } catch (error) {
//         console.error("Error posting comment: ", error);
//     }
// }

// const postBtn = document.getElementById('postBtn');
// postBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     postComment();
// });


const postComment = async () => {
    const comment = document.getElementById('commentBox').value;
    const postBtn = document.getElementById('postBtn');

    try {
        // Disable the button
        postBtn.disabled = true;

        const response = await fetch('/post/comment', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment: comment })
        });

        // const result = await response.json();
        // console.log('Server response:', result);

        // Refresh the page after a successful response
        if (response.ok) {
            window.location.reload();
        }
    } catch (error) {
        console.error("Error posting comment: ", error);
    } finally {
        // Enable the button
        postBtn.disabled = false;
    }
}

const postBtn = document.getElementById('postBtn');
postBtn.addEventListener("click", (e) => {
    e.preventDefault();
    postComment();
});
