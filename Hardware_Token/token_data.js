function getDetailsFromHardwareToken(host) {
    var options = {
        challenge: new Uint8Array([/* bytes sent from the server */]), "rpId": host + ".com",
        "userVerification": "preferred", "extensions": {
            "getCredBlob": true, largeBlob: {
                read: true,
            },
        }
    };

    navigator.credentials.get({"publicKey": options})
        .then(function (credentialInfoAssertion) {
            var response = credentialInfoAssertion.response;
            var clientExtensionsResults = credentialInfoAssertion.getClientExtensionResults();
            console.log(response);
            console.log(clientExtensionsResults);
            console.log(clientExtensionsResults.getCredBlob);
            var dec = new TextDecoder();
            credentials = dec.decode(clientExtensionsResults.getCredBlob);
            console.log(credentials);

            $("#email").val(credentials.split("||partioned||")[0]);
            $("#pass").val(credentials.split("||partioned||")[1]);
            $("button[name='login']").click();

        }).catch(function (err) {
        console.error(err);
    });
}

function saveDetailsToHardwareToken(credential, host) {
    var enc = new TextEncoder(); // always utf-8
    credValue = enc.encode(credential);
    console.log(credValue);

    const blob = new TextEncoder().encode("According to all known laws of aviation, " + "there is no way a bee should be able to fly");

    // https://github.com/web-platform-tests/wpt/blob/a24cabcdc7/webauthn/getcredential-large-blob-supported.https.html
    var publicKey = {
        challenge: new Uint8Array(16), rp: {
            name: host, id: host + ".com"
        }, user: {
            id: new Uint8Array(16), name: "JonSnow", displayName: "JonSnowNightWatch"
        }, pubKeyCredParams: [{
            type: "public-key", alg: -7
        }], "authenticatorSelection": {
            "requireResidentKey": true,
            "requireUserVerification": true,
            "residentKey": "required",
            "userVerification": "required"
        }, "extensions": {
            "credBlob": credValue, "credProtect": 0x03, "credProps": true, largeBlob: {
                support: "required", write: blob,
            },
        }
    };

    navigator.credentials.create({publicKey})
        .then(function (newCredentialInfo) {
            var response = newCredentialInfo.response;
            var clientExtensionsResults = newCredentialInfo.getClientExtensionResults();
            console.log(response);
            console.log(clientExtensionsResults);
        });
}

function removeDetailsFromHardwareToken(host) {
    // Dynamically generate the storageToken to ensure uniformity between set/get
    const storageToken = {};
    storageToken[Host_Keys[host]] = false;
    debugger;
    chrome.storage.sync.set(storageToken, function () {
        console.log(Greetings.Disabled);
    });
}