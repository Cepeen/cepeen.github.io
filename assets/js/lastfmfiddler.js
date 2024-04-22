
const searchResultsContainer = document.getElementById('searchResultsContainer');
const scrobbleForm = document.getElementById('scrobbleForm');
const dataContainer = document.getElementById('dataContainer');
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');
const limit = 10;
const targetURL = 'https://lastfmfiddler.tomektomasik.pl';


// Taking and sending token to the server
localStorage.setItem('authToken', token);

async function sendTokenToBackend(token) {
  try {
    const response = await fetch(`${targetURL}/saveToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token }),
    });

    if (!response.ok) {
      throw new Error('Failed to send token to backend');
    }

    console.log('Token sent to backend successfully');
  } catch (error) {
    console.error('Error while sending token to backend:', error);
  }
}

// Taking basic informations from user account.
const recentButton = document.getElementById('recentbutton');

recentButton.addEventListener('click', async () => {  event.preventDefault();
  const username = document.getElementById('username').value;
  if (username.trim() === '') {
    alert('Please enter a Last.fm username.');
    return;
  }

  try {
      const response = await axios.get(`${targetURL}/userInfo?user=${username}`);
      const userData = response.data.user;

      const userInfo = document.getElementById('userInfo');
      userInfo.innerHTML = '';

      const usernameLabel = document.createElement('span');
      usernameLabel.textContent = 'Username: ';

      const usernameLink = document.createElement('a');
      usernameLink.textContent = userData.name;
      usernameLink.href = userData.url;
      usernameLink.target = '_blank'; 

      userInfo.appendChild(usernameLabel);
      userInfo.appendChild(usernameLink);


      if (userData.realname) {
        const realNameElement = document.createElement('p');
        realNameElement.textContent = `Real Name: ${userData.realname}`;
        userInfo.appendChild(realNameElement);
      }

      const countryElement = document.createElement('p');
      countryElement.textContent = `Country: ${userData.country}`;

      const playCountElement = document.createElement('p');
      playCountElement.textContent = `Play Count: ${userData.playcount}`;

      const ageElement = document.createElement('p');
      ageElement.textContent = `Age: ${userData.age}`;

      const imageUrl = response.data.user.image[2]['#text']; 
      const avatarImage = document.createElement('img');
      avatarImage.src = imageUrl;

      const avatarContainer = document.getElementById('avatarContainer');
      avatarContainer.style.backgroundImage = 'none'; 
      userInfo.style.backgroundImage = 'none'; 
      avatarContainer.innerHTML = '';
      avatarContainer.appendChild(avatarImage);
   

      userInfo.appendChild(countryElement);
      userInfo.appendChild(playCountElement);
      userInfo.appendChild(ageElement);

      await fetchData(1);
      
  } catch (error) {
      console.error('Error during API call:', error);
  }
});

//  Taking data and counting pages.
async function fetchData(page) {
  const username = document.getElementById('username').value;
  const tracksPerPage = document.getElementById('tracksPerPage').value;
  const scrobbleDate = document.getElementById('scrobbleDate').value; 
  try {
      const response = await axios.get(`${targetURL}/recentTracks?user=${username}&page=${page}&limit=${tracksPerPage}`);
      const recentTracksData = response.data;

      // Get user info
      const userInfoResponse = await axios.get(`${targetURL}/userInfo?user=${username}`);
      const userInfoData = userInfoResponse.data;

      // Count number of pages
      const totalScrobbles = userInfoData.user.playcount;
      const totalPages = Math.ceil(totalScrobbles / tracksPerPage);

      updatePageData(recentTracksData, page, totalPages);

      document.getElementById('fiddlerPagination').style.display = 'block';
  } catch (error) {
      console.error('Error during API call:', error);
  }
}

// Buttons
document.getElementById('tracksPerPage').addEventListener('change', async () => {
  const currentPage = 1; 
  await fetchData(currentPage);
  document.getElementById('currentPage').textContent = currentPage;
});


document.getElementById('prevPage').addEventListener('click', async () => {
    let currentPage = parseInt(document.getElementById('currentPage').textContent);
    if (currentPage > 1) {
        currentPage--;
        await fetchData(currentPage);
        document.getElementById('currentPage').textContent = currentPage;
    }
});

document.getElementById('nextPage').addEventListener('click', async () => {
    let currentPage = parseInt(document.getElementById('currentPage').textContent);
    const totalPages = parseInt(document.getElementById('totalPages').textContent);
    if (currentPage < totalPages) {
        currentPage++;
        await fetchData(currentPage);
        document.getElementById('currentPage').textContent = currentPage;
    }
});

document.getElementById('goToPage').addEventListener('click', async () => {
    const pageInput = document.getElementById('pageInput');
    const page = parseInt(pageInput.value);
    if (!isNaN(page) && page > 0 && page <= parseInt(document.getElementById('totalPages').textContent)) {
        await fetchData(page);
        document.getElementById('currentPage').textContent = page;
    }
});

const fetchByDateButton = document.getElementById('fetchByDateButton');

// Add an event listener to the button
fetchByDateButton.addEventListener('click', async () => {
 
  const username = document.getElementById('username').value;
  const selectedDate = document.getElementById('scrobbleDate').value;
  if (username.trim() === '') {
    alert('Please enter a Last.fm username.');
    return;
  }

  // Check if a date is selected
  else if (selectedDate) {
  
    const currentPage = 1; 
    await fetchDataByDate(username, selectedDate, currentPage);
    document.getElementById('currentPage').textContent = currentPage;
  }
});

// Fetching data by date
async function fetchDataByDate(username, date) {
  try {
    const response = await axios.get(`${targetURL}/recentTracks?user=${username}&date=${date}&limit=${tracksPerPage}`);
    const recentTracksData = response.data;
    if (recentTracksData.recenttracks && recentTracksData.recenttracks.track.length > 0) {
      const totalPages = 1; 
      const tracksPerPage = 100
      updatePageData(recentTracksData, 1, totalPages, tracksPerPage);
      hidePagination ()
    } else {
      const dataContainer = document.getElementById('dataContainer');
      dataContainer.innerHTML = '<p>No scrobbles found for the selected date.</p>';
      hidePagination ()
    }
  } catch (error) {
    console.error('Error fetching scrobbles by date:', error);
  }
}

function hidePagination () {
  const fiddlerPagination = document.getElementById('fiddlerPagination');
  fiddlerPagination.style.display = 'none'; 
}

// Creating and setting up the table
function updatePageData(recentTracksData, currentPage, totalPages) {
  const dataContainer = document.getElementById('dataContainer');
  dataContainer.innerHTML = '';

  const MAX_TITLE_LENGTH = 20;
  const MAX_ARTIST_LENGTH = 20;

  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  recentTracksData.recenttracks.track.forEach((track) => {
    const trackRow = document.createElement('tr');

    const imageCell = document.createElement('td');
    imageCell.id = 'imageCell'; 
    const trackImage = document.createElement('img');
    trackImage.src = track.image.find((img) => img.size === 'small')['#text'];
    imageCell.appendChild(trackImage);

    const titleCell = document.createElement('td');
    titleCell.id = 'titleCell'; 
    titleCell.textContent = track.name.length > MAX_TITLE_LENGTH ? track.name.substring(0, MAX_TITLE_LENGTH) + '...' : track.name;
    titleCell.title = track.name;

    const artistCell = document.createElement('td');
    artistCell.id = 'artistCell'; 
    artistCell.textContent = track.artist['#text'].length > MAX_ARTIST_LENGTH ? track.artist['#text'].substring(0, MAX_ARTIST_LENGTH) + '...' : track.artist['#text'];
    artistCell.title = track.artist['#text'];

    const dateCell = document.createElement('td');
    dateCell.id = 'dateCell'; 
    dateCell.textContent = track.date ? track.date['#text'] : 'scrobbling now';

    //time and date correction
    const scrobbleTime = track.date ? new Date(track.date['#text']) : new Date(); 
    const correctedTime = new Date(scrobbleTime.getTime() + (2 * 60 * 60 * 1000)); 
    const formattedDate = correctedTime.toLocaleDateString();
    const formattedTime = correctedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); 
    
    dateCell.textContent = formattedDate + ' ' + formattedTime;
   
    


    const textLinkCell = document.createElement('td');
    textLinkCell.id = 'textLinkCell'; 


    const textLink = document.createElement('button');

    textLink.textContent = 'Lyrics';
    textLink.id = "LyricsButton";
    textLink.onclick = async () => {
      try {
        const response = await fetch(`${targetURL}/searchLyrics`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: track.name,
            artist: track.artist['#text']
          })
        });
        const data = await response.json();
        const lyrics = data.lyrics;
        const searchResultsContainer = document.getElementById('searchResultsContainer');
        searchResultsContainer.innerHTML = '';
        // Display song title
        const titleContainer = document.createElement('h2');
        titleContainer.textContent = track.name;
        searchResultsContainer.appendChild(titleContainer);
        // Display artist name
        const artistContainer = document.createElement('h3');
        artistContainer.textContent = track.artist['#text'];
        searchResultsContainer.appendChild(artistContainer);
        // Display lyrics
        const lyricsContainer = document.createElement('div');
        lyricsContainer.style.whiteSpace = 'pre-wrap';
        lyricsContainer.textContent = lyrics;
        searchResultsContainer.appendChild(lyricsContainer);
        // Expand sidebar
        const sidebar = document.getElementById('fiddlersidebar');
        sidebar.style.right = '0'; 
        // Add event listener to sidebar to hide it when clicked
        sidebar.addEventListener('click', () => {
          sidebar.style.right = '-450px'; 
        });
      } catch (error) {
        console.error('Error during search:', error);
        // Error handling
        searchResultsContainer.innerHTML = '<p>Something went wrong during the search.</p>';
      }
    };
  
    const playButtonCell = document.createElement('td');
    const playButton = document.createElement('button');
    playButton.id = "playButton";
    // Add event listener to each play button
    playButton.addEventListener('click', async () => {
        await playSongOnYouTube(track.artist['#text'], track.name);
    });

    playButton.addEventListener('click', function() {
      iframe.src += "&autoplay=1";  
    });
    
    playButtonCell.appendChild(playButton);
    textLinkCell.appendChild(textLink);
  
    trackRow.appendChild(imageCell);
    
    if (isMobile) {
      const infoCell = document.createElement('td');
      infoCell.className = 'infoCell';
      const infoDiv = document.createElement('div');
      const titleInfo = document.createElement('p');
      titleInfo.textContent = track.name;
      titleInfo.style.fontWeight = 'bold'; 
      const artistInfo = document.createElement('p');
      artistInfo.textContent = track.artist['#text'];
      const dateInfo = document.createElement('p');
      dateInfo.textContent = track.date ? track.date['#text'] : 'scrobbling now';
      infoDiv.appendChild(titleInfo);
      infoDiv.appendChild(artistInfo);
      infoDiv.appendChild(dateInfo);
      infoCell.appendChild(infoDiv);
      trackRow.appendChild(infoCell);
    } else {
      trackRow.appendChild(titleCell);
      trackRow.appendChild(artistCell);
      trackRow.appendChild(dateCell);
    }
    
    trackRow.appendChild(textLinkCell);
    trackRow.appendChild(playButtonCell);
    
    dataContainer.appendChild(trackRow);
    
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
  });
}


async function playSongOnYouTube(artist, title) {
  try {
    const response = await fetch(`${targetURL}/youtubeLink?author=${encodeURIComponent(artist)}&title=${encodeURIComponent(title)}`);

      if (!response.ok) {
          throw new Error('Failed to fetch YouTube link');
      }
      const data = await response.json();
      const youtubeLink = data.youtubeLink;

      // Extract video ID from YouTube link
      const videoId = youtubeLink.split('v=')[1];

      // Create and display the embedded YouTube player
      let playerContainer = document.getElementById('player');
if (!playerContainer) {
    playerContainer = document.createElement('div');
    playerContainer.id = 'player';
    document.body.appendChild(playerContainer);
} else {
    playerContainer.innerHTML = '';
}

// this is creative ;)
const iframe = document.createElement('iframe');
iframe.src = `https://cdpn.io/pen/debug/oNPzxKo?v=${videoId}`;
iframe.id = "youtube";
iframe.allow = 'autoplay, encrypted-media';
iframe.frameborder = '2';
iframe.allowfullscreen = 'allowfullscreen';

const closeButton = document.createElement('button');
closeButton.id = "youtubeClose";
closeButton.textContent = 'X';

closeButton.onclick = function() {
    playerContainer.innerHTML = '';
};

playerContainer.appendChild(closeButton);
playerContainer.appendChild(iframe);
      
      } catch (error) {
          console.error('Error fetching or embedding YouTube video:', error);
      }
    }