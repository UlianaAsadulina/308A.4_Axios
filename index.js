import * as Carousel from "./Carousel.js";
// import axios from "axios"; 

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_V1hbANkwoLecakcBbdq9WVvBt2jlOO1R70PJ8n0ch66XNgYHuI03Wa9fsOdosiTI";

// 1. Create an async function "initialLoad" 
// 2. Create an event handler for breedSelect
// 3. Fork your own sandbox, creating a new one named "JavaScript Axios Lab."


/**
 * 4. Change all of your fetch() functions to axios!
  
 */


// Reuse the API key for headers
const headers = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

let breeds = [];


/**
 * 5. Add axios interceptors to log the time between request and response to the console.

 */


//Add axios interceptors for start point.

axios.interceptors.request.use(request => {
  request.metadata = request.metadata || {};
  request.metadata.startTime = new Date().getTime();
 // reset the progress with each request.
  progressBar.style.width = "0%";
  return request;
});

//Add axios interceptors to log the time between request and response to the console.

axios.interceptors.response.use(
  (response) => {
      response.config.metadata.endTime = new Date().getTime();
      //console.log(`Recieve data at ${response.config.metadata.endTime}`);
      response.config.metadata.durationInMS = response.config.metadata.endTime - response.config.metadata.startTime;

      console.log(`Request took ${response.config.metadata.durationInMS} milliseconds.`)
      return response;
  },
  (error) => {
      error.config.metadata.endTime = new Date().getTime();
      error.config.metadata.durationInMS = error.config.metadata.endTime - error.config.metadata.startTime;

      console.log(`Request took ${error.config.metadata.durationInMS} milliseconds.`)
      throw error;
});


// Update the progress of the request
function updateProgress (progressEvent) {
  console.log(progressEvent);
  const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  console.log(percentage+"%");

  //modify progressBar width style property to align with the request progress.
  progressBar.style.width = percentage+"%";

 

}


async function initialLoad() {
  try {
    // Fetch the list of cat breeds
    const response = await axios.get("https://api.thecatapi.com/v1/breeds", { 
      headers, 
      onDownloadProgress: updateProgress, 
  });

    breeds = await response.data;
 

    // Populate the breedSelect element with options
    breeds.forEach((breed) => {
      let option = document.createElement("option");
      option.setAttribute("value", breed.id); // Set the value to the breed ID
      option.textContent = breed.name; // Set the displayed text to the breed name
      breedSelect.appendChild(option); // Append the option to the select element
    });
  } catch (err) {
    console.log(err);
  }
}

initialLoad();

// Create an informational section in the infoDump
function retrieveBreedInfo() {
  try {
    const breedId = breedSelect.value;

    // Find the selected breed's information
    const selectedBreed = breeds.find((breed) => breed.id === breedId);

    if (selectedBreed) {
      // Create and append breed information
      const breedInfo = `
        <h2>${selectedBreed.name}</h2>
        <p>${selectedBreed.description}</p>
        <p><strong>Temperament:</strong> ${selectedBreed.temperament}</p>
        <p><strong>Origin:</strong> ${selectedBreed.origin}</p>
        <p><strong>Life Span:</strong> ${selectedBreed.life_span} years</p>
      `;
      infoDump.innerHTML = breedInfo;
    }
  } catch (err) {
    console.log(err);
  }
}

async function retrieveBreedImg() {
  try {
    const breedId = breedSelect.value;

    // Fetch information on the selected breed
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=6`,
      {
        headers,
      }
    );

    const data = await response.data;

    // console.log(data);

    // Clear the carousel
    Carousel.clear();
    infoDump.textContent = "";

    data.forEach((img) => {
      let breedImg = Carousel.createCarouselItem(img.url, "...", img.id);
      Carousel.appendCarousel(breedImg);
    });

    //Activate buttons on the carousel
    Carousel.start();

    // Call for information about selected breed
    retrieveBreedInfo();

  } catch (err) {
    console.log(err);
  }
}

breedSelect.addEventListener("change", retrieveBreedImg);





/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */

/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */

/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */
export async function favourite(imgId) {
  // your code here
}

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */
