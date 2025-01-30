const input = document.getElementById("input-text");
const output = document.getElementById("output-text");
const keybox = document.getElementById("output-key");
const keyalert = document.getElementById("key-alert");
const keyBtn = document.getElementById("key-btn");
const tokenBtn = document.getElementById("token-btn");
const encodeBtn = document.getElementById("encode-btn");
const decodeBtn = document.getElementById("decode-btn");
const baseUrl = window.location.origin;

function adjustHeight(element) {
    element.style.height = 'fit-content';
    element.style.height = (element.scrollHeight/1.5) + 'px';
    element.scrollTop = element.scrollHeight + 20;
  }

function GenerateKey(){

    fetch(`${baseUrl}/api/genSecretKey`)
        .then(response => {
            if (!response.ok) {
                throw new Error('unable to generate key');
            }
            return response.json();
        })
        .then(data => {
            let newKey = data.genKey + data.iv;
            keybox.value = newKey;
            keyalert.textContent = "Copy and save the secret key before generating a new one!";
            adjustHeight(keybox);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function GenerateToken(){
    fetch(`${baseUrl}/api/genToken`)
        .then(response => {
            if (!response.ok) {
                throw new Error('unable to generate key');
            }
            return response.json();
        })
        .then(data => {
            let newToken = data.genToken;
            keybox.value = newToken;
            adjustHeight(keybox);
            keyalert.textContent = 'generated random 32bytes token (DO NOT USE THIS FOR ENCODING/DECODING)';
        })
}

function Encrypt() {
    if (input.value === "" || input.value === null){
        keyalert.textContent = "Please input the text to encode";
    }else if(keybox.value === "" || keybox.value === null){
        keyalert.textContent = "A key is required to encode";
    } else if(keybox.value.length != 96){
        keyalert.textContent = "Invalid key";
    } else {

        const longKey = keybox.value;
        const text = input.value;

        fetch(`${baseUrl}/api/encrypt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ longKey: longKey, text: text })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('unable to encode');
                }
                return response.json();
            })
            .then(data => {
                let encryptedText = data.encrypted;
                keyalert.textContent = "Encoded succesfuly";
                output.value = encryptedText;
                input.value = "";
                input.style.height = "5vh"
                adjustHeight(output);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


}

function Decrypt() {
    if (input.value === "" || input.value === null){
        keyalert.textContent = "Please input the text to decode";
    }else if(keybox.value === "" || keybox.value === null){
        keyalert.textContent = "A key is required to decode";
    } else if(keybox.value.length != 96){
        keyalert.textContent = "Invalid key";
    } else {

        const decLongKey = keybox.value;
        const decText = input.value;

        fetch(`${baseUrl}/api/decrypt`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ decLongKey: decLongKey, decText: decText })
            })
            .then(response => {
                if (!response.ok) {
                    keyalert.textContent = "Invalid text or key";
                    throw new Error('unable to decode');
                }
                return response.json();
            })
            .then(data => {
                let decryptedText = data.decrypted;
                keyalert.textContent = "Decoded succesfuly";
                output.value = decryptedText;
                input.value = "";
                input.style.height = "5vh"
                adjustHeight(output);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

keyBtn.addEventListener("click", GenerateKey);
encodeBtn.addEventListener("click", Encrypt);
decodeBtn.addEventListener("click", Decrypt);
tokenBtn.addEventListener("click", GenerateToken);
