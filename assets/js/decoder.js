



//Beaufort
const beaufortAutokey = (key) => {
    const ascii = () => Array.from({ length: 256 }, (_, i) => String.fromCharCode(i)).join('');
    const shift = (text) => text.length <= 1 ? text : text.slice(1) + text[0];
    const rotate = (text, distance) => Array(distance).fill().reduce(result => shift(result), text);
    const base64Encode = (text) => btoa(text);
    const base64Decode = (text) => atob(text);

    const table = (() => {
        const rows = {};
        const alphabet = ascii();

        return (textChar, keyChar) => {
            const row = rows[textChar] || (rows[textChar] = rotate(alphabet, alphabet.indexOf(textChar)));
            const column = row.indexOf(keyChar);

            return alphabet[column];
        };
    })();


    const encrypt = (message) => {
        const ciphertext = message.split('').reduce((result, textChar, index) => {
            const keyChar = index < key.length ? key[index] : message[index - key.length];

            return result + table(textChar, keyChar);
        }, '');

        return base64Encode(ciphertext);
    };

    const decrypt = (ciphertext) => {
        return base64Decode(ciphertext).split('').reduce((result, textChar, index) => {
            const keyChar = index < key.length ? key[index] : result[index - key.length];

            return result + table(textChar, keyChar);
        }, '');
    };

    return { encrypt, decrypt };
};

//Vigenere

const vigenere = (key) => {
    const ascii = () => Array.from({ length: 256 }, (_, i) => String.fromCharCode(i)).join('');
    const shift = (text) => text.length <= 1 ? text : text.slice(1) + text[0];
    const rotate = (text, distance) => Array(distance).fill().reduce(result => shift(result), text);
    const base64Encode = (text) => btoa(text);
    const base64Decode = (text) => atob(text);

    const table = (() => {
        const rows = {};
        const alphabet = ascii();

        return (textChar, keyChar) => {
            const row = rows[keyChar] || (rows[keyChar] = rotate(alphabet, alphabet.indexOf(keyChar)));
            const column = alphabet.indexOf(textChar);

            return row[column];
        };
    })();

    const encrypt = (message) => {
        const ciphertext = message.split('').reduce((result, textChar, index) => {
            const keyChar = key[index % key.length];

            return result + table(textChar, keyChar);
        }, '');

        return base64Encode(ciphertext);
    };

    const decrypt = (ciphertext) => {
        return base64Decode(ciphertext).split('').reduce((result, cipherChar, index) => {
            const keyChar = key[index % key.length];
            const row = rotate(ascii(), ascii().indexOf(keyChar));
            const textChar = ascii()[row.indexOf(cipherChar)];

            return result + textChar;
        }, '');
    };

    return { encrypt, decrypt };
};






const process = (operation) => {
    const inputText = document.getElementById('message').value;
    const keyword = document.getElementById('keyword').value;
    const selectedCipher = document.getElementById('cipherSelection').value;

    let cipher;

    if (selectedCipher === 'Beaufort') {
        cipher = beaufortAutokey(keyword);
    } else if (selectedCipher === 'Vigenere') {
        cipher = vigenere(keyword);
    } else {
        console.error('Unknown algorithm');
        return;
    }

    const result = (operation === 'encrypt') ? cipher.encrypt(inputText) : cipher.decrypt(inputText);

    document.getElementById('output').value = result;
};
