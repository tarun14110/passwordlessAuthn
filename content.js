//on init perform based on chrome storage value
window.onload = () => {

    console.log(Helpers.FindHostName());
    const hostName = Helpers.FindHostName();

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

class Helpers {

    static FindHostName() {
        let removeProtocol = (window.location.href).substr(8);
        removeProtocol = removeProtocol.substring(0, removeProtocol.indexOf('.com'))
        removeProtocol = removeProtocol.substring(removeProtocol.indexOf('.') + 1, removeProtocol.length)

        return removeProtocol;
    }

}

