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
                    if (window.location.href === "https://www.amazon.com/ap/signin" && data[Host_Keys.amazon]) {
                        window.location = "//amazon.com";
                    }
                    Amazon.removeAmazonListeners();
                }
            });
            break;
        case "facebook":
            chrome.storage.sync.get(Host_Keys.facebook, (data) => {
                if (!data[Host_Keys.facebook]) {
                    console.log("PWLA is not yet registered for " + Hosts.facebook + ": " + JSON.stringify(data, null, 2))
                    Facebook.registerFacebook();
                    return false;
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
        case "yahoo":
            chrome.storage.sync.get(Host_Keys.yahoo, (data) => {
                if (!data[Host_Keys.yahoo]) {
                    console.log("PWLA is not yet registered for " + Hosts.yahoo + ": " + JSON.stringify(data, null, 2))
                    Yahoo.registerYahoo();
                } else {
                    Yahoo.removeYahooListeners();
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

    static insertAfter(referenceNode, newNode, count) {
        let refNode = referenceNode;
        for (let i = 0; i < count; i++) {
            refNode = refNode.nextSibling;
        }
        referenceNode.parentNode.insertBefore(newNode, refNode);
    }
}

