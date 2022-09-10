class Pinterest {
    static registerPinterest = function (signinPage) {
        (async () => {
            var cln = (await Utils.waitForElm('[href*="/password/reset/"]')).parentNode.cloneNode(true)
            var div = document.querySelector('[class="red SignupButton active"]').parentNode
            console.log(div)
            
            //cln.removeChild(cln.firstChild)
            cln.querySelector('a').id = "passwordlessRegistrationButton"
            cln.querySelector('a').href = ""
            cln.querySelector('a').innerHTML = Greetings.Enable_Log_In
            Utils.insertAfter(div, cln, 1);

            $("#passwordlessRegistrationButton").on("click", function () {
                Token_Data.register($("#email").val(), $("#password").val(), Hosts.pinterest, signinPage);
                return false;
            });
        })();
    }
}