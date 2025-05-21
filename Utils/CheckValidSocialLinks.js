async function checkValidSocialLinks(link) {
    try {
        const response = await fetch(link, {
            method: 'HEAD',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        if(response.status < 200) {
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

export default checkValidSocialLinks;