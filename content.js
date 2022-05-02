//on init perform based on chrome storage value
window.onload = () => {

    console.log(Utils.findHostName());
    const hostName = Utils.findHostName();

    switch (hostName) {
        case "amazon":
            chrome.storage.sync.get(Host_Keys.amazon, (data) => {
                if (!data[Host_Keys.amazon]) {
                    console.log(("PWLA is not yet registered for " + Hosts.amazon + ": " + JSON.stringify(data, null, 2)))
                    Amazon.registerAmazon();
                } else {
                    Amazon.removeAmazonListeners();
                }
            });
            break;
        case "facebook":
            chrome.storage.sync.get(Host_Keys.facebook, (data) => {
                if (!data[Host_Keys.facebook]) {
                    console.log("PWLA is not yet registered for " + Hosts.facebook + ": " + JSON.stringify(data, null, 2))
                    Facebook.registerFacebook();
                } else {
                    Facebook.removeFacebookListeners();
                }
            });
            break;
        case "google":
            chrome.storage.sync.get(Host_Keys.google, (data) => {
                if (!data[Host_Keys.google]) {
                    console.log("PWLA is not yet registered for " + Hosts.google + ": " + JSON.stringify(data, null, 2))
                    Google.registerGoogle();
                } else {
                    // Facebook.removeGoogleListeners();
                }
            });
            break;
        case "netflix":
            chrome.storage.sync.get(Host_Keys.netflix, (data) => {
                if (!data[Host_Keys.netflix]) {
                    console.log("PWLA is not yet registered for " + Hosts.netflix + ": " + JSON.stringify(data, null, 2))
                    Netflix.registerNetflix()
                } else {
                    Netflix.removeNetflixListeners()
                }
            });
            break;
        default:
            console.log(hostName + " is not available for Passwordless Authentication");
    }
}

/**
 * Helper Functions
 */

class Utils {

    static findHostName() {
        let removeProtocol = (window.location.href).substr(8);
        removeProtocol = removeProtocol.substring(0, removeProtocol.indexOf('.com'))
        removeProtocol = removeProtocol.substring(removeProtocol.indexOf('.') + 1, removeProtocol.length)

        return removeProtocol;
    }

    static register(userEmail, userPass, key) {
        if (!(userEmail && userPass)) {
            alert(Greetings.Username_Pass_Warn);
        } else {
            const confirm_msg = "Please confirm your credentials. Username is " + userEmail + " and the password is " + userPass;
            if (confirm(confirm_msg)) {

                const data = {
                    user_id: User_Data.USER_ID,
                    site: key
                }

                DB.postUser(data).then(r => {
                    console.log(r.response)
                    if (r.status === 200) {
                        saveDetailsToHardwareToken("" + userEmail + "||partioned||" + userPass, Hosts[key]);

                        // Dynamically generate the storageToken to ensure uniformity between set/get
                        const storageToken = {};
                        storageToken[Host_Keys[key]] = true;

                        chrome.storage.sync.set(storageToken, function () {
                            console.log(Greetings.Enabled);
                        });
                        return false;
                    } else {
                        // todo: make it so we can attempt the process again
                    }
                });
            } else {
                alert(Greetings.Cancel_Registration)
            }
        }

    }

    static insertAfter(referenceNode, newNode, count) {
        let refNode = referenceNode;
        for (let i = 0; i < count; i++) {
            refNode = refNode.nextSibling;
        }
        referenceNode.parentNode.insertBefore(newNode, refNode);
    }
}

