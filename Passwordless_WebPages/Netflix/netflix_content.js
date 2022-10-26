class Netflix {

    static registerNetflix = function (signinPage) {
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
            Token_Data.register(userEmail, userPass, Hosts.netflix, signinPage);
            return false;
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
            Token_Data.getDetailsFromHardwareToken(Hosts.netflix);
        }

        // Grab the original Need Help link
        const removePassAuthButton = document.evaluate('//*[text()="Need help?"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);
        removePassAuthButton.setAttribute("href", "")

        // Update the text of the clone and insert
        removePassAuthButton.innerHTML = Greetings.Disable_Sign_In;
        removePassAuthButton.style = "display: flex; justify-content: center;";
        Utils.insertAfter(signInClone, removePassAuthButton, 1);

        // Set the onclick functionality for the clone
        removePassAuthButton.onclick = async () => {
            if (confirm(Greetings.Confirm_Disable)) {
                await Token_Data.removeCredentialsFromHardwareToken(Hosts.netflix);
            }
        }

        const signInFormArea = document.evaluate('//label[text()="Email or phone number"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.parentNode.parentNode.parentNode.parentNode;

        signInFormArea.parentNode.removeChild(signInFormArea);
    }
}
