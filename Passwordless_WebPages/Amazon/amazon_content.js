class Amazon {

    static registerAmazon = function () {
        const cln = document.evaluate('//a[contains(text(),"Forgot your password")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);
        const div = document.evaluate('//span[contains(text(),"Sign-In")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.parentNode;

        cln.id = "passwordlessRegistrationButton"
        cln.href = ""
        cln.innerHTML = Greetings.Enable_Sign_In
        cln.style = "display: flex; justify-content: center;";
        cln.classList.add('flex-container');
        Utils.insertAfter(div, cln, 1);

        $("#passwordlessRegistrationButton").click(function () {
            const userEmail = document.querySelector('[id*="ap_email"]').value;
            const userPass = document.querySelector('[id*="ap_password"]').value;
            Token_Data.register(userEmail, userPass, Hosts.amazon);
            return false;
        });
    }

    static removeAmazonListeners = function () {
        // Grab the original continue button
        const refContinueButton = document.querySelector('[id="continue"]').parentNode;

        // Clone the original continue button into the new pwlLoginClone button
        const pwlLoginClone = document.querySelector('[id="continue"]').parentNode.cloneNode(true);

        // Grab the 'input' tag from the pwlLoginClone continue button
        const pwlLoginButton = pwlLoginClone.childNodes[1].childNodes[0].childNodes[0];

        // Modify the type and id of the pwlLoginClone button
        pwlLoginButton.type = "button";
        pwlLoginButton.id = "passwordlessLoginButton";

        // Modify the inner html of the pwlLoginClone button
        const pwlLoginSpanText = pwlLoginClone.childNodes[1].childNodes[0].childNodes[1];
        pwlLoginSpanText.innerHTML = Greetings.Sign_In

        // Set the onclick method functionality for the new pwlLoginClone button
        pwlLoginButton.onclick = () => {
            Token_Data.getDetailsFromHardwareToken(Hosts.amazon);
        }

        // Remove the legal text underneath the original continue button after the original has already been cloned
        const legalTextRow = document.getElementById("legalTextRow");
        legalTextRow.parentNode.removeChild(legalTextRow);

        // Add the pwlLoginClone button after the original continue button
        Utils.insertAfter(refContinueButton, pwlLoginClone, 1);

        // Clone the legal text div to get the formatting
        const removePassAuthButton = legalTextRow.cloneNode(true);

        // Grab a hyperlink node from the legal text node, to retain classes...etc
        const linkTextNode = removePassAuthButton.childNodes[1];

        // Remove all the child nodes from the legal text clone
        while (removePassAuthButton.firstChild) {
            removePassAuthButton.removeChild(removePassAuthButton.lastChild);
        }

        // Set all the clones data to become the new auth disabler
        removePassAuthButton.id = "disablePasswordlessLogin";
        removePassAuthButton.appendChild(linkTextNode);
        removePassAuthButton.innerHTML = "<a href=" + "" + "> Disable Passwordless Login </a>";

        // Add the onclick functionality to the auth disabler
        removePassAuthButton.onclick = async () => {
            if (confirm(Greetings.Confirm_Disable)) {
                await Token_Data.removeCredentialsFromHardwareToken(Hosts.amazon);
            }
        }

        // Set up the insertion for the new auth disabler
        const referenceNode = pwlLoginClone.childNodes[4];
        referenceNode.parentNode.insertBefore(removePassAuthButton, referenceNode);

        const removeSignInText = document.evaluate('//label[contains(text(),"Email or")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const removeEmailField = document.evaluate('/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/form/div/div/div/div[1]/input[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const removeContinueButton = document.evaluate('/html/body/div[1]/div[1]/div[2]/div/div[2]/div/div[1]/form/div/div/div/div[2]/span', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        removeSignInText.parentNode.removeChild(removeSignInText);
        removeEmailField.parentNode.removeChild(removeEmailField);
        removeContinueButton.parentNode.removeChild(removeContinueButton);
    }
}
