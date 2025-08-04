export const API_URL = Object.freeze('https://api.dictionaryapi.dev/api/v2/entries/en/');

export class DictionaryManager {
    constructor() {
        this.currentWord = '';
        this.wordData = {};
        this.offcanvas = new bootstrap.Offcanvas(document.getElementById('word-info-offcanvas'))
        this.audio = document.getElementById('wordPronunciation');
        this.offcanvasContent = document.getElementById('word-info-offcanvas-content');
    }

    updateDOM() {
        this.offcanvasContent.innerHTML = '';

        document.getElementById('offcanvasTopLabel').textContent = this.currentWord;
        document.querySelector('#wordSpell small').textContent = this.wordData.phonetic;

        const audioPronunciationUrl = this.getWordPronunciation();
        if (audioPronunciationUrl) {
            this.audio.src = audioPronunciationUrl.audio;
        }

        const wordInformationElement = document.createElement('word-information');
        wordInformationElement.setAttribute('wordData', JSON.stringify(this.wordData));

        this.offcanvasContent.appendChild(wordInformationElement);

        console.debug('Showing offcanvas...');
        this.offcanvas.show();
    }

    async fetchWordData(word) {
        try {
            const response = await fetch(API_URL + word);
            if (!response.ok) {
                alert("Word not found. Please try another word.");
                console.error(response);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching data:", error);
            alert('An error occurred during the fetch operation...');
        }
    }

    async loadWord(word) {
        const wordData = await this.fetchWordData(word);

        this.wordData = wordData[0]; // todo: handle multiple word responses
        this.currentWord = wordData[0].word;

        this.updateDOM();
    }

    getWordPronunciation() {
        if (!this.wordData) return null;

        return this.wordData.phonetics?.find((phonetic) => phonetic.audio) ?? null;
    }
}