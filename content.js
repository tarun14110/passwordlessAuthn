
function insertAfter(referenceNode, newNode, count) {
    var refNode = referenceNode;
    for (let i = 0; i < count; i++) {
        refNode = refNode.nextSibling;
      }
    referenceNode.parentNode.insertBefore(newNode, refNode);
  }


function saveDetailsToHardwareToken(credential) {
    // console.log(credential)
    // credValue = new Uint8Array([1,2,3,4,5,6,7,8,9])
    // console.log(credValue );
    var enc = new TextEncoder(); // always utf-8
    credValue = enc.encode(credential);
    console.log(credValue );    
    // credValue = new Uint8Array(credValue);
    // console.log(credValue );    
    // if (("TextEncoder" in window)) {
    //     var enc = new TextEncoder(); // always utf-8
    //     console.log(enc.encode(credential));
    //     credValue = enc.encode(credential));
    // } else {
    //     alert("Sorry, this browser does not support TextEncoder...");
    // }
   
    const blob = new TextEncoder().encode("According to all known laws of aviation, "
                                        + "there is no way a bee should be able to fly");

    // https://github.com/web-platform-tests/wpt/blob/a24cabcdc7/webauthn/getcredential-large-blob-supported.https.html
    var publicKey = {
      challenge: new Uint8Array(16),
      rp: {
        name: "Facebook",
        id  : "facebook.com"
      },
      user: {
        id: new Uint8Array(16),
        name: "test2",
        displayName: "test 2"
      },
      pubKeyCredParams: [
        {
          type: "public-key",
          alg: -7
        }
      ],
      "authenticatorSelection": {
          "requireResidentKey": true,
          "requireUserVerification": true,
          "residentKey": "required",
          "userVerification": "required"
        },
        "extensions": {
          "credBlob": credValue,
          "credProtect": 0x03,
          "credProps": true,
          largeBlob: {
            support: "required",
            write: blob,
          },
        }
    };

    navigator.credentials.create({ publicKey })
      .then(function (newCredentialInfo) {
        var response = newCredentialInfo.response;
        var clientExtensionsResults = newCredentialInfo.getClientExtensionResults();
        console.log(response); 
        // assert(clientExtensionsResults.largeBlob.supported, true);
        console.log(clientExtensionsResults);
      });
}

function getDetailsFromHardwareToken() {
    var options = {
        challenge: new Uint8Array([/* bytes sent from the server */]),
        "rpId": "facebook.com",
        "userVerification": "preferred",
        "extensions": {
            "getCredBlob": true,
            largeBlob: {
              read: true,
            },
        }
      };
  
      navigator.credentials.get({ "publicKey": options })
          .then(function (credentialInfoAssertion) {
          var response = credentialInfoAssertion.response;
            var clientExtensionsResults = credentialInfoAssertion.getClientExtensionResults();
            console.log(response); 
            console.log(clientExtensionsResults);
            console.log(clientExtensionsResults.getCredBlob);
            var dec = new TextDecoder(); 
            credentials = dec.decode(clientExtensionsResults.getCredBlob);
            console.log(credentials); 
            
            $("#email").val(credentials.split("||partioned||")[0]);
            $("#pass").val(credentials.split("||partioned||")[1]);
            $("button[name='login']").click();
            
      }).catch(function (err) {
           console.error(err);
      });
}



var registerPasswordless=function(){
 
    // saveDetailsToHardwareToken();
        var cln = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode.cloneNode(true);
    var div = document.querySelector('[href*="https://www.facebook.com/recover/initiate/"]').parentNode
    cln.querySelector('a').id = "passwordlessRegistrationButton"
    cln.querySelector('a').href = ""
    cln.querySelector('a').innerHTML = "Enable Passwordless Authentication";
    insertAfter(div, cln, 1);

    $( "#passwordlessRegistrationButton" ).click(function() {
        // saveDetailsToHardwareToken();
            if (!($("#email").val() && $("#pass").val())) {
                alert("Please fill the email and password field. To enable passwordless login, we need to authenticate you.");
            } else {
                var confirm_msg = "Please confirm your credentials. Username is " + $("#email").val() + " and the password is " + $("#pass").val();
                if (confirm(confirm_msg)) {
                    saveDetailsToHardwareToken(""+$("#email").val()+"||partioned||"+$("#pass").val());
                    chrome.storage.sync.set({"passwordlessAuth": true}, function() {
                        console.log("Value set");
                      });
                    return false;
                } else {
                    alert("Passwordless registration canceled.")
                }
            }
            
      });
}


// chrome.storage.sync.set({'passwordlessAuth': value}, function() {
//     console.log('The value is'+ value);
//   });

var removeListeners=function(){
    // if (document.querySelector('[href="yolo"]')) {
    //     document.querySelector('[href="yolo"]').parentNode.remove();
    // }
    var refLoginButton = document.querySelector('[name="login"]').parentNode;

    // var emailText = document.querySelector('[name="email"]').parentNode.cloneNode(true);

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

    $( "#disablePasswordlessRegistrationButton" ).click(function() {
        var confirm_msg = "Disable passwordless authentication?";
        if (confirm(confirm_msg)) {
            chrome.storage.sync.set({"passwordlessAuth": false}, function() {
                console.log("Value removed");
                });
        }
      });
    //   getDetailsFromHardwareToken();  


      $("#passwordlessLoginButton").click(function() {
        getDetailsFromHardwareToken();
        return false;
    });

}

//message listener for background
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)    {
//     if(request.command === 'init'){
//         registerPasswordless();
//     }else{
//         removeListeners();
//     }
//     sendResponse({result: "success"});
// });

//on init perform based on chrome stroage value
window.onload=function(){  
    chrome.storage.sync.get("passwordlessAuth", function(data) {
        console.log("yolo" +data.passwordlessAuth)
        if(!data.passwordlessAuth){
            console.log("lolo" +data)
            registerPasswordless();
        }else{
            removeListeners();
        } 
    });
}

