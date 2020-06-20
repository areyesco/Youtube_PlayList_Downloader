//variables



// event listeners
loadEventListeners();
function loadEventListeners(){
   
    //Load playlists in the options when the page is done loading
    document.addEventListener('DOMContentLoaded', loadPlaylists);
}

//functions

//loads the playlists stored in the json file into the dropdown option
async function loadPlaylists(){
    let playlists = await getPlaylists();

    let dropdownOptions = document.querySelector('.selectPlaylist form>div select')

    let names ="";
   for(let i = 0; i < playlists.length; i++){
     names += `
            <option value="">${playlists[i].name}</option>
        `
   }
   dropdownOptions.innerHTML = names;
   
}

//gets the playlists stored in the json file
async function getPlaylists(){
    
    let playlists;
   await fetch('../BackEnd/playlist.json')
    .then(res => res.json())
    .then(data => {
      playlists = data;
    })
    .catch(err => console.error(err));

    return playlists;
}