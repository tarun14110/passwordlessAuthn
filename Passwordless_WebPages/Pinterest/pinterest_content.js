async function waitUntilElementLoad(document, elemXPath, maxWait) {
    for (let i = 0; i < maxWait * 10; i++) {
        if (document.querySelector(elemXPath)) { return true; }
        console.log(i);
        await timer(100); // then the created Promise can be awaited
    }
    return false;
}

function timer(ms) { return new Promise(res => setTimeout(res, ms)); }

class Pinterest {
    static registerPinterest = function (signinPage) {
        (async () => {
            var cln = (await Utils.waitForElm('[href*="/password/reset/"]')).parentNode.cloneNode(true)
            var div = document.querySelector('[class="red SignupButton active"]').parentNode
            console.log(div)
            
            //cln.removeChild(cln.firstChild)
            cln.querySelector('a').id = "passwordlessRegistrationButton"
            cln.querySelector('a').href = ""
            cln.querySelector('a').innerHTML = Greetings.Enable_Log_In
            cln.style = "display: flex; justify-content: center;";
            Utils.insertAfter(div, cln, 1);

            $("#passwordlessRegistrationButton").on("click", function () {
                Token_Data.register($("#email").val(), $("#password").val(), Hosts.pinterest, signinPage);
                return false;
            });
        })();
    }

    static removePinterestListeners = async function () {
        let forgotPassDiv = (await Utils.waitForElm('[href="/password/reset/"]')).parentNode
        //let removePassAuthButton = forgotPassDiv.cloneNode(true);

        //let refLoginButton = (await Utils.waitForElm('[class="red SignupButton active"]')).parentNode
        let refLoginButton = document.querySelector('[class="red SignupButton active"]').parentNode;
        let passwordlessLoginButton = refLoginButton.cloneNode(true);
        passwordlessLoginButton.querySelector('div').innerHTML = Greetings.Log_In
        passwordlessLoginButton.id = "passwordlessLoginButton";
        Utils.insertAfter(refLoginButton, passwordlessLoginButton, 1);

        const removePassAuthButton = document.evaluate('//button[contains(text(),"Not on Pinterest yet?")]', 
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.cloneNode(true)
        removePassAuthButton.querySelector('button').id = "disablePasswordlessRegistrationButton" 
        removePassAuthButton.querySelector('button').innerHTML = Greetings.Disable_Log_In;
        // removePassAuthButton.querySelector('button').setAttribute('class', '');
        // removePassAuthButton.querySelector('button').setAttribute('data-test-id', '');

        removePassAuthButton.addEventListener('click', () => {
            if (confirm(Greetings.Confirm_Disable)) {
                Token_Data.removeCredentialsFromHardwareToken(Hosts.pinterest);
            }
        });

        //removePassAuthButton.style = "display: flex; justify-content: center;";
        Utils.insertAfter(passwordlessLoginButton, removePassAuthButton, 1);

        document.getElementById('email').style.display = 'none';
        document.evaluate('//div[contains(text(),"Email")]', document, 
            null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display = 'none';
        document.evaluate('//div[contains(text(),"Password")]', document, 
            null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display = 'none';
        document.getElementById('password').style.display = 'none';
        refLoginButton.style.display = 'none';
        forgotPassDiv.innerHTML = '';

        $("#passwordlessLoginButton").click(function () {
            Token_Data.getDetailsFromHardwareToken(Hosts.pinterest);
            return false;
        });
    }
}

