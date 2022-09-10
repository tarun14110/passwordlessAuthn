class Token_Data {

    static register(email, password, key, signinPage) {
        if (!(email && password)) {
            alert(Greetings.Username_Pass_Warn);
        } else {
            const confirm_msg = "Please confirm your credentials. Username is " + email + " and the password is " + password;
            if (confirm(confirm_msg)) { 
                Token_Data.addCredentialsToHardwareToken(email, password, key, signinPage);
            } else {
                alert(Greetings.Cancel_Registration)
            }
        }
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
                // console.log(response);
                // console.log(clientExtensionsResults);
                // console.log(clientExtensionsResults.getCredBlob);
                var dec = new TextDecoder();
                let credentials = dec.decode(clientExtensionsResults.getCredBlob);
                console.log(credentials);

                var usernameElement = null
                var passwordElement = null
                var loginButton = null
                switch (host) {
                    case "reddit": 
                        usernameElement = $("#loginUsername")
                        passwordElement = $("#loginPassword")
                        loginButton = document.evaluate('//button[contains(text(),"Log In")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
                        break;
                    case "google":
                        usernameElement = document.querySelector('[id*="identifierId"]')
                        passwordElement = document.querySelector('[name*="Passwd"]')
                        loginButton = $("#passwordNext")
                        console.log("google here")
                        break
                    }
                    
                console.log(usernameElement)
                console.log(passwordElement)
                console.log(loginButton)
                usernameElement.val(credentials.split("||partitioned||")[0]);
                passwordElement.val(credentials.split("||partitioned||")[1]);
                loginButton.click()
            
                // $("#email").val(credentials.split("||partitioned||")[0]);
                // $("#pass").val(credentials.split("||partitioned||")[1]);
                //$("button[name='login']").click();

            }).catch(function (err) {
            console.error(err);
        });
    }

    static addCredentialsToHardwareToken(userEmail, userPass, key, signinPage) {
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
            .then(async function (newCredentialInfo) {
                var response = newCredentialInfo.response;
                var clientExtensionsResults = newCredentialInfo.getClientExtensionResults();
                console.log(response);
                console.log(clientExtensionsResults);

                // Dynamically generate the storageToken to ensure uniformity between set/get
                const storageToken = {};
                storageToken[Host_Keys[key]] = true;

                chrome.storage.sync.set(storageToken, async function () {
                    console.log(Greetings.Enabled);

                    // When successfully creating token add credentials to DB
                    await DB.postUser(key).then(r => {
                        if (r.status === 200) {
                            alert("add")
                            DB.postResponseLog(User_Data.USER_ID, key);
                        }
                    });
                });

                //Reload when the user adds credentials
                //window.location.reload();
                window.location.href = signinPage;
                
            }).catch(async (e) => {
            await DB.removeUser(key).then(r => {
                if (r.status === 200) {
                    DB.removalResponseLog(User_Data.USER_ID, key)
                }
            })
            alert("remove")
            console.error(e)
            Token_Data.removeCredentialsFromHardwareToken(Hosts[key]);
        });
    }

    static removeCredentialsFromHardwareToken(key) {
        // Dynamically generate the storageToken to ensure uniformity between set/get
        const storageToken = {};
        storageToken[Host_Keys[key]] = false;
        chrome.storage.sync.set(storageToken, async function () {
            console.log(Greetings.Disabled);

            await DB.removeUser(key).then(r => {
                if (r.status === 200) {
                    DB.removalResponseLog(User_Data.USER_ID, key);
                }
            })
            alert("here")
            window.location.reload();
        });
    }
}
