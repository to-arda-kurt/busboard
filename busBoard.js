import fetch from 'node-fetch'

const stopPointURI = `https://api.tfl.gov.uk/StopPoint/`
const stopPoint = `490008660N`
const POSTCODE_API = `https://api.postcodes.io/postcodes/`


let stopDetails;


const getArrivals = async (stopPoint) => {
    try {
        await fetch(`${stopPointURI}${stopPoint}/Arrivals`)
            .then(response => response.json())
            .then(body => {
                stopDetails = body;
                // console.log(stopDetail);
                arrivalPredictions(stopDetails);
            })

    } catch (error) {
        console.log(error)
    }
}


const arrivalPredictions = stopDetails => {
    stopDetails.forEach((detail, i) => {
        console.log(`${i + 1} : ${detail.platformName} - ${detail.stationName} => ${detail.lineName} towards ${detail.towards} in ${(detail.timeToStation / 60).toFixed(0)} \n`)
    });
}

getArrivals(stopPoint);



