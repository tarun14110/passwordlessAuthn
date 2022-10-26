//on init perform based on chrome storage value
window.onload = () => {

    console.log(Utils.findHostName());
    const hostName = Utils.findHostName();

    switch (hostName) {
        case "amazon":
            chrome.storage.sync.get(Host_Keys.amazon, (data) => {
                if (!data[Host_Keys.amazon]) {
                    console.log(("PWLA is not yet registered for " + Hosts.amazon + ": " + JSON.stringify(data, null, 2)))
                    Amazon.registerAmazon(null);
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
                    Facebook.registerFacebook(null);
                    return false;
                } else {
                    Facebook.removeFacebookListeners();
                }
            });
            break;
        case "google":
            chrome.storage.sync.get(Host_Keys.google, (data) => {
                if (!data[Host_Keys.google]) {
                    //console.log(window.location.href)
                    console.log("PWLA is not yet registered for " + Hosts.google + ": " + JSON.stringify(data, null, 2))
                    Youtube.registerYoutube(window.location.href);
                } else {
                    Youtube.removeYoutubeListeners();
                }
            });
            break;
        case "netflix":
            chrome.storage.sync.get(Host_Keys.netflix, (data) => {
                if (!data[Host_Keys.netflix]) {
                    console.log("PWLA is not yet registered for " + Hosts.netflix + ": " + JSON.stringify(data, null, 2))
                    Netflix.registerNetflix(null)
                } else {
                    Netflix.removeNetflixListeners()
                }
            });
            break;
        case "twitter":
            chrome.storage.sync.get(Host_Keys.twitter, (data) => {
                if (!data[Host_Keys.twitter]) {
                    console.log("PWLA is not yet registered for " + Hosts.twitter + ": " + JSON.stringify(data, null, 2))
                    Twitter.registerTwitter(window.location.href)
                } else {
                    Twitter.removeTwitterListeners()
                }
            });
            break;
        case "reddit":
            chrome.storage.sync.get(Host_Keys.reddit, (data) => {
                if (!data[Host_Keys.reddit]) {
                    console.log("PWLA is not yet registered for " + Hosts.reddit + ": " + JSON.stringify(data, null, 2))
                    Reddit.registerReddit(window.location.href)
                } else {
                    //var loginButton = document.evaluate('//a[contains(text(),"Log In")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    //console.log(loginButton)
                    Reddit.removeRedditListeners()
                    
                }
            });
            break;
        case "live":
            chrome.storage.sync.get(Host_Keys.live, (data) => {
                if (!data[Host_Keys.live]) {
                    console.log("PWLA is not yet registered for " + Hosts.microsoft + ": " + JSON.stringify(data, null, 2))
                    Microsoft.registerMicrosoft(window.location.href)
                } else {
                    Microsoft.removeMicrosoftListeners()
                }
            });
            break;
        case "pinterest":
            chrome.storage.sync.get(Host_Keys.pinterest, (data) => {
                if (!data[Host_Keys.pinterest]) {
                    console.log("PWLA is not yet registered for " + Hosts.pinterest + ": " + JSON.stringify(data, null, 2))
                    Pinterest.registerPinterest(window.location.href)
                } else {
                    Pinterest.removePinterestListeners()
                }
            });
            break;
        case "ebay":
            chrome.storage.sync.get(Host_Keys.ebay, (data) => {
                if (!data[Host_Keys.ebay]) {
                    console.log("PWLA is not yet registered for " + Hosts.ebay + ": " + JSON.stringify(data, null, 2))
                    Ebay.registerEbay(window.location.href)
                } else {
                    Ebay.removeEbayListeners()
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
    // static waitForElm(selector) {
    //     return new Promise((resolve, reject) => {
    //         if (document.querySelector(selector)) {
    //             return resolve(document.querySelector(selector));
    //         }

    //         let observer;
    //         let timer;
    //         const findElement = () => {
    //             if (document.querySelector(selector)) {
    //                 resolve(document.querySelector(selector))
    //                 observer.disconnect()
    //                 clearInterval(timer)
    //                 clearTimeout(warningTimeout);
    //             }
    //         };
    //         observer = new MutationObserver(findElement);
    //         timer = setInterval(findElement, 100)
    //         const warningTimeout = setTimeout(() => {
    //             reject("Can't find password element!")
    //             observer.disconnect()
    //             clearInterval(timer)
    //         }, 1000*10);
            
            
    //         observer.observe(document.body, {
    //             childList: true,
    //             subtree: true
    //         });
    //     });
    // }
    static waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

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

