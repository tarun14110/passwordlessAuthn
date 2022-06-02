class Facebook {

    static registerFacebook = function () {

        Token_Data.refreshType = Refresh_Types.Single;

        var cln = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
        var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode

        cln.querySelector('a').id = "passwordlessRegistrationButton"
        cln.querySelector('a').href = ""
        cln.querySelector('a').innerHTML = Greetings.Enable_Log_In
        Utils.insertAfter(div, cln, 1);

        $("#passwordlessRegistrationButton").click(function () {
            Token_Data.register($("#email").val(), $("#pass").val(), Hosts.facebook);
            return false;
        });
    }

    static removeFacebookListeners = function () {
        var refLoginButton = document.querySelector('[name="login"]').parentNode;
        var passwordlessLoginButton = document.querySelector('[name="login"]').parentNode.cloneNode(true);

        passwordlessLoginButton.querySelector('button').innerHTML = Greetings.Log_In
        passwordlessLoginButton.querySelector('button').id = "passwordlessLoginButton";
        passwordlessLoginButton.querySelector('button').type = "button";
        var separatingLine = refLoginButton.nextSibling.nextSibling.cloneNode(true);

        Utils.insertAfter(refLoginButton, passwordlessLoginButton, 3);
        Utils.insertAfter(passwordlessLoginButton, separatingLine, 1);

        var removePassAuthButton = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
        var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode

        removePassAuthButton.querySelector('a').id = "disablePasswordlessRegistrationButton"
        removePassAuthButton.querySelector('a').href = ""
        removePassAuthButton.querySelector('a').innerHTML = Greetings.Disable_Log_In;
        Utils.insertAfter(div, removePassAuthButton, 3);

        $("#disablePasswordlessRegistrationButton").click(async function () {
            if (confirm(Greetings.Confirm_Disable)) {
                await Token_Data.removeCredentialsFromHardwareToken(Hosts.facebook);
            }
        });

        const removeEmailNode = document.getElementById('email');
        const removePasswordNode = document.getElementById('pass');
        const removePasswordContainerNode = document.getElementById('passContainer');
        const removeLoginNode = document.evaluate('//button[text()="Log In"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        const removeForgotPassNode = document.evaluate('//a[text()="Forgot password?"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        removeEmailNode.parentNode.removeChild(removeEmailNode);
        removePasswordNode.parentNode.removeChild(removePasswordNode);
        removePasswordContainerNode.parentNode.removeChild(removePasswordContainerNode);
        removeLoginNode.parentNode.removeChild(removeLoginNode);
        removeForgotPassNode.parentNode.removeChild(removeForgotPassNode);

        $("#passwordlessLoginButton").click(function () {
            Token_Data.getDetailsFromHardwareToken(Hosts.facebook);
            return false;
        });
    }
}
