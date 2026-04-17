const form = document.getElementById('search-form')


// add event listener to the form submit event
form.addEventListener('submit', function(event){
    event.preventDefault()

    const word = document.getElementById('word-input').value.trim();
    if(word){
        searchUpWord(word)
    }
})


// fetch api with async/await

async function searchUpWord(word){
    //show loading state
    const loading = document.getElementById('loading');
    const placeholder = document.getElementById('placeholder-text');
    const resultContent = document.getElementById('result-content');

    loading.style.display = 'block'
    placeholder.style.display = 'none'
    resultContent.innerHTML = ''


    //reset styling
    const resultBox = document.getElementById('result-box')
    resultBox.classList.remove('has-result', 'has-error')


    // try/catch
    try{
        const response = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        )

        if (!response.ok) {
            throw new Error('Word not found')
        }

        const data = await response.json()


        displayResults(data, word)

    } catch (error) {
        displayError(error.message, word)
    } finally {
        //runs whether it succeeded or failed

        document.getElementById('loading').style.display = 'none'
    } 

}

function displayResults(data, word) {
    const resultBox = document.getElementById('result-box');
    const resultContent = document.getElementById('result-content');
 
    const entry = data[0];
    const phonetic = entry.phonetic || '';
 
    let html = `
        <div class="word-title">${entry.word}</div>
        <div class="phonetic mb-3">${phonetic}</div>
    `;
 
    // Loop through meanings (noun, verb, adjective,)
    entry.meanings.forEach(function(meaning) {
        html += `<span class="part-of-speech">${meaning.partOfSpeech}</span>`;
 
        // Show up to 3 definitions per meaning
        meaning.definitions.slice(0, 3).forEach(function(def, index) {
            html += `<p class="definition-text"><strong>${index + 1}.</strong> ${def.definition}</p>`;
 
            if (def.example) {
                html += `<p class="example-text">"${def.example}"</p>`;
            }
        });
 
        // Show synonyms if available
        if (meaning.synonyms && meaning.synonyms.length > 0) {
            html += `<div class="mb-3"><strong>Synonyms: </strong>`;
            meaning.synonyms.slice(0, 5).forEach(function(syn) {
                html += `<span class="synonym-badge">  ${syn}   </span>`;
            });
            html += `</div>`;
        }
 
        html += '<hr>';
    });
 
    // Inject the built HTML string into the page
    resultContent.innerHTML = html;
 
    // Dynamically update CSS using JavaScript
    resultBox.classList.add('has-result');
}



function displayError(message, word) {
    const resultBox = document.getElementById('result-box');
    const resultContent = document.getElementById('result-content');
 
    resultContent.innerHTML = `
        <div class="text-center">
            <p style="font-size: 2rem;">🤔</p>
            <p class="text-danger fw-bold">Could not find "<em>${word}</em>"</p>
            <p class="text-muted">Check the spelling and try again.</p>
        </div>
    `;
 
    // Dynamically change the box style to signal an error
    resultBox.classList.add('has-error');
}


