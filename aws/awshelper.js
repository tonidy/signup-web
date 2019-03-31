

/* development
var poolData = {
    UserPoolId: 'ap-northeast-1_DDdlpa05D', // Your user pool id here
    ClientId: '207t4r70ck58ta3jkpip16hqvg' // Your client id here
};*/
/*production

var poolData = {
    UserPoolId: 'ap-northeast-1_l5O34Z2WY', // Your user pool id here
    ClientId: '1rrc4ebo55tjidonnk81dhv7mm' // Your client id here
};
*/


function AWSLogin()
{
    var email = document.getElementById("email").value.toLowerCase();
    var password = document.getElementById("password").value;

    var authenticationData = {
        Username: email,
        Password: password,
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
   
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username: email,
        Pool: userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            AWSCheckUser(true);
           // return true;
        },

        onFailure: function (err) {
            loading.style.display = 'none';
            alert('Invalid user name or password.')
           // return false;
            // alert(err);
        },


    });
}

function AWSSignup()
{
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var email = document.getElementById("email").value.toLowerCase();
    var phone = document.getElementById("phone").value;
    var areacode = document.getElementById("areacode").value;
  //  var company = document.getElementById("company").value;
   // var registrationno = document.getElementById("registrationno").value;
    var password = document.getElementById("password").value;
    var confirmpassword = document.getElementById("confirmpassword").value;
    
    if (phone == "") {
        phone = "00000000";
        areacode="65";
    }

   
   
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
   
    var attributeList = [];

    var dataEmail = {
        Name: 'email',
        Value: email
    };
    var dataGivenname = {
        Name: 'given_name',
        Value: firstname
    };
    var dataFamilyName = {
        Name: 'family_name',
        Value: lastname
    };
    if (phone != "") {
        var dataPhoneNumber = {
            Name: 'phone_number',
            Value: '+' + areacode + phone
        };
        var attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataPhoneNumber);
        attributeList.push(attributePhoneNumber);
    }

   

    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
     var attributeGivenName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataGivenname);
    var attributeFamilyName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataFamilyName);

    attributeList.push(attributeEmail);
  
  
    attributeList.push(attributeGivenName);
    attributeList.push(attributeFamilyName);


    username = email;//firstname+lastname;
    var isSuccess=false;
    userPool.signUp(username, password, attributeList, null, function (err, result) {
        loading.style.display = 'none';

        if (err) {
            alert(err);
            return false;
        }
        cognitoUser = result.user;

        //update custom attributes
        isSuccess = true;

        console.log('user name is ' + cognitoUser.getUsername());
      /*  var signup = document.getElementById("signup");
        if (signup) {
            signup.style.display = "none";
            var verification = document.getElementById("verification");
            verification.style.display = "block";
        }else */
        //alert("start");
        var host = window.location.href.split('/').slice(0, 3).join('/');

        $.post(host + "/home/FinishSignup?email=" + email + "&username=" + firstname + " " + lastname, function (data, status) {
           // alert(data+status);
        });
            alert("Thank you for signing up. A confirmation email has been sent to " + email + ", please check your inbox and click on the verify email link to complete the registration.");
            var redirect = document.getElementById("redirect");
            if (redirect && redirect.value!="") {
                window.location.replace(host + redirect.value);
            }
            else
                window.location.replace(host + "/home/signin");
        

    });
    


    loading.style.display = 'none';
    return isSuccess;
}

function AWSVerify()
{
   
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var userData = {
        Username: username,
        Pool: userPool
    };
    var code = document.getElementById("verificationcode").value;

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
            alert("Invalid verification code");
            loading.style.display = 'none';

            return false;
        }
        alert("You have successfully verified your account.");
        var host = window.location.href.split('/').slice(0, 3).join('/');

        window.location.replace(host + "/home/signin");
        console.log('call result: ' + result);
    });
    /*
   var email = document.getElementById("email").value;
   var password = document.getElementById("password").value;
   var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

   var authenticationData = {
       Username: email,
       Password: password,
   };
   cognitoUser.authenticateUser(authenticationDetails, {
       onSuccess: function (result) {
           // console.log('access token + ' + result.getAccessToken().getJwtToken());
          
           var company = document.getElementById("company").value;
           var registrationno = document.getElementById("registrationno").value;

           var attributeList2 = [];
           var dataCompany = {
               Name: 'custom:company',
               Value: company
           };
           var dataRegistrationNo = {
               Name: 'custom:registrationno',
               Value: registrationno
           };
           var attributeCompany = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataCompany);
           var attributeRegistrationNo = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataRegistrationNo);
           attributeList2.push(attributeCompany);
           attributeList2.push(attributeRegistrationNo);
           alert(company);
           cognitoUser.updateAttributes(attributeList2, function (err, result) {
               if (err) {
                   alert(err);
                   return;
               }
               alert(result);
           });
           cognitoUser.signOut();
       },

       onFailure: function (err) {
           alert(err);
       },


   });*/

}
function AWSVerifyWithEmail()
{
   
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var username = document.getElementById("email").value;

    var userData = {
        Username: username,
        Pool: userPool
    };
    var code = document.getElementById("verificationcode").value;

    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
            alert("Invalid verification code");
            return false;
        }
        alert("You have successfully verified your account. Please sign in to start.");

        var host = window.location.href.split('/').slice(0, 3).join('/');

        window.location.replace(host + "/home/signin");

        console.log('call result: ' + result);
    });
}
function AWSGetUserId() {
   
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    return cognitoUser.getUsername();
}
function AWSCheckUser(islogin)
{
   

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, session) {
            if (err) {
                window.location.replace("/");
                return;
            }

            if (!session.isValid()) {
                window.location.replace("/");
                return;
            }
            // console.log('session validity: ' + session.isValid());


            // NOTE: getSession must be called to authenticate user before calling getUserAttributes
            cognitoUser.getUserAttributes(function (err, attributes) {
                if (err) {
                    // Handle error
                    window.location.replace("/");
                    return;
                } else {

                    if (islogin) {
                        document.getElementById("UserId").value = cognitoUser.getUsername();
                        document.getElementById("UserName").value = attributes[4].getValue();
                        document.getElementById("Key").value = "";

                        $.post("/home/login", $("#fblogin").serialize(), function (data) {
                            if (data == "notverified") {
                                alert("Email not verified, please check your email inbox to find our welcome email and clcik on the verification link.");
                                window.location.replace("/");
                            }
                            else
                                window.location.replace("/dashboard");
                           
                        });
                    } else {
                        $(function () {
                            // alert(cognitoUser.getUsername());
                            $.post('/SetSession/SetVariable',
                                   { key: "UserName", value: cognitoUser.getUsername() }, function (data) {
                                       //alert("Success " + data.success);
                                   });
                        });

                        // Do something with attributes
                        // if (document.getElementById('lblusername'))
                        // document.getElementById('lblusername').innerHTML = attributes[4].getValue();

                        $(function () {
                            // alert(cognitoUser.getUsername());
                            $.post('/SetSession/SetVariable',
                                   { key: "Name", value: attributes[4].getValue() }, function (data) {
                                       // alert("Success " + data.success);
                                       if (islogin)
                                           window.location.replace("/dashboard");
                                   });
                        });
                    }
                }
            });
            /*
            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: '...', // your identity pool id here
                Logins: {
                    // Change the key below according to the specific region your user pool is in.
                    'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': session.getIdToken().getJwtToken()
                }
            });*/

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3();

        });
    } else {
        window.location.replace("/");
    }
}

function AWSLogout() {

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    cognitoUser.signOut();
   
    window.location.replace("/");

}

function AWSChangePassword()
{
    
    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
        cognitoUser.getSession(function (err, result) {
            if (result) {
                // alert('You are now logged in.');


            }
        });
    }

    var oldPassword = document.getElementById("oldpassword").value;
    var newPassword = document.getElementById("newpassword").value;

    cognitoUser.changePassword(oldPassword, newPassword, function (err, result) {
        if (err) {
            alert(err);
            return false;
        }
        alert("Password changed successfully.");
        window.location.replace('/dashboard');
        console.log('call result: ' + result);
    });
    return false;
}
function AWSForgotPassword() {

    var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
    var userData = {
        Username: username,
        Pool: userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    var verificationCode = document.getElementById("code").value;
    var newPassword = document.getElementById("password").value;

    cognitoUser.confirmPassword(verificationCode, newPassword, {
        onFailure(err) {
            alert(err);
        },
        onSuccess() {
            alert("Password updated successfully. Please sign in with your new password.");

            window.location.replace("/home/signin");
        },
    });
}