export async function getData(researchType, researchValue) {
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