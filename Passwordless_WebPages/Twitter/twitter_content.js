class Twitter {
    static registerTwitter = function (signinPage) {
        (async () => {
            var n = await Utils.waitForElm('[type*="password"]');
            console.log(n)
            const div = document.evaluate('//span[contains(text(),"Forgot password?")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.parentNode.parentNode.parentNode; 
            
            const cln = document.evaluate('//span[contains(text(),"Sign up")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
                .singleNodeValue.parentNode.parentNode.parentNode.cloneNode(true); 
            cln.removeChild(cln.firstChild)
            cln.firstChild.firstChild.firstChild.innerHTML = Greetings.Enable_Sign_In
            cln.id = "passwordlessRegistrationButton"
            cln.style = "display: flex; justify-content: center;";
            cln.classList.add('flex-container');
              
            Utils.insertAfter(div, cln, 1);
            $("#passwordlessRegistrationButton").click(function () {
                const userEmail = document.querySelector('[name*="username"]').value;
                const userPass = document.querySelector('[name*="password"]').value;
                Token_Data.register(userEmail, userPass, Hosts.twitter, signinPage);
                return false;
            });
        })();
    }

    static removeTwitterListeners = function () {
        (async () => {
            await waitUntilElementLoad(document, "input[type='text']", 1)
            
            // Grab the original continue button
            const refNextButton = document.evaluate('//span[contains(text(),"Next")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.parentNode.parentNode
            
            // Clone the original continue button into the new pwlLoginClone button
            const pwlLoginButton = refNextButton.cloneNode(true);
            //pwlLoginClone.classList.add('flex-container');

            //pwlLoginButton.type = "button";
            pwlLoginButton.id = "passwordlessLoginButton";

            // Modify the inner html of the pwlLoginClone button
            const pwlLoginSpanText = pwlLoginButton.firstChild.firstChild.firstChild;
            pwlLoginSpanText.innerHTML = Greetings.Sign_In

            // Set the onclick method functionality for the new pwlLoginClone button
            $("#passwordlessLoginButton").onclick = () => {
                Token_Data.getDetailsFromHardwareToken(Hosts.twitter);
            }

            var forgotPasswordButton = document.evaluate('//span[contains(text(),"Forgot password?")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.parentNode.parentNode;
            const removePassAuthButton = forgotPasswordButton.cloneNode(true);
            removePassAuthButton.id = "disablePasswordlessLogin";
            removePassAuthButton.firstChild.firstChild.firstChild.innerHTML = Greetings.Disable_Log_In;
        
            removePassAuthButton.onclick = async () => {
                if (confirm(Greetings.Confirm_Disable)) {
                    await Token_Data.removeCredentialsFromHardwareToken(Hosts.twitter);
                }
            }
            
            var removeEmailSection = document.evaluate('//span[contains(text(),"Phone, email, or username")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.parentNode.parentNode.parentNode.parentNode;
            console.log(removeEmailSection)
            removeEmailSection.parentNode.removeChild(refNextButton)
            removeEmailSection.parentNode.removeChild(forgotPasswordButton)
            removeEmailSection.parentNode.insertBefore(pwlLoginButton, removeEmailSection.parentNode.childNodes[4])
            removeEmailSection.parentNode.removeChild(removeEmailSection)

            Utils.insertAfter(pwlLoginButton, removePassAuthButton, 1);
           // refNextButton.parentNode.innerHTML = '';
        })();
    }
}

async function waitUntilElementLoad(document, elemXPath, maxWait) {
    for (let i = 0; i < maxWait * 10; i++) {
        if (document.querySelector(elemXPath)) { return true; }
        console.log(i);
        await timer(100); // then the created Promise can be awaited
    }
    return false;
}

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }
