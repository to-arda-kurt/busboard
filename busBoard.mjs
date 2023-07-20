
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
const postcode = document.getElementById('postcode');
const arrivals = document.getElementById('arrivals');

const OPTIONS = {
    stopTypes: "NaptanPublicBusCoachTram" ,
    radius: 1500 ,
    mode_names: true 
}

let loading = false;

// Event Listeners
postcodeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearApp();
    console.log(postcode.value)
    busBoard();
});

// Get Postcode Details then use Longitute and Latitude
const getPostcodeInfo = async (pstcode) => {

    console.log("loading [getPostcodeInfo]")
    const response = await fetch(`${POSTCODE_URL}/${pstcode}`)
    const data = await response.json();
    const postCodeInfo = await data.result;
    return { lat: postCodeInfo.latitude, lon: postCodeInfo.longitude };
};

const getBusStopPointsbyLonLat = (async (lat, lon,stopTypes,radius) => {

    console.log("loading [getBusStopPointsbyLonLat]")
    const response = await fetch(`${TFL_URL}/?lat=${lat}&lon=${lon}&stopTypes=${stopTypes}&radius=${radius}`)
    const body = await response.json()
    const stopPointsData = await body.stopPoints
    console.log(stopPointsData)
    return stopPointsData
        .sort((stopPointA, stopPointB) => stopPointA.distance - stopPointB.distance)
        .slice(0, 4).map(stopPoint => [stopPoint.indicator, stopPoint.commonName, stopPoint.naptanId ]);

});

const getBusPredictionsbyStopPoints = async (stopPoints) => {

    console.log("loading [getBusPredictionsbyStopPoints]")
    let data;
    
    for(let stopPoint of stopPoints){
        const [indicator ,stopName, stopPointId] = stopPoint;
        const response = await fetch(`${TFL_URL}/${stopPointId}/Arrivals`)
        data = await response.json();
        await createArrivalsElement(data.sort((timeToStationA, timeToStationB) => timeToStationA - timeToStationB), indicator, stopName);
        console.log(data)
    }
  
} 

const createStopNameElement = async(indicator, stopName) => {
    const node = await document.createElement('h1');
    node.setAttribute('class', 'bus-board-title')
    node.innerHTML = (`${indicator} - ${stopName}`);
    return arrivals.appendChild(node);
}

const createArrivalsElement = async(data, indicator, stopName) => {
    await console.log(data);

    // Create Bus Board
    const nodeBusBoard = await document.createElement('div');
    nodeBusBoard.setAttribute('class', 'bus-board');
    nodeBusBoard.appendChild(await createStopNameElement(stopName, indicator));
    
    // Create Bus List and Fetch-Add all busses
    const nodeBusList = await document.createElement('ol');
    nodeBusList.setAttribute('class', 'bus-list');
    for(let bus of data){
        nodeBusList.setAttribute('data', `${bus.lineName}`);
        const node = await document.createElement('li');
        node.setAttribute('class', 'bus card');
        const busCard = `<span>${bus.lineName} </span><span>${bus.destinationName} </span><span>${bus.timeToStation}</span>`
        node.innerHTML = busCard;
        nodeBusList.appendChild(node);
    }
    nodeBusBoard.appendChild(nodeBusList);
    arrivals.appendChild(nodeBusBoard);
}

const busBoard = async () => {
    const postCodeInfo = await getPostcodeInfo(postcode.value);
    const stopPoints = await getBusStopPointsbyLonLat(postCodeInfo.lat, postCodeInfo.lon, OPTIONS.stopTypes, OPTIONS.radius);


    const arrivalBuses = await getBusPredictionsbyStopPoints(stopPoints);
    console.log(arrivalBuses)
}

const clearApp = async() => {
    arrivals.innerHTML = "";
}