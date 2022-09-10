class Reddit {
    static registerReddit = function (signinPage) {
            var cln = document.querySelector('[href*="/account/register/"]').parentNode.cloneNode(true)
            var div = document.querySelector('[href*="/password"]').parentNode
            
            cln.removeChild(cln.firstChild)
            cln.querySelector('a').id = "passwordlessRegistrationButton"
            cln.querySelector('a').href = ""
            cln.querySelector('a').innerHTML = Greetings.Enable_Log_In
            Utils.insertAfter(div, cln, 1);

            $("#passwordlessRegistrationButton").click(function () {
                Token_Data.register($("#loginUsername").val(), $("#loginPassword").val(), Hosts.reddit, signinPage);
                return false;
            });
    }

    static removeRedditListeners = function () {
        (async () => {
            // var n = await waitUntilElementLoad(document, "button[type='submit']", 1)
            // console.log(n)
            await Utils.waitForElm('[type*="password"]');
            var refLoginButton = document.evaluate('//button[contains(text(),"Log In")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            console.log(refLoginButton)
            var passwordlessLoginButton = refLoginButton.parentNode.cloneNode(true);

            passwordlessLoginButton.querySelector('button').innerHTML = Greetings.Log_In
            passwordlessLoginButton.querySelector('button').id = "passwordlessLoginButton";
            //passwordlessLoginButton.querySelector('button').type = "button";
            //var separatingLine = refLoginButton.nextSibling.nextSibling.cloneNode(true);

            Utils.insertAfter(refLoginButton, passwordlessLoginButton, 1);
            //Utils.insertAfter(passwordlessLoginButton, separatingLine, 1);

            var removePassAuthButton = document.querySelector('[href*="/account/register/"]').parentNode.cloneNode(true);
            removePassAuthButton.removeChild(removePassAuthButton.firstChild)
            var div = document.querySelector('[href*="/password"]').parentNode

            removePassAuthButton.querySelector('a').id = "disablePasswordlessRegistrationButton"
            removePassAuthButton.querySelector('a').href = ""
            removePassAuthButton.querySelector('a').innerHTML = Greetings.Disable_Log_In;
            Utils.insertAfter(div, removePassAuthButton, 1);

            $("#disablePasswordlessRegistrationButton").click(async function () {
                if (confirm(Greetings.Confirm_Disable)) {
                    await Token_Data.removeCredentialsFromHardwareToken(Hosts.reddit);
                }
            });

            // document.getElementById('loginUsername').setAttribute(placeholder, "");
            // document.getElementById('loginPassword').setAttribute(placeholder, "");
            document.getElementById('loginUsername').style.display = 'none';
            document.getElementById('loginPassword').style.display = 'none';
            refLoginButton.style.display = 'none';
            
            // const removeEmailNode = document.getElementById('loginUsername');
            // const removePasswordNode = document.getElementById('loginPassword');


            // //const removePasswordContainerNode = document.getElementById('passContainer');
            //const removeLoginNode = document.evaluate('//button[text()=" Log In "]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            // //const removeForgotPassNode = document.evaluate('//a[text()="Forgot password?"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            
            // removeEmailNode.parentNode.innerHTML = '';
            // removePasswordNode.parentNode.innerHTML = '';
            
            // //removePasswordContainerNode.parentNode.removeChild(removePasswordContainerNode);

            //refLoginButton.parentNode.removeChild(refLoginButton);
            div.innerHTML = '';
            // //removeForgotPassNode.parentNode.removeChild(removeForgotPassNode);

            $("#passwordlessLoginButton").click(function () {
                Token_Data.getDetailsFromHardwareToken(Hosts.reddit);
                return false;
            });
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
