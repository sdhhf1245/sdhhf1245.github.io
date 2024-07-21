let id = "1059614915456938084"
async function LanyardStatus() {
    console.log("Fetching...")
    const response = await fetch(`https://api.lanyard.rest/v1/users/${id}`);
    const data = await response.json();
    const spotify = data.data.spotify

    // spotify
    if (data.data.listening_to_spotify) {
        document.getElementById("song").textContent = spotify.song
        document.getElementById("artist").textContent = spotify.artist
    }
    console.log(data.data.discord_status)
    const status = document.getElementById("status");
    if (status) {
        status.textContent = data.data.discord_status;
        // switchcase
        switch (data.data.discord_status) {
            case "idle": status.style.color = "#f0b232"; break;
            case "online": status.style.color = "#398c5d"; break;
            case "dnd": status.style.color = "#f23f43"; break;
            case "offline": status.style.color = "#71747d"; break;
            default: status.style.color = "black"; break;
        }
    }
}

LanyardStatus();
setInterval(LanyardStatus, 10000);