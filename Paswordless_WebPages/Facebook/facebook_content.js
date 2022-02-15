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
        cln.querySelector('a').innerHTML = "Enable Passwordless Authentication";
        insertAfter(div, cln, 1);

        $("#passwordlessRegistrationButton").click(function () {
            if (!($("#email").val() && $("#pass").val())) {
                alert("Please fill the email and password field. To enable passwordless login, we need to authenticate you.");
            } else {
                var confirm_msg = "Please confirm your credentials. Username is " + $("#email").val() + " and the password is " + $("#pass").val();
                if (confirm(confirm_msg)) {
                    saveDetailsToHardwareToken("" + $("#email").val() + "||partioned||" + $("#pass").val());
                    chrome.storage.sync.set({"passwordlessAuth.facebook": true}, function () {
                        console.log("Passwordless Authentication Enabled");
                    });
                    return false;
                } else {
                    alert("Passwordless registration canceled.")
                }
            }

        });
    }

    static removeFacebookListeners = function () {
        var refLoginButton = document.querySelector('[name="login"]').parentNode;

        var passwordlessLoginButton = document.querySelector('[name="login"]').parentNode.cloneNode(true);
        passwordlessLoginButton.querySelector('button').innerHTML = "Passwordless Log In";
        passwordlessLoginButton.querySelector('button').id = "passwordlessLoginButton";
        passwordlessLoginButton.querySelector('button').type = "button";
        var separatingLine = refLoginButton.nextSibling.nextSibling.cloneNode(true);

        insertAfter(refLoginButton, passwordlessLoginButton, 3);
        insertAfter(passwordlessLoginButton, separatingLine, 1);


        var cln = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
        var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode
        cln.querySelector('a').id = "disablePasswordlessRegistrationButton"
        cln.querySelector('a').href = ""
        cln.querySelector('a').innerHTML = "Disable Passwordless Authentication";
        insertAfter(div, cln, 3);

        $("#disablePasswordlessRegistrationButton").click(function () {
            var confirm_msg = "Disable passwordless authentication?";
            if (confirm(confirm_msg)) {
                chrome.storage.sync.set({"passwordlessAuth.facebook": false}, function () {
                    console.log("Passwordless Authentication Removed");
                });
            }
        });

        $("#passwordlessLoginButton").click(function () {
            getDetailsFromHardwareToken();
            return false;
        });
    }
}