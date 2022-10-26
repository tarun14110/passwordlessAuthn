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

    static removeRedditListeners = async function () {
        // //(async () => {
        //     // var n = await waitUntilElementLoad(document, "button[type='submit']", 1)
        //     // console.log(n)
        //     await new Promise((resolve, reject) => {
        //         const button = document.querySelector(('[href*="//www.reddit.com/login/"]'))
        //         if (!button) {
        //             reject("cannot get the log in button")
        //         }
        //         button.addEventListener('click', () => resolve());
        //     });
            //await Utils.waitForElm('input[id="loginUsername"]');

            const iframeDocument = await waitUntilElementLoad(document, "iframe", 1)
            var refLoginButton = document.querySelector('[class*="AnimatedForm__submitButton m-full-width"]');
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

            document.getElementById('loginUsername').style.display = 'none';
            document.getElementById('loginPassword').style.display = 'none';
            refLoginButton.style.display = 'none';
            div.innerHTML = '';

            $("#passwordlessLoginButton").click(function () {
                Token_Data.getDetailsFromHardwareToken(Hosts.reddit);
                return false;
            });
        //})();
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
