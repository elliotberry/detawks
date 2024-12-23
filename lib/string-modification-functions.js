import {
    camelCase, // `camelCase`
    capitalCase, // `Capital Case`
    constantCase, // `CONSTANT_CASE`
    dotCase, // `dot.case`
    headerCase, // `Header-Case`
    lowerCase, // `lower case`
    lowerCaseFirst, // `lOWER CASE FIRST`
    noCase, // `no case`
    paramCase, // `param-case`
    pascalCase, // `PascalCase`
    pathCase, // `path/case`
    snakeCase, // `snake_case`
    swapCase, // `sWaP cAsE` -> `SwAp CaSe`
    titleCase, // `Title Case`
    upperCase, // `UPPER CASE`
    upperCaseFirst, // `Upper case first`
} from 'text-case'

const stringModificationFunctions = {
    doSwaps: {
        fn: (string_) => {
            // remove accents, swap ñ for n, etc
            const swaps = {
                '(c)': ['©'],
                0: ['°', '₀', '۰', '０'],
                1: ['¹', '₁', '۱', '１'],
                2: ['²', '₂', '۲', '２'],
                3: ['³', '₃', '۳', '３'],
                4: ['⁴', '₄', '۴', '٤', '４'],
                5: ['⁵', '₅', '۵', '٥', '５'],
                6: ['⁶', '₆', '۶', '٦', '６'],
                7: ['⁷', '₇', '۷', '７'],
                8: ['⁸', '₈', '۸', '８'],
                9: ['⁹', '₉', '۹', '９'],
                a: [
                    'à',
                    'á',
                    'ả',
                    'ã',
                    'ạ',
                    'ă',
                    'ắ',
                    'ằ',
                    'ẳ',
                    'ẵ',
                    'ặ',
                    'â',
                    'ấ',
                    'ầ',
                    'ẩ',
                    'ẫ',
                    'ậ',
                    'ā',
                    'ą',
                    'å',
                    'α',
                    'ά',
                    'ἀ',
                    'ἁ',
                    'ἂ',
                    'ἃ',
                    'ἄ',
                    'ἅ',
                    'ἆ',
                    'ἇ',
                    'ᾀ',
                    'ᾁ',
                    'ᾂ',
                    'ᾃ',
                    'ᾄ',
                    'ᾅ',
                    'ᾆ',
                    'ᾇ',
                    'ὰ',
                    'ά',
                    'ᾰ',
                    'ᾱ',
                    'ᾲ',
                    'ᾳ',
                    'ᾴ',
                    'ᾶ',
                    'ᾷ',
                    'а',
                    'أ',
                    'အ',
                    'ာ',
                    'ါ',
                    'ǻ',
                    'ǎ',
                    'ª',
                    'ა',
                    'अ',
                    'ا',
                    'ａ',
                    'ä',
                ],
                A: [
                    'Á',
                    'À',
                    'Ả',
                    'Ã',
                    'Ạ',
                    'Ă',
                    'Ắ',
                    'Ằ',
                    'Ẳ',
                    'Ẵ',
                    'Ặ',
                    'Â',
                    'Ấ',
                    'Ầ',
                    'Ẩ',
                    'Ẫ',
                    'Ậ',
                    'Å',
                    'Ā',
                    'Ą',
                    'Α',
                    'Ά',
                    'Ἀ',
                    'Ἁ',
                    'Ἂ',
                    'Ἃ',
                    'Ἄ',
                    'Ἅ',
                    'Ἆ',
                    'Ἇ',
                    'ᾈ',
                    'ᾉ',
                    'ᾊ',
                    'ᾋ',
                    'ᾌ',
                    'ᾍ',
                    'ᾎ',
                    'ᾏ',
                    'Ᾰ',
                    'Ᾱ',
                    'Ὰ',
                    'Ά',
                    'ᾼ',
                    'А',
                    'Ǻ',
                    'Ǎ',
                    'Ａ',
                    'Ä',
                ],
                aa: ['ع', 'आ', 'آ'],
                ae: ['æ', 'ǽ'],
                AE: ['Æ', 'Ǽ'],
                ai: ['ऐ'],
                b: ['б', 'β', 'ب', 'ဗ', 'ბ', 'ｂ'],
                B: ['Б', 'Β', 'ब', 'Ｂ'],
                c: ['ç', 'ć', 'č', 'ĉ', 'ċ', 'ｃ'],
                C: ['Ç', 'Ć', 'Č', 'Ĉ', 'Ċ', 'Ｃ'],
                ch: ['ч', 'ჩ', 'ჭ', 'چ'],
                Ch: ['Ч'],
                d: [
                    'ď',
                    'ð',
                    'đ',
                    'ƌ',
                    'ȡ',
                    'ɖ',
                    'ɗ',
                    'ᵭ',
                    'ᶁ',
                    'ᶑ',
                    'д',
                    'δ',
                    'د',
                    'ض',
                    'ဍ',
                    'ဒ',
                    'დ',
                    'ｄ',
                ],
                D: ['Ď', 'Ð', 'Đ', 'Ɖ', 'Ɗ', 'Ƌ', 'ᴅ', 'ᴆ', 'Д', 'Δ', 'Ｄ'],
                dj: ['ђ', 'đ'],
                Dj: ['Ђ'],
                dz: ['џ', 'ძ'],
                Dz: ['Џ'],
                e: [
                    'é',
                    'è',
                    'ẻ',
                    'ẽ',
                    'ẹ',
                    'ê',
                    'ế',
                    'ề',
                    'ể',
                    'ễ',
                    'ệ',
                    'ë',
                    'ē',
                    'ę',
                    'ě',
                    'ĕ',
                    'ė',
                    'ε',
                    'έ',
                    'ἐ',
                    'ἑ',
                    'ἒ',
                    'ἓ',
                    'ἔ',
                    'ἕ',
                    'ὲ',
                    'έ',
                    'е',
                    'ё',
                    'э',
                    'є',
                    'ə',
                    'ဧ',
                    'ေ',
                    'ဲ',
                    'ე',
                    'ए',
                    'إ',
                    'ئ',
                    'ｅ',
                ],
                E: [
                    'É',
                    'È',
                    'Ẻ',
                    'Ẽ',
                    'Ẹ',
                    'Ê',
                    'Ế',
                    'Ề',
                    'Ể',
                    'Ễ',
                    'Ệ',
                    'Ë',
                    'Ē',
                    'Ę',
                    'Ě',
                    'Ĕ',
                    'Ė',
                    'Ε',
                    'Έ',
                    'Ἐ',
                    'Ἑ',
                    'Ἒ',
                    'Ἓ',
                    'Ἔ',
                    'Ἕ',
                    'Έ',
                    'Ὲ',
                    'Е',
                    'Ё',
                    'Э',
                    'Є',
                    'Ə',
                    'Ｅ',
                ],
                ei: ['ऍ'],
                f: ['ф', 'φ', 'ف', 'ƒ', 'ფ', 'ｆ'],
                F: ['Ф', 'Φ', 'Ｆ'],
                g: ['ĝ', 'ğ', 'ġ', 'ģ', 'г', 'ґ', 'γ', 'ဂ', 'გ', 'گ', 'ｇ'],
                G: ['Ğ', 'Ġ', 'Ģ', 'Г', 'Ґ', 'Γ', 'Ｇ'],
                gh: ['غ', 'ღ'],
                Gx: ['Ĝ'],
                h: ['ĥ', 'ħ', 'η', 'ή', 'ح', 'ه', 'ဟ', 'ှ', 'ჰ', 'ｈ'],
                H: ['Η', 'Ή', 'Ħ', 'Ｈ'],
                Hx: ['Ĥ'],
                i: [
                    'í',
                    'ì',
                    'ỉ',
                    'ĩ',
                    'ị',
                    'î',
                    'ï',
                    'ī',
                    'ĭ',
                    'į',
                    'ı',
                    'ι',
                    'ί',
                    'ϊ',
                    'ΐ',
                    'ἰ',
                    'ἱ',
                    'ἲ',
                    'ἳ',
                    'ἴ',
                    'ἵ',
                    'ἶ',
                    'ἷ',
                    'ὶ',
                    'ί',
                    'ῐ',
                    'ῑ',
                    'ῒ',
                    'ΐ',
                    'ῖ',
                    'ῗ',
                    'і',
                    'ї',
                    'и',
                    'ဣ',
                    'ိ',
                    'ီ',
                    'ည်',
                    'ǐ',
                    'ი',
                    'इ',
                    'ی',
                    'ｉ',
                ],
                I: [
                    'Í',
                    'Ì',
                    'Ỉ',
                    'Ĩ',
                    'Ị',
                    'Î',
                    'Ï',
                    'Ī',
                    'Ĭ',
                    'Į',
                    'İ',
                    'Ι',
                    'Ί',
                    'Ϊ',
                    'Ἰ',
                    'Ἱ',
                    'Ἳ',
                    'Ἴ',
                    'Ἵ',
                    'Ἶ',
                    'Ἷ',
                    'Ῐ',
                    'Ῑ',
                    'Ὶ',
                    'Ί',
                    'И',
                    'І',
                    'Ї',
                    'Ǐ',
                    'ϒ',
                    'Ｉ',
                ],
                ii: ['ई'],
                ij: ['ĳ'],
                Ij: ['Ĳ'],
                j: ['ĵ', 'ј', 'Ј', 'ჯ', 'ج', 'ｊ'],
                J: ['Ｊ'],
                Jx: ['Ĵ'],
                k: [
                    'ķ',
                    'ĸ',
                    'к',
                    'κ',
                    'Ķ',
                    'ق',
                    'ك',
                    'က',
                    'კ',
                    'ქ',
                    'ک',
                    'ｋ',
                ],
                K: ['К', 'Κ', 'Ｋ'],
                kh: ['х', 'خ', 'ხ'],
                Kh: ['Х'],
                l: ['ł', 'ľ', 'ĺ', 'ļ', 'ŀ', 'л', 'λ', 'ل', 'လ', 'ლ', 'ｌ'],
                L: ['Ĺ', 'Ł', 'Л', 'Λ', 'Ļ', 'Ľ', 'Ŀ', 'ल', 'Ｌ'],
                lj: ['љ'],
                Lj: ['Љ'],
                m: ['м', 'μ', 'م', 'မ', 'მ', 'ｍ'],
                M: ['М', 'Μ', 'Ｍ'],
                n: [
                    'ñ',
                    'ń',
                    'ň',
                    'ņ',
                    'ŉ',
                    'ŋ',
                    'ν',
                    'н',
                    'ن',
                    'န',
                    'ნ',
                    'ｎ',
                ],
                N: ['Ń', 'Ñ', 'Ň', 'Ņ', 'Ŋ', 'Н', 'Ν', 'Ｎ'],
                nj: ['њ'],
                Nj: ['Њ'],
                o: [
                    'ó',
                    'ò',
                    'ỏ',
                    'õ',
                    'ọ',
                    'ô',
                    'ố',
                    'ồ',
                    'ổ',
                    'ỗ',
                    'ộ',
                    'ơ',
                    'ớ',
                    'ờ',
                    'ở',
                    'ỡ',
                    'ợ',
                    'ø',
                    'ō',
                    'ő',
                    'ŏ',
                    'ο',
                    'ὀ',
                    'ὁ',
                    'ὂ',
                    'ὃ',
                    'ὄ',
                    'ὅ',
                    'ὸ',
                    'ό',
                    'о',
                    'و',
                    'θ',
                    'ို',
                    'ǒ',
                    'ǿ',
                    'º',
                    'ო',
                    'ओ',
                    'ｏ',
                    'ö',
                ],
                O: [
                    'Ó',
                    'Ò',
                    'Ỏ',
                    'Õ',
                    'Ọ',
                    'Ô',
                    'Ố',
                    'Ồ',
                    'Ổ',
                    'Ỗ',
                    'Ộ',
                    'Ơ',
                    'Ớ',
                    'Ờ',
                    'Ở',
                    'Ỡ',
                    'Ợ',
                    'Ø',
                    'Ō',
                    'Ő',
                    'Ŏ',
                    'Ο',
                    'Ό',
                    'Ὀ',
                    'Ὁ',
                    'Ὂ',
                    'Ὃ',
                    'Ὄ',
                    'Ὅ',
                    'Ὸ',
                    'Ό',
                    'О',
                    'Θ',
                    'Ө',
                    'Ǒ',
                    'Ǿ',
                    'Ｏ',
                    'Ö',
                ],
                oe: ['ö', 'œ', 'ؤ'],
                Oe: ['Œ'],
                oi: ['ऑ'],
                oii: ['ऒ'],
                p: ['п', 'π', 'ပ', 'პ', 'پ', 'ｐ'],
                P: ['П', 'Π', 'Ｐ'],
                ps: ['ψ'],
                Ps: ['Ψ'],
                q: ['ყ', 'ｑ'],
                Q: ['Ｑ'],
                r: ['ŕ', 'ř', 'ŗ', 'р', 'ρ', 'ر', 'რ', 'ｒ'],
                R: ['Ř', 'Ŕ', 'Р', 'Ρ', 'Ŗ', 'Ｒ'],
                s: [
                    'ś',
                    'š',
                    'ş',
                    'с',
                    'σ',
                    'ș',
                    'ς',
                    'س',
                    'ص',
                    'စ',
                    'ſ',
                    'ს',
                    'ｓ',
                ],
                S: ['Ş', 'Ŝ', 'Ș', 'Š', 'Ś', 'С', 'Σ', 'Ｓ'],
                sh: ['ш', 'შ', 'ش'],
                Sh: ['Ш'],
                shch: ['щ'],
                Shch: ['Щ'],
                ss: ['ß'],
                Ss: ['ẞ'],
                sx: ['ŝ'],
                t: [
                    'ť',
                    'ţ',
                    'т',
                    'τ',
                    'ț',
                    'ت',
                    'ط',
                    'ဋ',
                    'တ',
                    'ŧ',
                    'თ',
                    'ტ',
                    'ｔ',
                ],
                T: ['Ť', 'Ţ', 'Ŧ', 'Ț', 'Т', 'Τ', 'Ｔ'],
                th: ['þ', 'ϑ', 'ث', 'ذ', 'ظ'],
                Th: ['Þ'],
                ts: ['ц', 'ც', 'წ'],
                Ts: ['Ц'],
                u: [
                    'ú',
                    'ù',
                    'ủ',
                    'ũ',
                    'ụ',
                    'ư',
                    'ứ',
                    'ừ',
                    'ử',
                    'ữ',
                    'ự',
                    'û',
                    'ū',
                    'ů',
                    'ű',
                    'ŭ',
                    'ų',
                    'µ',
                    'у',
                    'ဉ',
                    'ု',
                    'ူ',
                    'ǔ',
                    'ǖ',
                    'ǘ',
                    'ǚ',
                    'ǜ',
                    'უ',
                    'उ',
                    'ｕ',
                    'ў',
                    'ü',
                ],
                U: [
                    'Ú',
                    'Ù',
                    'Ủ',
                    'Ũ',
                    'Ụ',
                    'Ư',
                    'Ứ',
                    'Ừ',
                    'Ử',
                    'Ữ',
                    'Ự',
                    'Û',
                    'Ū',
                    'Ů',
                    'Ű',
                    'Ŭ',
                    'Ų',
                    'У',
                    'Ǔ',
                    'Ǖ',
                    'Ǘ',
                    'Ǚ',
                    'Ǜ',
                    'Ｕ',
                    'Ў',
                    'Ü',
                ],
                ue: ['ü'],
                uu: ['ऊ'],
                v: ['в', 'ვ', 'ϐ', 'ｖ'],
                V: ['В', 'Ｖ'],
                w: ['ŵ', 'ω', 'ώ', 'ဝ', 'ွ', 'ｗ'],
                W: ['Ω', 'Ώ', 'Ŵ', 'Ｗ'],
                x: ['χ', 'ξ', 'ｘ'],
                X: ['Χ', 'Ξ', 'Ｘ'],
                y: [
                    'ý',
                    'ỳ',
                    'ỷ',
                    'ỹ',
                    'ỵ',
                    'ÿ',
                    'ŷ',
                    'й',
                    'ы',
                    'υ',
                    'ϋ',
                    'ύ',
                    'ΰ',
                    'ي',
                    'ယ',
                    'ｙ',
                ],
                Y: [
                    'Ý',
                    'Ỳ',
                    'Ỷ',
                    'Ỹ',
                    'Ỵ',
                    'Ÿ',
                    'Ῠ',
                    'Ῡ',
                    'Ὺ',
                    'Ύ',
                    'Ы',
                    'Й',
                    'Υ',
                    'Ϋ',
                    'Ŷ',
                    'Ｙ',
                ],
                ya: ['я'],
                Ya: ['Я'],
                yu: ['ю'],
                Yu: ['Ю'],
                z: ['ź', 'ž', 'ż', 'з', 'ζ', 'ز', 'ဇ', 'ზ', 'ｚ'],
                Z: ['Ź', 'Ž', 'Ż', 'З', 'Ζ', 'Ｚ'],
                zh: ['ж', 'ჟ', 'ژ'],
                Zh: ['Ж'],
            }

            for (const swap of Object.keys(swaps)) {
                for (const s of swaps[swap]) {
                    string_ = string_.replaceAll(new RegExp(s, 'g'), swap)
                }
            }
            return string_
        },
        name: 'do swaps',
    },
    fallbackToRandom: {
        fn: (string_) => {
            if (string_ === '') {
                return Math.random().toString(36).slice(2, 7)
            }
            return string_
        },
        name: 'fallback to random: replace with random ascii chars',
    },
    lowerCase: {
        description: 'converts to lower case',
        fn: (string_) => {
            return string_.toLowerCase()
        },
        name: 'lower case',
    },
    maxChars: {
        description: 'trims to max chars - default 100',
        fn: (string_, { num: number_ = 100 }) => {
            if (string_.length > number_) {
                return string_.slice(0, Math.max(0, number_))
            }
            return string_
        },
        name: 'max chars',
    },
    removeConsecutiveDashes: {
        fn: (string_) => {
            return string_.replaceAll(/-+/g, '-')
        },
        name: 'remove consecutive dashes',
    },
    removeConsecutiveDashesAtStartEnd: {
        fn: (string_) => {
            return string_.replaceAll(/^-+|-+$/g, '')
        },
        name: 'remove consecutive dashes at start/end',
    },
    removeInvalidChars: {
        fn: (string_) => {
            return string_.replaceAll(/[^\d a-z-]/g, '')
        },
        name: 'remove invalid chars',
    },
    replaceWhiteSpace: {
        description: 'replaces white space with dashes',
        fn: (string_, { char = '-' }) => {
            return string_.replaceAll(/\s+/g, char)
        },
        name: 'replace white space',
    },
    swapCase: { fn: swapCase, name: 'swap case' },
    toCamelCase: { fn: camelCase, name: 'to camel case' },
    toCapitalCase: { fn: capitalCase, name: 'to capital case' },
    toConstantCase: { fn: constantCase, name: 'to constant case' },
    toDotCase: { fn: dotCase, name: 'to dot case' },
    toHeaderCase: { fn: headerCase, name: 'to header case' },
    toLowerCase: { fn: lowerCase, name: 'to lower case' },
    toLowerCaseFirst: { fn: lowerCaseFirst, name: 'to lower case first' },
    toNoCase: { fn: noCase, name: 'to no case' },

    toParamCase: {
        fn: (string_) => {
            return paramCase(string_)
        },
        name: 'to param case',
    },
    toPascalCase: { fn: pascalCase, name: 'to pascal case' },
    toPathCase: { fn: pathCase, name: 'to path case' },
    toSnakeCase: { fn: snakeCase, name: 'to snake case' },
    toString: {
        description: 'converts to string',
        fn: (string_) => {
            return String(string_).toString()
        },
        name: 'to string',
    },
    toTitleCase: { fn: titleCase, name: 'to title case' },
    toUpperCase: { fn: upperCase, name: 'to upper case' },
    toUpperCaseFirst: { fn: upperCaseFirst, name: 'to upper case first' },
    trim: {
        description: 'trims whitespace',
        fn: (string_) => {
            return string_.replaceAll(/^\s+|\s+$/g, '')
        },
        name: 'trim',
    },
}

export default stringModificationFunctions
