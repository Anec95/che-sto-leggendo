// import { getData } from './request.js';

let closeButton = document.getElementsByClassName('fa-times')[0];
let infoContainer = document.getElementsByClassName('info-container')[0];
let researchPool = document.getElementsByClassName('research-results')[0];
let titlePanelInfo = document.getElementsByClassName('over-info')[0];
let titleResult = document.getElementsByClassName('title-result');
let titleInfoPanel = document.getElementsByClassName('title-over')[0];
let descriptionInfoPanel = document.getElementsByClassName('description-over')[0];
let middleContainer = document.getElementsByClassName('middle')[0];

function closeInfoDiv() {
    infoContainer.style.display = 'none';
}

closeButton.onclick = closeInfoDiv;


let type = 'all';
let research = '';
let researchForm = document.getElementsByClassName("research-div")[0];
let selectType = document.querySelector('select');
let textArea = document.getElementById('search-box');

function typeResearch(event) {
    type = event.target.value;
}

function researchText(event) {
    research = event.target.value;
}

async function researchSubmit(event) {
    event.preventDefault();
    try {
        const result = await getData(type, research);
        research = '';
        textArea.value = '';

        newBookParagraph(result)
    } catch(error) {
        console.log(error);
    }
}

textArea.onchange = researchText;
selectType.onchange = typeResearch;
researchForm.onsubmit = researchSubmit;

function newBookParagraph(result) {
    console.log(result)
    console.log(result.docs.length)
    // if (newResearchContainer){
    //     middleContainer.removeChild(newResearchContainer);
    // }
    for (let i=0; i<result.docs.length; i++) {
        // let newResearchContainer = document.createElement('div');
        // middleContainer.appendChild(newResearchContainer);
        // newResearchContainer.setAttribute('class', 'research-results');

        let newBook = document.createElement('div');
        researchPool.appendChild(newBook);
        newBook.setAttribute('class', 'result-container');
        newBook.addEventListener('click', () => {bookClick(result.docs[i].key)})

        let newBookImg = document.createElement('img');
        newBook.appendChild(newBookImg);
        newBookImg.setAttribute('class', 'result-img');
        newBookImg.src = './assets/images/IMG_20220808_191905_436.jpg';

        let newBookGenericInfo = document.createElement('div');
        newBook.appendChild(newBookGenericInfo);
        newBookGenericInfo.setAttribute('class', 'result-info');

        let newBookTitle = document.createElement('div');
        newBookGenericInfo.appendChild(newBookTitle);
        newBookTitle.setAttribute('class', 'title-result');
        newBookTitle.innerText = result.docs[i].title;

        let newBookDescription = document.createElement('div');
        newBookGenericInfo.appendChild(newBookDescription);
        newBookDescription.setAttribute('class', 'description-result');

        let newBookQuotation = document.createElement('div');
        newBookGenericInfo.appendChild(newBookQuotation);
        newBookQuotation.setAttribute('class', 'quotation');
    }
    
}

async function getData(researchType, researchValue) {
    const urlBasic = 'https://openlibrary.org/search.json?';
    let urlFinal;

    if (researchType === 'all') {
        urlFinal = urlBasic + 'q='+ researchValue;
    } else if (researchType === 'subject') {
        urlFinal = urlBasic + 'subject=' + researchValue + '&limit=100';
    } else if (researchType === 'author') {
        urlFinal = urlBasic + 'author=' + researchValue;
    } else if (researchType === 'title') {
        urlFinal = urlBasic + 'title=' + researchValue + '&limit=100';
    }
    console.log(urlFinal)
    try{
        let response = await fetch(urlFinal);
        let data = await response.json();
        // console.log(data);
        return data;
    } catch(error){
        throw new Error(error.message);
    }
}

async function dataBook(keyBook) {
    try{
        let response = await fetch(`https://openlibrary.org${keyBook}.json`);
        let dataBook = await response.json();
        console.log(dataBook);
        return dataBook;
    } catch(error){
        throw new Error(error.message);
    }
}

function showInfoDiv(book) {
    titleInfoPanel.innerText = book.title;   
    if (book.description) {
        descriptionInfoPanel.innerText = book.description;
    } else {
        descriptionInfoPanel.innerText = "Description's book is not available";
    }
    infoContainer.style.display = 'block';
}

async function bookClick(key) {
    try {
        let book = await dataBook(key);        
        showInfoDiv(book)
    } catch(error){
        throw new Error(error.message);
    }
}




