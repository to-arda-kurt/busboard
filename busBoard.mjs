
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
const TFL_URL = `https://api.tfl.gov.uk/StopPoint/`;
const POSTCODE_URL = `https://api.postcodes.io/postcodes`;

const stopPoint = `490008660N`;

//Form Variables
const postcodeForm = document.getElementById('postcodeForm')
const postcode = document.getElementById('postcode').value;
const postcodeSubmit = document.getElementById('postcodeSubmit');

const OPTIONS = [
    { stopTypes: "NaptanOnstreetBusCoachStopPair" },
    { radius: 200 },
    { mode_names: true }
]

let loading = false;

// Event Listeners
postcodeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(postcode.value)
    busBoard();
});

// Get Postcode Details then use Longitute and Latitude
const getPostcodeInfo = async (postcode) => {

    console.log("loading [getPostcodeInfo]")
    const response = await fetch(`${POSTCODE_URL}/${postcode}`)
    const data = await response.json();
    const postCodeInfo = await data.result;



    return { lat: postCodeInfo.latitude, lon: postCodeInfo.longitude };
};

const getBusStopPointsbyLonLat = (async (lat, lon) => {

    let radius = 1500;

    console.log("loading [getBusStopPointsbyLonLat]")
    const response = await fetch(`${TFL_URL}/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram&radius=${radius}`)

    const body = await response.json()
    const stopPointsData = await body.stopPoints


    return stopPointsData
        .sort((stopPointA, stopPointB) => stopPointA.distance - stopPointB.distance)
        .slice(0, 4).map(stopPoint => [stopPoint.commonName, stopPoint.naptanId]);

});

const getBusPredictionsbyStopPoints (stopPoints) {

    console.log("loading [getBusPredictionsbyStopPoints]")

    const response = await fetch(`${POSTCODE_URL}/${postcode}`)
    const data = await response.json();

    const postCodeInfo = await data.result;
} 

const busBoard = async (OPTIONS) => {
    const postCodeInfo = await getPostcodeInfo(postcode);
    console.log(postCodeInfo);
    const stopPoints = await getBusStopPointsbyLonLat(postCodeInfo.lat, postCodeInfo.lon);
    console.log(stopPoints)
    const arrivalBuses = await getBusPredictionsbyStopPoints()
}