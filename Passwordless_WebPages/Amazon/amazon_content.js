class Amazon {

    static registerAmazon = function () {
        const cln = document.evaluate('//a[contains(text(),"Forgot your password")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.cloneNode(true);
        const div = document.evaluate('//span[contains(text(),"Sign-In")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.parentNode;

        cln.id = "passwordlessRegistrationButton"
        cln.href = ""
        cln.innerHTML = "Enable Passwordless Authentication";
        cln.style = "display: flex; justify-content: center;";
        cln.classList.add('flex-container');
        insertAfter(div, cln, 1);

        const userEmail = document.querySelector('[id*="ap_email"]').value;

        $("#passwordlessRegistrationButton").click(function () {
            const userPass = document.querySelector('[id*="ap_password"]').value;
            if (!(userEmail && userPass)) {
                alert("Please fill the email and password field. To enable passwordless login, we need to authenticate you.");
                return false;
            } else {
                var confirm_msg = "Please confirm your credentials. Username is " + userEmail + " and the password is " + userPass;
                if (confirm(confirm_msg)) {
                    saveDetailsToHardwareToken("" + userEmail + "||partioned||" + userPass, Hosts.amazon);

                    // Dynamically generate the storageToken to ensure uniformity between set/get
                    const storageToken = {};
                    storageToken[Host_Keys.amazon] = true;

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
        pwlLoginSpanText.innerHTML = " Passwordless Login "

        // Set the onclick method functionality for the new pwlLoginClone button
        pwlLoginButton.onclick = () => {
            getDetailsFromHardwareToken(Hosts.amazon);
        }

        // Remove the legal text underneath the original continue button after the original has already been cloned
        const legalTextRow = document.getElementById("legalTextRow");
        legalTextRow.parentNode.removeChild(legalTextRow);

        // Add the pwlLoginClone button after the original continue button
        insertAfter(refContinueButton, pwlLoginClone, 1);

        // Clone the legal text div to get the formatting
        const legalTextClone = legalTextRow.cloneNode(true);

        // Grab a hyperlink node from the legal text node, to retain classes...etc
        const linkTextNode = legalTextClone.childNodes[1];

        // Remove all the child nodes from the legal text clone
        while (legalTextClone.firstChild) {
            legalTextClone.removeChild(legalTextClone.lastChild);
        }

        // Set all the clones data to become the new auth disabler
        legalTextClone.id = "disablePasswordlessLogin";
        legalTextClone.appendChild(linkTextNode);
        legalTextClone.innerHTML = "<a href=" + "" + "> Disable Passwordless Login </a>";

        // Add the onclick functionality to the auth disabler
        legalTextClone.onclick = () => {
            console.log(Greetings.Disabled);
            var confirm_msg = Greetings.Confirm_Disable
            if (confirm(confirm_msg)) {
                removeDetailsFromHardwareToken(Hosts.amazon);
            }
        }

        // Set up the insertion for the new auth disabler
        const referenceNode = pwlLoginClone.childNodes[4];
        referenceNode.parentNode.insertBefore(legalTextClone, referenceNode);

    }

}