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
    toCamelCase: { name: 'to camel case', fn: camelCase },
    toPascalCase: { name: 'to pascal case', fn: pascalCase },
    toCapitalCase: { name: 'to capital case', fn: capitalCase },
    toHeaderCase: { name: 'to header case', fn: headerCase },
    toTitleCase: { name: 'to title case', fn: titleCase },
    toPathCase: { name: 'to path case', fn: pathCase },
    toSnakeCase: { name: 'to snake case', fn: snakeCase },
    toParamCase: {
        name: 'to param case',
        fn: (string_) => {
            return paramCase(string_)
        },
    },
    toDotCase: { name: 'to dot case', fn: dotCase },
    toNoCase: { name: 'to no case', fn: noCase },
    toConstantCase: { name: 'to constant case', fn: constantCase },
    toLowerCase: { name: 'to lower case', fn: lowerCase },
    toLowerCaseFirst: { name: 'to lower case first', fn: lowerCaseFirst },
    toUpperCase: { name: 'to upper case', fn: upperCase },
    toUpperCaseFirst: { name: 'to upper case first', fn: upperCaseFirst },
    swapCase: { name: 'swap case', fn: swapCase },
    doSwaps: {
        name: 'do swaps',
        fn: (string_) => {
            // remove accents, swap ñ for n, etc
            const swaps = {
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
                b: ['б', 'β', 'ب', 'ဗ', 'ბ', 'ｂ'],
                c: ['ç', 'ć', 'č', 'ĉ', 'ċ', 'ｃ'],
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
                f: ['ф', 'φ', 'ف', 'ƒ', 'ფ', 'ｆ'],
                g: ['ĝ', 'ğ', 'ġ', 'ģ', 'г', 'ґ', 'γ', 'ဂ', 'გ', 'گ', 'ｇ'],
                h: ['ĥ', 'ħ', 'η', 'ή', 'ح', 'ه', 'ဟ', 'ှ', 'ჰ', 'ｈ'],
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
                j: ['ĵ', 'ј', 'Ј', 'ჯ', 'ج', 'ｊ'],
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
                l: ['ł', 'ľ', 'ĺ', 'ļ', 'ŀ', 'л', 'λ', 'ل', 'လ', 'ლ', 'ｌ'],
                m: ['м', 'μ', 'م', 'မ', 'მ', 'ｍ'],
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
                p: ['п', 'π', 'ပ', 'პ', 'پ', 'ｐ'],
                q: ['ყ', 'ｑ'],
                r: ['ŕ', 'ř', 'ŗ', 'р', 'ρ', 'ر', 'რ', 'ｒ'],
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
                v: ['в', 'ვ', 'ϐ', 'ｖ'],
                w: ['ŵ', 'ω', 'ώ', 'ဝ', 'ွ', 'ｗ'],
                x: ['χ', 'ξ', 'ｘ'],
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
                z: ['ź', 'ž', 'ż', 'з', 'ζ', 'ز', 'ဇ', 'ზ', 'ｚ'],
                aa: ['ع', 'आ', 'آ'],
                ae: ['æ', 'ǽ'],
                ai: ['ऐ'],
                ch: ['ч', 'ჩ', 'ჭ', 'چ'],
                dj: ['ђ', 'đ'],
                dz: ['џ', 'ძ'],
                ei: ['ऍ'],
                gh: ['غ', 'ღ'],
                ii: ['ई'],
                ij: ['ĳ'],
                kh: ['х', 'خ', 'ხ'],
                lj: ['љ'],
                nj: ['њ'],
                oe: ['ö', 'œ', 'ؤ'],
                oi: ['ऑ'],
                oii: ['ऒ'],
                ps: ['ψ'],
                sh: ['ш', 'შ', 'ش'],
                shch: ['щ'],
                ss: ['ß'],
                sx: ['ŝ'],
                th: ['þ', 'ϑ', 'ث', 'ذ', 'ظ'],
                ts: ['ц', 'ც', 'წ'],
                ue: ['ü'],
                uu: ['ऊ'],
                ya: ['я'],
                yu: ['ю'],
                zh: ['ж', 'ჟ', 'ژ'],
                '(c)': ['©'],
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
                B: ['Б', 'Β', 'ब', 'Ｂ'],
                C: ['Ç', 'Ć', 'Č', 'Ĉ', 'Ċ', 'Ｃ'],
                D: ['Ď', 'Ð', 'Đ', 'Ɖ', 'Ɗ', 'Ƌ', 'ᴅ', 'ᴆ', 'Д', 'Δ', 'Ｄ'],
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
                F: ['Ф', 'Φ', 'Ｆ'],
                G: ['Ğ', 'Ġ', 'Ģ', 'Г', 'Ґ', 'Γ', 'Ｇ'],
                H: ['Η', 'Ή', 'Ħ', 'Ｈ'],
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
                J: ['Ｊ'],
                K: ['К', 'Κ', 'Ｋ'],
                L: ['Ĺ', 'Ł', 'Л', 'Λ', 'Ļ', 'Ľ', 'Ŀ', 'ल', 'Ｌ'],
                M: ['М', 'Μ', 'Ｍ'],
                N: ['Ń', 'Ñ', 'Ň', 'Ņ', 'Ŋ', 'Н', 'Ν', 'Ｎ'],
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
                P: ['П', 'Π', 'Ｐ'],
                Q: ['Ｑ'],
                R: ['Ř', 'Ŕ', 'Р', 'Ρ', 'Ŗ', 'Ｒ'],
                S: ['Ş', 'Ŝ', 'Ș', 'Š', 'Ś', 'С', 'Σ', 'Ｓ'],
                T: ['Ť', 'Ţ', 'Ŧ', 'Ț', 'Т', 'Τ', 'Ｔ'],
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
                V: ['В', 'Ｖ'],
                W: ['Ω', 'Ώ', 'Ŵ', 'Ｗ'],
                X: ['Χ', 'Ξ', 'Ｘ'],
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
                Z: ['Ź', 'Ž', 'Ż', 'З', 'Ζ', 'Ｚ'],
                AE: ['Æ', 'Ǽ'],
                Ch: ['Ч'],
                Dj: ['Ђ'],
                Dz: ['Џ'],
                Gx: ['Ĝ'],
                Hx: ['Ĥ'],
                Ij: ['Ĳ'],
                Jx: ['Ĵ'],
                Kh: ['Х'],
                Lj: ['Љ'],
                Nj: ['Њ'],
                Oe: ['Œ'],
                Ps: ['Ψ'],
                Sh: ['Ш'],
                Shch: ['Щ'],
                Ss: ['ẞ'],
                Th: ['Þ'],
                Ts: ['Ц'],
                Ya: ['Я'],
                Yu: ['Ю'],
                Zh: ['Ж'],
            }

            for (const swap of Object.keys(swaps)) {
                for (const s of swaps[swap]) {
                    string_ = string_.replaceAll(new RegExp(s, 'g'), swap)
                }
            }
            return string_
        },
    },

    removeInvalidChars: {
        name: 'remove invalid chars',
        fn: (string_) => {
            return string_.replaceAll(/[^\d a-z-]/g, '')
        },
    },
    toString: {
        name: 'to string',
        description: 'converts to string',
        fn: (string_) => {
            return String(string_).toString()
        },
    },
    trim: {
        name: 'trim',
        description: 'trims whitespace',
        fn: (string_) => {
            return string_.replaceAll(/^\s+|\s+$/g, '')
        },
    },
    lowerCase: {
        name: 'lower case',
        description: 'converts to lower case',
        fn: (string_) => {
            return string_.toLowerCase()
        },
    },
    replaceWhiteSpace: {
        name: 'replace white space',
        description: 'replaces white space with dashes',
        fn: (string_, { char = '-' }) => {
            return string_.replaceAll(/\s+/g, char)
        },
    },
    maxChars: {
        name: 'max chars',
        description: 'trims to max chars - default 100',
        fn: (string_, { num: number_ = 100 }) => {
            if (string_.length > number_) {
                return string_.slice(0, Math.max(0, number_))
            }
            return string_
        },
    },
    removeConsecutiveDashes: {
        name: 'remove consecutive dashes',
        fn: (string_) => {
            return string_.replaceAll(/-+/g, '-')
        },
    },
    removeConsecutiveDashesAtStartEnd: {
        name: 'remove consecutive dashes at start/end',
        fn: (string_) => {
            return string_.replaceAll(/^-+|-+$/g, '')
        },
    },
    fallbackToRandom: {
        name: 'fallback to random: replace with random ascii chars',
        fn: (string_) => {
            if (string_ === '') {
                return Math.random().toString(36).slice(2, 7)
            }
            return string_
        },
    },
}

export default stringModificationFunctions
