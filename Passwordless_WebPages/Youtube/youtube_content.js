class Youtube {

    static registerYoutube = function (signinPage) {
        (async () => {
            const cln = (await Utils.waitForElm('#forgotPassword')).cloneNode(true);
            const div = document.evaluate('//div[contains(text(),"Show password")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                .singleNodeValue.parentNode.parentNode.parentNode;
        
            cln.querySelector('button').id = "passwordlessRegistrationButton"
            cln.querySelector('button').innerHTML = Greetings.Enable_Sign_In
            // cln.style = "display: flex; justify-content: center;";
            // cln.classList.add('flex-container');
            Utils.insertAfter(div, cln, 1);

            $("#passwordlessRegistrationButton").click(function () {
                const userEmail = document.querySelector('[id*="identifierId"]').value;
                const userPass = document.querySelector('[name*="Passwd"]').value;
                Token_Data.register(userEmail, userPass, Hosts.google, signinPage);
                return false;
            });
        })();
    }

    static removeYoutubeListeners = function () {
        (async () => {
            await Utils.waitForElm('#identifierId')
            // Grab the original continue button
            const refNextButton = document.querySelector('[id="identifierNext"]');

            // Clone the original continue button into the new pwlLoginClone button
            const pwlLoginClone = refNextButton.cloneNode(true);
            //pwlLoginClone.classList.add('flex-container');

            // Grab the 'input' tag from the pwlLoginClone continue button
            const pwlLoginButton = pwlLoginClone.firstChild.firstChild;

            //pwlLoginButton.type = "button";
            pwlLoginButton.id = "passwordlessLoginButton";

            // Modify the inner html of the pwlLoginClone button
            const pwlLoginSpanText = pwlLoginButton.childNodes[3];
            pwlLoginSpanText.innerHTML = Greetings.Sign_In

            // Set the onclick method functionality for the new pwlLoginClone button
            pwlLoginButton.onclick = () => {
                Token_Data.getDetailsFromHardwareToken(Hosts.google);
            }

            var forgotEmailButton = document.evaluate('//button[contains(text(),"Forgot email")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const removePassAuthButton = forgotEmailButton.parentNode.cloneNode(true);
            removePassAuthButton.querySelector('button').id = "disablePasswordlessLogin";
            removePassAuthButton.querySelector('button').setAttribute('jsname', '');
            removePassAuthButton.querySelector('button').innerHTML = Greetings.Disable_Log_In;
        
            removePassAuthButton.onclick = async () => {
                if (confirm(Greetings.Confirm_Disable)) {
                    await Token_Data.removeCredentialsFromHardwareToken(Hosts.google);
                }
            }
            
            var emailSection = forgotEmailButton.parentNode.parentNode;
            //emailSection.innerHTML = '';
            emailSection.style.display = 'None'
            //emailSection.parentNode.style = "display: flex; justify-content: center;";
            emailSection.parentNode.classList.add('flex-container');
            emailSection.parentNode.appendChild(pwlLoginButton);

            Utils.insertAfter(pwlLoginButton, removePassAuthButton, 1);
            refNextButton.parentNode.innerHTML = '';
        })();
    }
}