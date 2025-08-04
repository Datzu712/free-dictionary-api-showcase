/**
 * Represents a phonetic transcription with optional audio
 * @typedef {Object} PhoneticEntry
 * @property {string} text - The phonetic transcription (IPA notation)
 * @property {string} [audio] - Optional URL to audio pronunciation file
 */

/**
 * Represents a word definition with examples and related terms
 * @typedef {Object} Definition
 * @property {string} definition - The definition text
 * @property {string} [example] - Optional usage example
 * @property {string[]} synonyms - Array of synonym words
 * @property {string[]} antonyms - Array of antonym words
 */

/**
 * Represents a part of speech with its definitions
 * @typedef {Object} Meaning
 * @property {string} partOfSpeech - The grammatical category (e.g., "noun", "verb", "exclamation")
 * @property {Definition[]} definitions - Array of definitions for this part of speech
 */

/**
 * Represents a complete dictionary entry for a word
 * @typedef {Object} DictionaryEntry
 * @property {string} word - The word being defined
 * @property {string} [phonetic] - Primary phonetic transcription
 * @property {PhoneticEntry[]} phonetics - Array of phonetic transcriptions with optional audio
 * @property {string} [origin] - Etymology and origin information
 * @property {Meaning[]} meanings - Array of meanings grouped by part of speech
 */

/**
 * Dictionary API response containing word definitions
 * @typedef {DictionaryEntry[]} DictionaryResponse
 */

export class BadgeElement extends HTMLElement {
	constructor() {
		super();

		const span = document.createElement("span");
		span.className =
			"badge rounded-pill bg-light text-dark border me-1 mb-1";
		span.textContent = this.getAttribute("label") || "";

		this.appendChild(span);
	}
}

// todo: refactor this custom element with better practices :)
export class WordInformationElement extends HTMLElement {
	constructor() {
		super();
	}

	/**
	 * Called when the element is inserted into the DOM
	 * Validates and parses the wordData attribute, then renders the content
	 *
	 * @throws {Error} When wordData attribute is missing
	 * @throws {Error} When wordData contains invalid JSON
	 */
	connectedCallback() {
		let wordData = this.getAttribute("wordData");
		if (!wordData) {
			throw new Error("wordData attribute is required");
		}

		if (typeof wordData === "string") {
			try {
				wordData = JSON.parse(wordData);
			} catch (error) {
				throw new Error("Invalid JSON string in wordData attribute");
			}
		}

		this.render(wordData);
	}

	/**
	 * Renders the complete word information UI
	 * Creates the main structure with word title and iterates through meanings
	 *
	 * @param {DictionaryEntry} wordData - Dictionary entry object containing word information
	 */
	render(wordData) {
		let htmlContent = `
            <div class="mb-4">
                <h5 class="card-title" id="wordTitle">
                    Definitions of
                    <span class="text-primary"
                        >${wordData.word}</span
                    >
                </h5>
            </div>

        `;

		for (const meaning of wordData.meanings) {
			htmlContent += `
                <div class="mb-4">
                    <h6
                        class="text-primary fw-bold small text-lowercase mb-2"
                    >
                        ${meaning.partOfSpeech}
                    </h6>
                    ${this.getDefinitionsInformation(meaning.definitions)}
                </div>
            `;
		}

		this.innerHTML = htmlContent;
	}

	/**
	 * Generates HTML for all definitions within a specific part of speech
	 * Creates numbered list of definitions with optional metadata
	 *
	 * @param {Definition[]} definitions - Array of definition objects
	 * @returns {string} HTML string containing formatted definitions
	 */
	getDefinitionsInformation(definitions) {
		let definitionsText = "";

		for (const definitionData of definitions) {
			const index = definitions.indexOf(definitionData);

			definitionsText += `
                <div class="mb-3">
                    <div class="d-flex align-items-start">
                        <span
                            class="text-muted fw-bold me-2"
                            style="width: 20px"
                            >${index}</span
                        >
                        <div class="flex-grow-1">
                            <p class="text-dark mb-2 lh-sm">
                                ${definitionData.definition}
                            </p>
                            ${
								definitionData.synonyms.length > 0 ||
								definitionData.antonyms.length > 0
									? this.getExtraDefinitionMetadata(
											definitionData,
									  )
									: ""
							}
                        </div>
                    </div>
                </div>
            `;
		}

		return definitionsText;
	}

	/**
	 * Generates HTML for synonyms and antonyms metadata
	 * Only renders sections that have content (non-empty arrays)
	 * Uses custom-badge elements for displaying related words
	 *
	 * @param {Definition} definition - Definition object containing synonyms and antonyms
	 * @returns {string} HTML string containing synonyms and antonyms sections
	 */
	getExtraDefinitionMetadata(definition) {
		let text = `<div class="ms-0"> `;

		if (definition.synonyms.length) {
			text += `
                <div class="text-muted small mb-2">
                    Synonyms:
                </div>
                ${definition.synonyms
					.map((t) => `<custom-badge label="${t}"></custom-badge>`)
					.join("")}
            `;
		}

		if (definition.antonyms.length) {
			text += `
                <div class="text-muted small mb-2">
                    Antonyms:
                </div>
                ${definition.antonyms
					.map((t) => `<custom-badge label="${t}"></custom-badge>`)
					.join("")}
            `;
		}

		text += `</div>`;

		return text;
	}
}

customElements.define("custom-badge", BadgeElement);
customElements.define("word-information", WordInformationElement);
