class Microsoft {
    static registerMicrosoft = function (signinPage) {
        (async () => {
            var cln = (await Utils.waitForElm('#idA_PWD_ForgotPassword')).parentNode.cloneNode(true)
            var div = document.getElementById("i0118").parentNode.parentNode
            
            cln.querySelector('a').id = "passwordlessRegistrationButton"
            cln.querySelector('a').href = ""
            cln.querySelector('a').innerHTML = Greetings.Enable_Log_In
            Utils.insertAfter(div, cln, 1);

            $("#passwordlessRegistrationButton").click(function () {
                const userEmail = document.querySelector('[name*="login"]').value;
                const userPass = document.querySelector('[name*="passwd"]').value;
                Token_Data.register(userEmail, userPass, Hosts.microsoft, signinPage);
                return false;
            });
        })();
    }

    static removeMicrosoftListeners = function () {
        (async () => {
            // Grab the original continue button
            const refNextButton = (await Utils.waitForElm('#idSIButton9')).parentNode;

            // Clone the original continue button into the new pwlLoginClone button
            const pwlLoginClone = refNextButton.cloneNode(true);
            //pwlLoginClone.classList.add('flex-container');
             
            //pwlLoginButton.type = "button";
            const pwlLoginButton = pwlLoginClone.querySelector('input')
            pwlLoginButton.id = "passwordlessLoginButton";
            pwlLoginButton.setAttribute("value", Greetings.Log_In)
            // Modify the inner html of the pwlLoginClone button

            //const pwlLoginSpanText = pwlLoginButton.childNodes[3];
            //pwlLoginSpanText.innerHTML = Greetings.Sign_In

            // Set the onclick method functionality for the new pwlLoginClone button
            pwlLoginButton.onclick = () => {
                Token_Data.getDetailsFromHardwareToken(Hosts.microsoft);
            }
            
            var forgotEmailButton = document.querySelector('[id="signup"]')
            const removePassAuthButton = forgotEmailButton.parentNode.cloneNode(true);
            removePassAuthButton.removeChild(removePassAuthButton.firstChild)
            removePassAuthButton.querySelector('a').id = "disablePasswordlessLogin";
            removePassAuthButton.querySelector('a').href = "";
            removePassAuthButton.querySelector('a').innerHTML = Greetings.Disable_Log_In;
        
            removePassAuthButton.onclick = async () => {
                if (confirm(Greetings.Confirm_Disable)) {
                    await Token_Data.removeCredentialsFromHardwareToken(Hosts.microsoft);
                }
            }
            
            var emailSection = forgotEmailButton.parentNode.parentNode;
            emailSection.innerHTML = '';
            emailSection.parentNode.style = "display: flex; justify-content: center;";
            //emailSection.parentNode.classList.add('flex-container');
            emailSection.appendChild(pwlLoginClone);

            Utils.insertAfter(pwlLoginClone, removePassAuthButton, 1);
            document.querySelector('[id="i0116"]').parentNode.innerHTML = '';
            refNextButton.parentNode.innerHTML = '';
        })();
    }
}