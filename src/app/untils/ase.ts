import { AES, SHA256, enc, mode, lib, pad } from 'crypto-js';

let out = function (args: any) {
    var args = Array.prototype.slice.call(arguments, 0);
    document.getElementById('output').innerHTML += args.join(" ") + "\n";
};

let privateKey: string = "Foo";
let pin: string = "Bar";
let data: string = "0VzMi44AGyONi4MoKvr3rQ==";

// Begin decryption
function decrypt(privateKey: string, pin: string, data: string) {
    let cipherBuffer: CryptoJS.lib.WordArray = enc.Base64.parse(data);

    let keyHash: CryptoJS.lib.WordArray = SHA256(enc.Utf8.parse(privateKey));
    let key: CryptoJS.lib.WordArray = lib.WordArray.create(keyHash.words.slice(0, 8), 32);

    let pinHash: CryptoJS.lib.WordArray = SHA256(enc.Utf8.parse(pin));
    let iv: CryptoJS.lib.WordArray = lib.WordArray.create(pinHash.words.slice(0, 4), 16);

    let cfg: CryptoJS.lib.IBlockCipherCfg = {
        iv: iv,
        mode: mode.CBC,
        padding: pad.Pkcs7
    };

    let paramsData: CryptoJS.lib.CipherParamsData = {
        ciphertext: cipherBuffer
    };
    return AES.decrypt(paramsData, key, cfg);
}

interface user {
    name: string,
    password: string
}

let model: user = { name: "", password: "" };

function decryptToUtf8String(privateKey: string, pin: string, data: string) {
    return decrypt(privateKey, pin, data).toString(enc.Utf8);
}


// End decryption

// Begin encryption
function Encrypt(privateKey: string, pin: string, data: string) {

    let keyHash: CryptoJS.lib.WordArray = SHA256(enc.Utf8.parse(privateKey));
    let key: CryptoJS.lib.WordArray = lib.WordArray.create(keyHash.words.slice(0, 8), 32);
    let pinHash: CryptoJS.lib.WordArray = SHA256(enc.Utf8.parse(pin));
    let iv: CryptoJS.lib.WordArray = lib.WordArray.create(pinHash.words.slice(0, 4), 16);
    let cfg: CryptoJS.lib.IBlockCipherCfg = {
        iv: iv,
        mode: mode.CBC,
        padding: pad.Pkcs7
    };
    let encrypted = AES.encrypt(data, key, cfg);
    return encrypted.ciphertext;
}

function EncryptToBase64String(privateKey: string, pin: string, data: string) {
    return Encrypt(privateKey, pin, data).toString(enc.Base64);
}

// End encryption

out(decrypt(privateKey, pin, data).toString(enc.Utf8));