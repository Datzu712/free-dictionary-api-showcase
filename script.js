import { DictionaryManager } from "./dictionaryManager.js";

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById('searchButton');
    const dictionaryManager = new DictionaryManager();

    function loadWordWrapped() {
        const word = searchInput.value.trim();
        if (word) {
            dictionaryManager.loadWord(word);
        }
    }

    searchButton.addEventListener('click', loadWordWrapped);

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") loadWordWrapped()
    });
});
