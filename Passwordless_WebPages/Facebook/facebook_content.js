class Facebook {

    static registerFacebook = function () {
        var cln = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
        var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode

        cln.querySelector('a').id = "passwordlessRegistrationButton"
        cln.querySelector('a').href = ""
        cln.querySelector('a').innerHTML = Greetings.Enable_Log_In
        Utils.insertAfter(div, cln, 1);

        $("#passwordlessRegistrationButton").click(function () {
            Utils.register($("#email").val(), $("#pass").val(), Hosts.facebook)
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

        var cln = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
        var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode

        cln.querySelector('a').id = "disablePasswordlessRegistrationButton"
        cln.querySelector('a').href = ""
        cln.querySelector('a').innerHTML = Greetings.Disable_Log_In;
        Utils.insertAfter(div, cln, 3);

        $("#disablePasswordlessRegistrationButton").click(function () {
            var confirm_msg = Greetings.Confirm_Disable
            if (confirm(confirm_msg)) {
                removeDetailsFromHardwareToken(Hosts.facebook);
            }
        });

        $("#passwordlessLoginButton").click(function () {
            getDetailsFromHardwareToken(Hosts.facebook);
            return false;
        });
    }
}