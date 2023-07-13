
// let stopDetails;

// const { error } = require("winston");

// const { error } = require("winston");


// const getArrivals = async (stopPoint) => {
//     try {
//         await fetch(`${stopPointURI}${stopPoint}/Arrivals`)
//             .then(response => response.json())
//             .then(body => {
//                 stopDetails = body;
//                 // console.log(stopDetail);
//                 arrivalPredictions(stopDetails);
//             })

//     } catch (error) {
//         console.log(error)
//     }
// }


// const arrivalPredictions = stopDetails => {
//     stopDetails.forEach((detail, i) => {
//         console.log(`${i + 1} : ${detail.platformName} - ${detail.stationName} => ${detail.lineName} towards ${detail.towards} in ${(detail.timeToStation / 60).toFixed(0)} \n`)
//     });
// }

// getArrivals(stopPoint);

//Api Variables
const TFL_URL = `https://api.tfl.gov.uk/StopPoint/`
const POSTCODE_URL = `https://api.postcodes.io/postcodes`

const stopPoint = `490008660N`

//Form Variables
const postcodeForm = document.getElementById('postcodeForm')
const postcode = document.getElementById('postcode').value;
const postcodeSubmit = document.getElementById('postcodeSubmit');

const OPTIONS = [
    {stopTypes : ""}
    {radius: 200},
    {mode_names: true}
]



// Event Listeners
postcodeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(postcode.value)
    busBoard();
  });
  
// Get Postcode Details

const getPostcodeInfo = async (postcode) => {
    let postCodeInfo;
    try {
        console.log("loading [getPostcodeInfo]")
        const response = await fetch(`${POSTCODE_URL}/${postcode}`)
        const body = await response.json();
        postCodeInfo = await body.result;     
                
    } catch (err) {
        console.log('There was an error', err);
    }


    return {lon : postCodeInfo.longitude, lat : postCodeInfo.latitude };
}

const getBusStopPointsbyLonLat =  (async (lon, lat) => {

    try {
        console.log("loading [getBusStopPointsbyLonLat]")
        // ttps://api.tfl.gov.uk/StopPoint/?lat={lat}&lon={lon}&stopTypes={stopTypes}[&radius][&useStopPointHierarchy][&modes][&categories][&returnLines]
        const response = await fetch(`${TFL_URL}/?lat=${lat}&lon=${lon}&stopTypes=${OPTIONS.stopTypes}&radius=${OPTIONS.radius}`)
        const body = await response.json();
        postCodeInfo = await body.result;     
                
    } catch (err) {
        console.log('There was an error', err);
    }




})

const busBoard = async () => {
    const postCodeInfo = await getPostcodeInfo(postcode);
    const bustArrivals = await getBusStopPointsbyLonLat(postCodeInfo.lon, postCodeInfo.lat);
}