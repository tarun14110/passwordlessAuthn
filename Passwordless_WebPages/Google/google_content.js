class Google {

    static registerGoogle = function () {
        console.log("Calling google Register")

        /**
         * Find the inner text of the create account link and then clone it that way.
         * Avoid using id's and class querySelectors.
         * Can we use the parent/child relationships to find the specific element we are looking for?
         *
         * Feb 26. None of this is working. None of the nodes have nextSibling relationships, not able to
         * insert after we grab both of the nodes we want to work with.
         *
         * [x] find nodes w/o using class/id tags
         *
         */

        function getElementByXpath(doc, xpath) {
            return doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

////*[contains(@attribute, "part_of_attribute_value")]
        const x = '//*[text()="Forgot password?"]'

        // Grab the next button on the email page
        const nextButtonXPath = '//*[text()="Next"]'
        const nextButton = document.evaluate(nextButtonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.cloneNode(true);
        nextButton.addEventListener('click', eventHandler)
        console.log(nextButton)

        // Grab the original create account button
        const createAccountXPath = '//*[text()="Create account"]'
        const createAccount = document.evaluate(createAccountXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
            .singleNodeValue.parentNode.cloneNode(true);
        console.log("Create account parent node: ")
        console.log(createAccount)

        function eventHandler(e) {
            console.log("button has been clicked: " + JSON.stringify(e, null, 2))
        }

        // Clone the original continue button into the new pwlLoginClone button
        const pwlLoginClone = document.evaluate(x, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        pwlLoginClone.innerHTML = "Hello"


        const div = document.querySelector('[class="dG5hZc"]');
        console.log(div)

        const forgotPassword = document.querySelector('[id="view_container"]')
        const forgotPassword2 = document.querySelector('[class="RwBngc"]')

        refForgotPassword.parentNode.insertBefore(pwlLoginClone, refForgotPassword);


        // console.log(parentRef)
        // refForgotPassword.textContent = "Hello"
        // console.log(refForgotPassword)

        // parentRef.parentNode.insertBefore(refForgotPassword, parentRef);


        // parentRef.insertBefore(refForgotPassword, parentRef);

        // this is working!
        // const x = ($("span:contains(Create account)")).clone()
        // const y = ($("span:contains(Create account)")).clone()
        // console.log(x[0])
        // console.log(x[0].innerHTML)
        // console.log(x[0].innerText)
        // x.innerText = "Passwordless Authentication"
        // x.innerHTML = "Passwordless Authentication"
        // insertAfter(y, x, 1)

        // const div = document.querySelector('[class="VfPpkd-vQzf8d"]').parentNode;
        // // cln.querySelector('a').id = "passwordlessRegistrationButton"
        // // cln.querySelector('a').href = ""
        // // cln.querySelector('a').innerHTML = "Enable Passwordless Authentication";
        // // cln.style = "display: flex; justify-content: center;";
        // // cln.classList.remove('a-column', 'a-span7', 'a-text-right', 'a-span-last');
        // // cln.classList.add('flex-container');
        // insertAfter(div, cln, 1);

        const userEmail = document.querySelector('[id*="profileIdentifier"]').innerHTML;
        console.log("User Email: " + userEmail)
        //
        // $("#passwordlessRegistrationButton").click(function () {
        //     const userPass = document.querySelector('[id*="ap_password"]').value;
        //     if (!(userEmail && userPass)) {
        //         alert("Please fill the email and password field. To enable passwordless login, we need to authenticate you.");
        //     } else {
        //         var confirm_msg = "Please confirm your credentials. Username is " + userEmail + " and the password is " + userPass;
        //         if (confirm(confirm_msg)) {
        //             saveDetailsToHardwareToken("" + userEmail + "||partioned||" + userPass, Hosts.amazon);
        //
        //             // Dynamically generate the storageToken to ensure uniformity between set/get
        //             const storageToken = {};
        //             storageToken[Host_Keys.amazon] = true;
        //
        //             chrome.storage.sync.set(storageToken, function () {
        //                 console.log(Greetings.Enabled);
        //             });
        //             return false;
        //         } else {
        //             alert(Greetings.Cancel_Registration)
        //         }
        //     }
        //
        // });
    }

    static removeGoogleListeners = function () {
        // // Grab the original continue button
        // const refContinueButton = document.querySelector('[id="continue"]').parentNode;
        //
        // // Clone the original continue button into the new pwlLoginClone button
        // const pwlLoginClone = document.querySelector('[id="continue"]').parentNode.cloneNode(true);
        //
        // // Grab the 'input' tag from the pwlLoginClone continue button
        // const pwlLoginButton = pwlLoginClone.childNodes[1].childNodes[0].childNodes[0];
        //
        // // Modify the type and id of the pwlLoginClone button
        // pwlLoginButton.type = "button";
        // pwlLoginButton.id = "passwordlessLoginButton";
        //
        // // Modify the inner html of the pwlLoginClone button
        // const pwlLoginSpanText = pwlLoginClone.childNodes[1].childNodes[0].childNodes[1];
        // pwlLoginSpanText.innerHTML = " Passwordless Login "
        //
        // // Set the onclick method functionality for the new pwlLoginClone button
        // pwlLoginButton.onclick = () => {
        //     getDetailsFromHardwareToken(Hosts.amazon);
        // }
        //
        // // Remove the legal text underneath the original continue button after the original has already been cloned
        // const legalTextRow = document.getElementById("legalTextRow");
        // legalTextRow.parentNode.removeChild(legalTextRow);
        //
        // // Add the pwlLoginClone button after the original continue button
        // insertAfter(refContinueButton, pwlLoginClone, 1);
        //
        // // Clone the legal text div to get the formatting
        // const legalTextClone = legalTextRow.cloneNode(true);
        //
        // // Grab a hyperlink node from the legal text node, to retain classes...etc
        // const linkTextNode = legalTextClone.childNodes[1];
        //
        // // Remove all the child nodes from the legal text clone
        // while (legalTextClone.firstChild) {
        //     legalTextClone.removeChild(legalTextClone.lastChild);
        // }
        //
        // // Set all the clones data to become the new auth disabler
        // legalTextClone.id = "disablePasswordlessLogin";
        // legalTextClone.appendChild(linkTextNode);
        // legalTextClone.innerHTML = "<a href=" + "" + "> Disable Passwordless Login </a>";
        //
        // // Add the onclick functionality to the auth disabler
        // legalTextClone.onclick = () => {
        //     console.log(Greetings.Disabled);
        //     var confirm_msg = "Disable passwordless authentication?";
        //     if (confirm(confirm_msg)) {
        //         removeDetailsFromHardwareToken(Hosts.amazon);
        //     }
        // }
        //
        // // Set up the insertion for the new auth disabler
        // const referenceNode = pwlLoginClone.childNodes[4];
        // referenceNode.parentNode.insertBefore(legalTextClone, referenceNode);

    }

}