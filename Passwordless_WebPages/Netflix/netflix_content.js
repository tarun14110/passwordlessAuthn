class Netflix {

    static registerNetflix = function () {

        const clone = document.evaluate('//button[text()="Sign In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);
        const parent = document.evaluate('//button[text()="Sign In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode;

        clone.id = "passwordlessRegistrationButton"
        clone.href = ""
        clone.innerHTML = Greetings.Enable_Sign_In;
        insertAfter(parent, clone, 1)


        $("#passwordlessRegistrationButton").click(function () {
            const userEmail = document.querySelector('[autocomplete*="email"]').value;
            const userPass = document.querySelector('[autocomplete*="password"]').value;
            if (!(userEmail && userPass)) {
                alert(Greetings.Username_Pass_Warn);
            } else {
                var confirm_msg = "Please confirm your credentials. Username is " + userEmail + " and the password is " + userPass;
                if (confirm(confirm_msg)) {
                    saveDetailsToHardwareToken("" + userEmail + "||partioned||" + userPass, Hosts.netflix);

                    // Dynamically generate the storageToken to ensure uniformity between set/get
                    const storageToken = {};
                    storageToken[Host_Keys.netflix] = true;

                    chrome.storage.sync.set(storageToken, function () {
                        console.log(Greetings.Enabled);
                    });
                    return false;
                } else {
                    alert(Greetings.Cancel_Registration)
                }
            }

        });
    }

    static removeNetflixListeners = function () {

        const signInClone = document.evaluate('//button[text()="Sign In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);
        const signInParent = document.evaluate('//button[text()="Sign In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode;

        signInClone.id = "passwordlessRegistrationButton"
        signInClone.href = ""
        signInClone.innerHTML = Greetings.Sign_In;
        insertAfter(signInParent, signInClone, 1)

        signInClone.onclick = () => {
            getDetailsFromHardwareToken(Hosts.netflix);
        }


        // Grab the original Need Help link
        const helpLinkClone = document.evaluate('//*[text()="Need help?"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);

        // Update the text of the clone and insert
        helpLinkClone.innerHTML = Greetings.Disable_Sign_In;
        insertAfter(signInClone, helpLinkClone, 1);

        // Set the onclick functionality for the clone
        helpLinkClone.onclick = () => {
            const confirm_msg = Greetings.Confirm_Disable;
            if (confirm(confirm_msg)) {
                removeDetailsFromHardwareToken(Hosts.netflix);
            }
        }

    }

}