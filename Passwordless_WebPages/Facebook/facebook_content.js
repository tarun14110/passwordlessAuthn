function insertAfter(referenceNode, newNode, count) {
    var refNode = referenceNode;
    for (let i = 0; i < count; i++) {
        refNode = refNode.nextSibling;
    }
    referenceNode.parentNode.insertBefore(newNode, refNode);
}

class Facebook {

    static registerFacebook = function () {
        var cln = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
        var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode
        cln.querySelector('a').id = "passwordlessRegistrationButton"
        cln.querySelector('a').href = ""
        cln.querySelector('a').innerHTML = Greetings.Enable_Log_In
        insertAfter(div, cln, 1);

        $("#passwordlessRegistrationButton").click(function () {
            if (!($("#email").val() && $("#pass").val())) {
                alert(Greetings.Username_Pass_Warn);
            } else {
                var confirm_msg = "Please confirm your credentials. Username is " + $("#email").val() + " and the password is " + $("#pass").val();
                if (confirm(confirm_msg)) {
                    saveDetailsToHardwareToken("" + $("#email").val() + "||partioned||" + $("#pass").val(), Hosts.facebook);

                    // Dynamically generate the storageToken to ensure uniformity between set/get
                    const storageToken = {};
                    storageToken[Host_Keys.facebook] = true;

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

    static removeFacebookListeners = function () {
        var refLoginButton = document.querySelector('[name="login"]').parentNode;

        var passwordlessLoginButton = document.querySelector('[name="login"]').parentNode.cloneNode(true);
        passwordlessLoginButton.querySelector('button').innerHTML = Greetings.Log_In
        passwordlessLoginButton.querySelector('button').id = "passwordlessLoginButton";
        passwordlessLoginButton.querySelector('button').type = "button";
        var separatingLine = refLoginButton.nextSibling.nextSibling.cloneNode(true);

        insertAfter(refLoginButton, passwordlessLoginButton, 3);
        insertAfter(passwordlessLoginButton, separatingLine, 1);


        var cln = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
        var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode
        cln.querySelector('a').id = "disablePasswordlessRegistrationButton"
        cln.querySelector('a').href = ""
        cln.querySelector('a').innerHTML = Greetings.Disable_Log_In;
        insertAfter(div, cln, 3);

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