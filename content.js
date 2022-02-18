//on init perform based on chrome storage value
window.onload = () => {

    console.log(Helpers.FindHostName());
    const hostName = Helpers.FindHostName();

    switch (hostName) {
        case "facebook":
            chrome.storage.sync.get("passwordlessAuth.facebook", (data) => {
                if (!data["passwordlessAuth.facebook"]) {
                    console.log("PWLA is not yet registered for " + Hosts.facebook + ": " + JSON.stringify(data, null, 2))
                    Facebook.registerFacebook();
                } else {
                    Facebook.removeFacebookListeners();
                }
            });
            break;
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
        default:
            console.log(hostName + " is not available for Passwordless Authentication");
    }
}

/**
 * Helper Functions
 */

class Helpers {

    static FindHostName() {
        let removeProtocol = (window.location.href).substr(12);
        return removeProtocol.substring(0, removeProtocol.indexOf('.'));
    }

}

