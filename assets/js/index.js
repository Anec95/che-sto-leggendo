const closeButton = document.getElementsByClassName('fa-times')[0];
const infoContainer = document.getElementsByClassName('info-container')[0];
const titlePanelInfo = document.getElementsByClassName('over-info')[0];
const titleResult = document.getElementsByClassName('title-result');
const titleInfoPanel = document.getElementsByClassName('title-over')[0];
const authorsInfoPanel = document.getElementsByClassName('authors-over')[0];
const descriptionInfoPanel = document.getElementsByClassName('description-over')[0];
const imgInfoPanel = document.getElementsByClassName('over-img')[0];
const yearInfoPanel = document.getElementsByClassName('year-over')[0];
const subjectsInfoPanel = document.getElementsByClassName('subjects-over')[0];
const middleContainer = document.getElementsByClassName('middle')[0];
const loadingDiv = document.getElementsByClassName('loading-container')[0];

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
        // for empty text box research
        if (research === '') {
            throw new Error("Text area can't be empty")
        }

        if (document.getElementsByClassName('research-results')[0]){
            middleContainer.removeChild(document.getElementsByClassName('research-results')[0]);
        } 
        //if research starts
        loadingDiv.style.display = 'block';

        const result = await getData(type, research);
        research = '';
        textArea.value = '';
        if (result.docs.length === 0) {
            throw new Error('The search returned no results')
        }

        loadingDiv.style.display = 'none';
        
        newBooksResearch(result)
    } catch(error) {
        loadingDiv.style.display = 'none';
        alert(error.message)
        // console.log(error);        
    }   
}

textArea.onchange = researchText;
selectType.onchange = typeResearch;
researchForm.onsubmit = researchSubmit;

function newBooksResearch(result) {      
    let researchPool = document.createElement('div');
    middleContainer.appendChild(researchPool);
    researchPool.setAttribute('class', 'research-results');
    newBook(researchPool, result) 
}

//create the book div with img/title/author/n. of pages
function newBook(researchPool, result) {
    for (let i=0; i<result.docs.length; i++) {
        let newBook = document.createElement('div');
        researchPool.appendChild(newBook);
        newBook.setAttribute('class', 'result-container');
        newBook.addEventListener('click', () => {bookClick(result.docs[i].key)});

        let newBookImg = document.createElement('img');
        newBook.appendChild(newBookImg);
        newBookImg.setAttribute('class', 'result-img');
        if (result.docs[i].cover_i) {
            newBookImg.src = `https://covers.openlibrary.org/b/id/${result.docs[i].cover_i}-L.jpg`;
        } else {
            newBookImg.src = './assets/images/book.png';
        }    

        let newBookGenericInfo = document.createElement('div');
        newBook.appendChild(newBookGenericInfo);
        newBookGenericInfo.setAttribute('class', 'result-info');

        let newBookTitle = document.createElement('div');
        newBookGenericInfo.appendChild(newBookTitle);
        newBookTitle.setAttribute('class', 'title-result');
        if (result.docs[i].title && result.docs[i].author_name) {
            newBookTitle.innerText = `${result.docs[i].title} - ${result.docs[i].author_name[0]}`;
        } else if (result.docs[i].title) {
            newBookTitle.innerText = `${result.docs[i].title} - Unknown`;
        }

        let newBookFirstSentence = document.createElement('div');
        newBookGenericInfo.appendChild(newBookFirstSentence);
        newBookFirstSentence.setAttribute('class', 'description-result');
        if (result.docs[i].first_sentence) {
            newBookFirstSentence.innerText = result.docs[i].first_sentence;
        } else {
            newBookFirstSentence.innerText = '';
        }
        
        let newBookPageNumber = document.createElement('div');
        newBookGenericInfo.appendChild(newBookPageNumber);
        newBookPageNumber.setAttribute('class', 'number-page');
        if (result.docs[i].number_of_pages_median) {
            newBookPageNumber.innerText = `Number of pages ${result.docs[i].number_of_pages_median}`;
        } else {
            newBookPageNumber.innerText = '';
        }
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

//it takes the data's book when you click on one of them in the research pool
async function dataBook(keyBook) {
    try{
        let response = await fetch(`https://openlibrary.org${keyBook}.json`);
        let infoBook = await response.json();
        // console.log(infoBook);
        return infoBook;
    } catch(error){
        throw new Error(error.message);
    }
}

//it takes the data's author when you click on one of book shown in the research pool
async function dataAuthor(keyAuthor) {
    try{
        let response = await fetch(`https://openlibrary.org${keyAuthor}.json`);
        let infoAuthor = await response.json();
        // console.log(infoAuthor);
        return infoAuthor;
    } catch(error){
        throw new Error(error.message);
    }
}

//shows the panel with the info of the book
async function showInfoDiv(book) {
    //takes the title of the book and passes to the panel
    titleInfoPanel.innerText = book.title;
    //if exists, takes the authors of the book and passes to the panel
    if (book.authors) {
        let author = await dataAuthor(book.authors[0].author.key);
        authorsInfoPanel.innerHTML = `<strong>Author:</strong> ${author.name}`;
    } else {
        authorsInfoPanel.innerText = '';
    }  
    //if exists, takes the description of the book and passes to the panel  
    if (typeof book.description === 'object') {
        descriptionInfoPanel.innerHTML = `<strong>Description:</strong> ${book.description.value}`;
    } else if (typeof book.description === 'string') {
        descriptionInfoPanel.innerHTML = `<strong>Description:</strong> ${book.description}`;
    } else if (book.excerpts) {
        descriptionInfoPanel.innerText = book.excerpts[0];
    } else {
        descriptionInfoPanel.innerText = "Description's book is not available";
    }
    //if exists, takes the cover of the book and passes to the panel
    if (book.covers) {
        imgInfoPanel.src = `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`;
    } else {
        imgInfoPanel.src = "./assets/images/book.png";
    }
    //if exists, takes the year of publication of the book and passes to the panel
    if (book.first_publish_date) {
        yearInfoPanel.innerHTML = `<strong>First release:</strong> ${book.first_publish_date}`;
    } else {
        yearInfoPanel.innerText = '';
    }
    //if exists, takes the subjects of the book and passes to the panel
    if (book.subjects) {
        subjectsInfoPanel.innerHTML = `<strong>Subjects:</strong> ${book.subjects.join(', ')}`;
    } else{
        subjectsInfoPanel.innerText = '';
    }
    infoContainer.style.display = 'block';
}

async function bookClick(key) {
    try {
        let book = await dataBook(key);
        showInfoDiv(book)
    } catch(error){
        alert("Book's data not available")
    }
}




