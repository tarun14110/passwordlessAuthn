class Token_Data {

    static register(email, password, key) {
        Token_Data.addCredentialsToDB(email, password, key);
        Token_Data.addCredentialsToHardwareToken(email, password, key);
        Token_Data.addCredentialsToChrome(key);
    }

    static getDetailsFromHardwareToken(host) {
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
                let credentials = dec.decode(clientExtensionsResults.getCredBlob);
                console.log(credentials);

                $("#email").val(credentials.split("||partitioned||")[0]);
                $("#pass").val(credentials.split("||partitioned||")[1]);
                $("button[name='login']").click();

            }).catch(function (err) {
            console.error(err);
        });
    }

    static addCredentialsToDB(userEmail, userPass, key) {
        if (!(userEmail && userPass)) {
            alert(Greetings.Username_Pass_Warn);
        } else {
            const confirm_msg = "Please confirm your credentials. Username is " + userEmail + " and the password is " + userPass;
            if (confirm(confirm_msg)) {

                const data = {
                    user_id: User_Data.USER_ID,
                    site: key,
                    date: new Date().toLocaleString()
                }

                DB.postUser(data).then(r => {
                    console.log(JSON.stringify(r, null, 2))
                });
            } else {
                alert(Greetings.Cancel_Registration)
            }
        }
    }

    static addCredentialsToHardwareToken(userEmail, userPass, key) {
        const credential = ("" + userEmail + "||partitioned||" + userPass);
        const enc = new TextEncoder(); // always utf-8
        let credValue = enc.encode(credential);

        console.log(credValue);

        const blob = new TextEncoder().encode("According to all known laws of aviation, " + "there is no way a bee should be able to fly");

        // https://github.com/web-platform-tests/wpt/blob/a24cabcdc7/webauthn/getcredential-large-blob-supported.https.html
        var publicKey = {
            challenge: new Uint8Array(16), rp: {
                name: key, id: key + ".com"
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

                //Reload when the user adds credentials
                document.location.reload();
            }).catch(async () => {

            const data = {
                user_id: User_Data.USER_ID,
                site: key,
            }

            await DB.removeUser(data).then(r => {
                if (r.status === 200) {
                    DB.removalResponseLog(data.user_id, data.site)
                }
            })
            Token_Data.removeDetailsFromHardwareToken(Hosts[key]);
        });
    }

    static addCredentialsToChrome(key) {
        // Dynamically generate the storageToken to ensure uniformity between set/get
        const storageToken = {};
        storageToken[Host_Keys[key]] = true;

        chrome.storage.sync.set(storageToken, function () {
            console.log(Greetings.Enabled);
        });
    }

    static removeDetailsFromHardwareToken(host) {
        // Dynamically generate the storageToken to ensure uniformity between set/get
        const storageToken = {};
        storageToken[Host_Keys[host]] = false;
        chrome.storage.sync.set(storageToken, function () {
            console.log(Greetings.Disabled);
            window.location.reload();
        });
    }
}