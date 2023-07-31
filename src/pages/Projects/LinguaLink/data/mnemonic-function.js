
export const mnemonicFunction = {
    "name": "display_mnemonic",
    "description": "If the vocabulary word is not recognized, then similar words are displayed that the user may have meant. Otherwise, displays a mnemonic to help retain and be able to recall the translation of the vocabulary word. Also displays and a mental image for the mnemonic, as well as additional information.",
    "parameters": {
        "type": "object",
        "properties": {
            "word_recognized": {
                "type": "boolean",
                "description": "True if vocabulary word is recognized and valid, false otherwise."
            },
            "similar_words": {
                "type": "array",
                "minItems": 0,
                "maxItems": 4,
                "description": "An array of similar words and their translations that the user may have meant instead of their mistaken input.",
                "items": {
                    "type": "object",
                    "properties": {
                        "possible_word": {
                            "type": "string",
                            "description": "One of the similar words that the user may have meant instead of their mistaken input."
                        },
                        "possible_word_translation": {
                            "type": "string",
                            "description": "The translation of the word."
                        }
                    },
                    "required": [
                        "possible_word",
                        "possible_word_translation"
                    ]
                }
            },
            "word": {
                "type": "string",
                "description": "the vocabulary word."
            },
            "translation": {
                "type": "string",
                "description": "The word's translation."
            },
            "pronunciation": {
                "type": "string",
                "description": "The pronunciation or transliteration of the word. For Chinese vocabulary words, it is the pinyin.",
                "minLength": 1
            },
            "is_verb": {
                "type": "boolean",
                "definition": "Whether the vocabulary word is a verb or not."
            },
            "infinitive": {
                "type": "string",
                "description": "The infinitive form of the vocabulary word if it is a verb.",
                "minLength": 1
            },
            "mnemonic": {
                "type": "string",
                "description": "A short mnemonic with semantic similarity to the vocabulary word. The mnemonic must be a valid word or phrase in English."
            },
            "mental_image": {
                "type": "string",
                "description": "A vivid mental image that relates the mnemonic to the word's translation using Linkword Mnemonics and Elaborative Encoding. One phrase or sentence. No letters or words are displayed within the mental image."
            },
            "explanation": {
                "type": "string",
                "description": "An explanation to the user of how and why to effectively use the mnemonic as a Linkword to encode the mnemonic, and the mental image to recall the vocabulary word's translation the next time the word is encountered."
            }
        },
        "required": [
            "word_recognized"
        ],
        "if": {
            "properties": {
                "word_recognized": {
                    "enum": [
                        false
                    ]
                }
            }
        },
        "then": {
            "required": [
                "similar_words"
            ]
        },
        "else": {
            "required": [
                "word",
                "translation",
                "pronunciation",
                "is_verb",
                "mnemonic",
                "mental_image",
                "explanation"
            ],
            "if": {
                "properties": {
                    "is_verb": {
                        "enum": [
                            true
                        ]
                    }
                }
            },
            "then": {
                "required": [
                    "infinitive"
                ]
            }
        }
    }
}