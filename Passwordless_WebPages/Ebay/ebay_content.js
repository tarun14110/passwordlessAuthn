class Ebay {
    static registerEbay = async function (signinPage) {
            let needHelpDiv = (await Utils.waitForElm('#need-help-signin-link')).parentNode
            let cln = needHelpDiv.cloneNode(true)
            
            cln.querySelector('a').id = "passwordlessRegistrationButton"
            cln.querySelector('a').innerHTML = Greetings.Enable_Log_In
            //Utils.insertAfter(div, cln, 1);
            needHelpDiv.parentNode.insertBefore(cln, needHelpDiv)

            $("#passwordlessRegistrationButton").click(function () {
                Token_Data.register($("#userid").val(), $("#pass").val(), Hosts.ebay, signinPage);
                return false;
            });
    }

    static removeEbayListeners = async function () {
            // Grab the original continue button
            const refContinueButton = (await Utils.waitForElm('#signin-continue-btn'))
            // Clone the original continue button into the new pwlLoginClone button
            const pwlLoginButton = refContinueButton.cloneNode(true);

            //pwlLoginButton.type = "button";
            pwlLoginButton.id = "passwordlessLoginButton";
            pwlLoginButton.innerHTML = Greetings.Sign_In

            // Set the onclick method functionality for the new pwlLoginClone button
            pwlLoginButton.onclick = () => {
                Token_Data.getDetailsFromHardwareToken(Hosts.ebay);
            }

            const removePassAuthButton = document.getElementById('create-account-link').cloneNode(true)
            removePassAuthButton.setAttribute('href', ' ')
            removePassAuthButton.id = "disablePasswordlessLogin";
            removePassAuthButton.innerHTML = Greetings.Disable_Log_In;
            removePassAuthButton.style = "display: flex; justify-content: center;";
        
            removePassAuthButton.onclick = async () => {
                if (confirm(Greetings.Confirm_Disable)) {
                    await Token_Data.removeCredentialsFromHardwareToken(Hosts.ebay);
                }
            }
            
            let emailSection = refContinueButton.parentNode
            emailSection.style.display = 'None'

            emailSection.parentNode.append(pwlLoginButton)
            emailSection.parentNode.append(removePassAuthButton)
    }
}