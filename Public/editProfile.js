document.getElementById('profilePicture').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('prevImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
// document.querySelector('form').addEventListener('submit', function (e) {
//     const name = document.getElementById('name').value.trim();
//     const bio = document.getElementById('bio').value.trim();
//     if (!name || !bio) {
//         e.preventDefault();
//         alert('Name and Bio are required!');
//     }
// });
