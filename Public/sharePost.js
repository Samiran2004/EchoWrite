function shareOnWhatsApp() {
    const url = window.location.href;
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`;
    window.open(whatsappShareUrl, '_blank');
}
function shareOnMessenger() {
    const url = window.location.href;
    const messengerShareUrl = `fb-messenger://share?link=${encodeURIComponent(url)}`;
    window.open(messengerShareUrl, '_blank');
}

function shareOnReddit() {
    const url = window.location.href;
    const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}`;
    window.open(redditShareUrl, '_blank');
}

function shareOnTwitter() {
    const url = window.location.href;
    const text = "Check this out!";
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(twitterShareUrl, '_blank');
}

function shareOnDiscord() {
    const url = window.location.href;
    const discordShareUrl = `https://discord.com/channels/@me?url=${encodeURIComponent(url)}`;
    window.open(discordShareUrl, '_blank');
}

function shareOnSnapchat() {
    const url = window.location.href;
    const snapchatShareUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`;
    window.open(snapchatShareUrl, '_blank');
}

function shareOnPinterest() {
    const url = window.location.href;
    const pinterestShareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}`;
    window.open(pinterestShareUrl, '_blank');
}

function shareOnInstagram() {
    const url = window.location.href;
    const instagramShareUrl = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;
    window.open(instagramShareUrl, '_blank');
}
