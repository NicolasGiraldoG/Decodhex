const input = document.getElementById("input-text");
const output = document.getElementById("output-text");
const keybox = document.getElementById("output-key");
const keyalert = document.getElementById("key-alert");
const keyBtn = document.getElementById("key-btn");
const encodeBtn = document.getElementById("encode-btn");
const decodeBtn = document.getElementById("decode-btn");
const baseUrl = window.location.origin;

function adjustHeight(element) {
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight/2) + 'px';
    element.scrollTop = element.scrollHeight + 20;
    element.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

function generateKey(){

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
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function encrypt() {
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
                adjustHeight(output);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }


}

function decrypt() {
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
                adjustHeight(output);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

keyBtn.addEventListener("click", generateKey);
encodeBtn.addEventListener("click", encrypt);
decodeBtn.addEventListener("click", decrypt);
