class Amazon {

    static registerAmazon = function () {
        var cln = document.querySelector('[id*="auth-fpp-link-bottom"]').parentNode.cloneNode(true);
        var div = document.querySelector('[id*="auth-signin-button"]').parentNode
        cln.querySelector('a').id = "passwordlessRegistrationButton"
        cln.querySelector('a').href = ""
        cln.querySelector('a').innerHTML = "Enable Passwordless Authentication";
        cln.style = "display: flex; justify-content: center;";
        cln.classList.remove('a-column', 'a-span7', 'a-text-right', 'a-span-last');
        cln.classList.add('flex-container');
        insertAfter(div, cln, 1);

        const userEmail = document.querySelector('[id*="ap_email"]').value;
        console.log(userEmail);

        $("#passwordlessRegistrationButton").click(function () {
            const userPass = document.querySelector('[id*="ap_password"]').value;
            console.log(userPass);
            if (!(userEmail && userPass)) {
                alert("Please fill the email and password field. To enable passwordless login, we need to authenticate you.");
            } else {
                var confirm_msg = "Please confirm your credentials. Username is " + userEmail + " and the password is " + userPass;
                if (confirm(confirm_msg)) {
                    saveDetailsToHardwareToken("" + userEmail + "||partioned||" + userPass);
                    chrome.storage.sync.set({"passwordlessAuth.amazon": true}, function () {
                        console.log("Passwordless Authentication Enabled");
                    });
                    return false;
                } else {
                    alert("Passwordless registration canceled.")
                }
            }

        });
    }

    static removeAmazonListeners = function () {
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