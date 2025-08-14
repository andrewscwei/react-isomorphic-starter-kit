/**
 * Locale identifier.
 */
export type Locale =
  | 'af' // Afrikaans
  | 'ak' // Akan
  | 'am' // Amharic
  | 'ar' // Arabic
  | 'as' // Assamese
  | 'az' // Azerbaijani
  | 'be' // Belarusian
  | 'bg' // Bulgarian
  | 'bm' // Bambara
  | 'bn' // Bangla
  | 'bo' // Tibetan
  | 'br' // Breton
  | 'bs' // Bosnian
  | 'ca' // Catalan
  | 'ce' // Chechen
  | 'cs' // Czech
  | 'cu' // Church Slavic
  | 'cy' // Welsh
  | 'da' // Danish
  | 'de' // German
  | 'dz' // Dzongkha
  | 'ee' // Ewe
  | 'el' // Greek
  | 'en' // English
  | 'eo' // Esperanto
  | 'es' // Spanish
  | 'et' // Estonian
  | 'eu' // Basque
  | 'fa' // Persian
  | 'ff' // Fulah
  | 'fi' // Finnish
  | 'fo' // Faroese
  | 'fr' // French
  | 'fy' // Western Frisian
  | 'ga' // Irish
  | 'gd' // Scottish Gaelic
  | 'gl' // Galician
  | 'gu' // Gujarati
  | 'gv' // Manx
  | 'ha' // Hausa
  | 'he' // Hebrew
  | 'hi' // Hindi
  | 'hr' // Croatian
  | 'hu' // Hungarian
  | 'hy' // Armenian
  | 'ia' // Interlingua
  | 'id' // Indonesian
  | 'ig' // Igbo
  | 'ii' // Sichuan Yi
  | 'is' // Icelandic
  | 'it' // Italian
  | 'ja' // Japanese
  | 'jv' // Javanese
  | 'ka' // Georgian
  | 'ki' // Kikuyu
  | 'kk' // Kazakh
  | 'kl' // Kalaallisut
  | 'km' // Khmer
  | 'kn' // Kannada
  | 'ko' // Korean
  | 'ks' // Kashmiri
  | 'ku' // Kurdish
  | 'kw' // Cornish
  | 'ky' // Kyrgyz
  | 'lb' // Luxembourgish
  | 'lg' // Ganda
  | 'ln' // Lingala
  | 'lo' // Lao
  | 'lt' // Lithuanian
  | 'lu' // Luba-Katanga
  | 'lv' // Latvian
  | 'mg' // Malagasy
  | 'mi' // Māori
  | 'mk' // Macedonian
  | 'ml' // Malayalam
  | 'mn' // Mongolian
  | 'mr' // Marathi
  | 'ms' // Malay
  | 'mt' // Maltese
  | 'my' // Burmese
  | 'nb' // Norwegian (Bokmål)
  | 'nd' // North Ndebele
  | 'ne' // Nepali
  | 'nl' // Dutch
  | 'nn' // Norwegian Nynorsk
  | 'no' // Norwegian
  | 'om' // Oromo
  | 'or' // Odia
  | 'os' // Ossetic
  | 'pa' // Punjabi
  | 'pl' // Polish
  | 'ps' // Pashto
  | 'pt' // Portuguese
  | 'pt_br' // Portuguese (Brazil)
  | 'pt_pt' // Portuguese (Portugal)
  | 'qu' // Quechua
  | 'rm' // Romansh
  | 'rn' // Rundi
  | 'ro' // Romanian
  | 'ru' // Russian
  | 'rw' // Kinyarwanda
  | 'sd' // Sindhi
  | 'se' // Northern Sami
  | 'sg' // Sango
  | 'si' // Sinhala
  | 'sk' // Slovak
  | 'sl' // Slovenian
  | 'sn' // Shona
  | 'so' // Somali
  | 'sq' // Albanian
  | 'sr' // Serbian
  | 'su' // Sundanese
  | 'sv' // Swedish
  | 'sw' // Swahili
  | 'ta' // Tamil
  | 'te' // Telugu
  | 'tg' // Tajik
  | 'th' // Thai
  | 'ti' // Tigrinya
  | 'tk' // Turkmen
  | 'to' // Tongan
  | 'tr' // Turkish
  | 'tt' // Tatar
  | 'ug' // Uyghur
  | 'uk' // Ukrainian
  | 'ur' // Urdu
  | 'uz' // Uzbek
  | 'vi' // Vietnamese
  | 'vo' // Volapük
  | 'wo' // Wolof
  | 'xh' // Xhosa
  | 'yi' // Yiddish
  | 'yo' // Yoruba
  | 'zh' // Chinese
  | 'zh_cn' // Chinese (Simplified)
  | 'zh_tw' // Chinese (Traditional)
  | 'zu' // Zulu
