const HOST = Hosts.yahoo;

class Yahoo {

    static registerYahoo = function () {
        // Set the refresh type depending on the individual webpage login mechanisms
        Token_Data.refreshType = Refresh_Types.Double;

        console.log("Registering Yahoo...")

        const cloneTemplate = document.evaluate('//*[@id="login-signin"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.cloneNode(true);
        const parent = document.evaluate('//*[@id="login-signin"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode;
        const clone = document.createElement("button");

        clone.classList = cloneTemplate.classList;
        clone.id = "passwordlessRegistrationButton";
        clone.innerHTML = Greetings.Enable_Sign_In;

        let userEmail = document.evaluate('/html/body/div[1]/div[2]/div[1]/div[2]/div[1]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.cloneNode(true);

        if (userEmail) {
            const spacer = document.createElement("div");
            spacer.innerText = "\n";
            Utils.insertAfter(parent, spacer, 1);
            Utils.insertAfter(parent, clone, 2);
        }

        $("#passwordlessRegistrationButton").click(function () {
            let userEmail = document.evaluate('/html/body/div[1]/div[2]/div[1]/div[2]/div[1]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.cloneNode(true);
            userEmail = userEmail.innerHTML;
            let userPass = document.querySelector('[type*="password"]');
            userPass = userPass.value;

            Token_Data.register(userEmail, userPass, HOST);

            return false;
        });
    }

    static removeYahooListeners = function () {

        const removePassAuthClone = document.evaluate('//*[@id="mbr-forgot-link"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.cloneNode(true);
        const removePassAuthCloneParent = document.evaluate('//*[@id="mbr-forgot-link"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode.parentNode;

        removePassAuthClone.id = "removePassAuth";
        removePassAuthClone.href = "";
        removePassAuthClone.innerHTML = Greetings.Disable_Sign_In;
        Utils.insertAfter(removePassAuthCloneParent, removePassAuthClone, 1);

        // Set the onclick functionality for the clone
        removePassAuthClone.onclick = async () => {
            if (confirm(Greetings.Confirm_Disable)) {
                await Token_Data.removeCredentialsFromHardwareToken(HOST);
            }
        }

        const usernameError = document.evaluate('//*[@id="username-error"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        usernameError.parentNode.removeChild(usernameError);

        const usernameField = document.evaluate('//*[@id="username-country-code-field"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        usernameField.parentNode.removeChild(usernameField);

        const pwlLoginButton = document.evaluate('//*[@id="login-signin"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.cloneNode(true);
        const nextButtonCloneParent = document.evaluate('//*[@id="login-signin"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.parentNode;

        pwlLoginButton.id = "passwordlessAuthSignIn";
        pwlLoginButton.href = "";
        pwlLoginButton.value = Greetings.Sign_In;
        pwlLoginButton.onclick = () => {
            Token_Data.getDetailsFromHardwareToken(Hosts.yahoo);
        }

        Utils.insertAfter(nextButtonCloneParent, pwlLoginButton, 1);

        const nextButton = document.evaluate('//*[@id="login-signin"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        nextButton.parentNode.removeChild(nextButton);

        const staySignedInBox = document.evaluate('//*[@id="login-username-form"]/div[2]/div[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        staySignedInBox.parentNode.removeChild(staySignedInBox);

        const forgotUsernameLink = document.evaluate('//*[@id="login-username-form"]/div[2]/div', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        forgotUsernameLink.parentNode.removeChild(forgotUsernameLink);

        const socialLoginAndSignUpContainer = document.evaluate('//*[@id="login-username-form"]/div[3]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        socialLoginAndSignUpContainer.parentNode.removeChild(socialLoginAndSignUpContainer);
    }
}
