import {Facebook} from "./Paswordless_WebPages/Facebook/content";

function insertAfter(referenceNode, newNode, count) {
    var refNode = referenceNode;
    for (let i = 0; i < count; i++) {
        refNode = refNode.nextSibling;
    }
    referenceNode.parentNode.insertBefore(newNode, refNode);
}

// var registerFacebook = function () {
//     var cln = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
//     var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode
//     cln.querySelector('a').id = "passwordlessRegistrationButton"
//     cln.querySelector('a').href = ""
//     cln.querySelector('a').innerHTML = "Enable Passwordless Authentication";
//     insertAfter(div, cln, 1);
//
//     $("#passwordlessRegistrationButton").click(function () {
//         if (!($("#email").val() && $("#pass").val())) {
//             alert("Please fill the email and password field. To enable passwordless login, we need to authenticate you.");
//         } else {
//             var confirm_msg = "Please confirm your credentials. Username is " + $("#email").val() + " and the password is " + $("#pass").val();
//             if (confirm(confirm_msg)) {
//                 saveDetailsToHardwareToken("" + $("#email").val() + "||partioned||" + $("#pass").val());
//                 chrome.storage.sync.set({"passwordlessAuth.facebook": true}, function () {
//                     console.log("Passwordless Authentication Enabled");
//                 });
//                 return false;
//             } else {
//                 alert("Passwordless registration canceled.")
//             }
//         }
//
//     });
// }

//on init perform based on chrome storage value
window.onload = () => {

    console.log(Helpers.FindHostName());
    const hostName = Helpers.FindHostName();

    switch (hostName) {
        case "facebook":
            chrome.storage.sync.get("passwordlessAuth.facebook", (data) => {
                if (!data.passwordlessAuth) {
                    console.log("PWLA is not registered for facebook: " + JSON.stringify(data, null, 2))
                    debugger;
                    Facebook.registerFacebook();
                } else {
                    Facebook.removeFacebookListeners();
                }
            });
            break;
        default:
            console.log(hostName + " is not registered with Passwordless Authentication");
    }
}

/**
 * Helper Functions
 */

class Helpers {

    static FindHostName() {
        let removeProtocol = (window.location.href).substr(12);
        return removeProtocol.substring(0, removeProtocol.indexOf('.'));
    }

}

