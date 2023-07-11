
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
const postcode = document.getElementById('postcode');
const postcodeSubmit = document.getElementById('postcodeSubmit');


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
        console.log("loading")
        const response = await fetch(`${POSTCODE_URL}/${postcode}`)
            .then(response => {
                if(response.ok){
                    postCodeInfo = response.json()
                } else {
                    throw new error('Something gone wrong');
                }
            })
                
    } catch (err) {
        console.log('There was an error', err);
    }

    return postCodeInfo;
}

const busBoard = async () => {
    const postCodeInfo = await getPostcodeInfo(postcode.value);
    console.log(postCodeInfo)
}