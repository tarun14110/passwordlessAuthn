class Netflix {

    static registerNetflix = function () {
        const clone = document.evaluate('//button[text()="Sign In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);
        const parent = document.evaluate('//button[text()="Sign In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode;

        clone.id = "passwordlessRegistrationButton"
        clone.href = ""
        clone.innerHTML = Greetings.Enable_Sign_In;
        Utils.insertAfter(parent, clone, 1)

        $("#passwordlessRegistrationButton").click(function () {
            const userEmail = document.querySelector('[autocomplete*="email"]').value;
            const userPass = document.querySelector('[autocomplete*="password"]').value;
            Utils.register(userEmail, userPass, Hosts.netflix)
        });
    }

    static removeNetflixListeners = function () {
        const signInClone = document.evaluate('//button[text()="Sign In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);
        const signInParent = document.evaluate('//button[text()="Sign In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode;

        signInClone.id = "passwordlessRegistrationButton"
        signInClone.href = ""
        signInClone.innerHTML = Greetings.Sign_In;
        Utils.insertAfter(signInParent, signInClone, 1)

        signInClone.onclick = () => {
            getDetailsFromHardwareToken(Hosts.netflix);
        }

        // Grab the original Need Help link
        const helpLinkClone = document.evaluate('//*[text()="Need help?"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);

        // Update the text of the clone and insert
        helpLinkClone.innerHTML = Greetings.Disable_Sign_In;
        Utils.insertAfter(signInClone, helpLinkClone, 1);

        // Set the onclick functionality for the clone
        helpLinkClone.onclick = () => {
            const confirm_msg = Greetings.Confirm_Disable;
            if (confirm(confirm_msg)) {
                removeDetailsFromHardwareToken(Hosts.netflix);
            }
        }
    }
}