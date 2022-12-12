let closeButton = document.getElementsByClassName('fa-times')[0];
let resultContainer = document.getElementsByClassName('result-container');
let infoContainer = document.getElementsByClassName('info-container')[0];
let researchPool = document.getElementsByClassName('research-results')[0];
let titlePanelInfo = document.getElementsByClassName('over-info')[0];
// let titleResult = document.getElementsByClassName('title-result');

// function showInfoDiv() {
//     infoContainer.style.display = 'block';
// }

// resultContainer.onclick = showInfoDiv;

function closeInfoDiv() {
    infoContainer.style.display = 'none';
}

closeButton.onclick = closeInfoDiv;



researchPool.onclick = function(event) {
    let numberDiv = event.target.index; 
    console.log(numberDiv)
    infoContainer.style.display = 'block';
    let titleResult = event.target.getElementsByClassName('title-result');
    titlePanelInfo.innerText = titleResult[numberDiv].textContent;
}