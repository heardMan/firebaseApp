var app = {
    state: {
        currentPage: null,
    },
    baseUI: function () {
        console.log('baseUI start running');
        //create navbar base UI content
        var navAbout = `<li id='navAbout'><a href='#'>About</a></li>`;
        var navContact = `<li id='navContact'><a href='#'>Contact</a></li>`;
        document.querySelector('#nav-items').innerHTML = navAbout + navContact;
        //create sidenav base UI content
        var sideAbout = `<li id='sideAbout'><a href='#'>About</a></li>`;
        var sideContact = `<li id='sideContact'><a href='#'>Contact</a></li>`;
        document.querySelector('#slide-out').innerHTML = sideAbout + sideContact;
        //check authorization status
        app.getUserAuthState(app.loggedInUI, app.loggedOutUI);
        //register click events
        document.querySelector('#toggler').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#toggler clicked');
            var elem = document.querySelector('.sidenav');
            var instance = M.Sidenav.getInstance(elem);
            instance.open();
        });
        document.querySelector('#side-toggler').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#side-toggler clicked');
            var elem = document.querySelector('.sidenav');
            var instance = M.Sidenav.getInstance(elem);
            instance.close();
        });
        console.log('baseUI end running');
    },
    loggedInUI: function (user) {
        console.log('loggedInUI start running');
        // User is signed in.
        console.log('user signed in');
        //user profile information
        console.log(user);

        var emailVerified = user.emailVerified;
        var uid = user.uid;
        var name = user.displayName;
        var email = user.email;

        var photoUrl = 'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg';

        if (emailVerified === false) {
            console.log('user Not Verified');
            app.verifyEmail(user);
            app.logOut();
        } else {
            console.log('user Verified');
            firebase.database().ref('users/' + uid).on('value', function (snapshot) {
                //console.log(snapshot.val());
                var data = snapshot.val();
                name = data.firstName + ' ' + data.lastName;
                email = data.email;
                //remove signed out ui content
                var signedOutContent = document.querySelectorAll('.signIn, #sideNavMyAccount, #navSignOut, #sideSignOut, #sideUser');
                for (var i = 0; i < signedOutContent.length; i++) {
                    signedOutContent[i].parentNode.removeChild(signedOutContent[i])
                }
                //add signed in ui content
                var navItems = document.querySelector('#nav-items').innerHTML;
                var navMyAccount = `<li id='sideNavMyAccount'><a href='#' class='myAccount'>My Account</a></li>`;
                var navSignOut = `<li id='navSignOut'><a href='#' class='signOut'>Sign Out</a></li>`;
                document.querySelector('#nav-items').innerHTML = navMyAccount + navItems + navSignOut;
                var sideNavItems = document.querySelector('#slide-out').innerHTML;
                var sideSignOut = `<li id='sideSignOut'><a href='#' class='signOut'>Sign Out</a></li>`;
                var userImg = `<a href='#'><img class='circle' src='${photoUrl}'/></a>`;
                var userName = `<a href='#'><span class='white-text name'>${name}</span></a>`;
                var userEmail = `<a id='sideEmail'  href='#'><span class='white-text email'>${email}</span></a>`;
                var userView = `<div class='user-view'><div class='background blue darken-3'>${userImg + userName + userEmail}</div></div>`;
                var user = `<li id='sideUser'>${userView}</li>`;
                var sideNavMyAccount = `<li id='sideNavMyAccount'><a href='#' class='myAccount'>My Account</a></li>`;
                var messages = `<li id='userMessages'><a href='#' class='myMessages'>Messenger</a></li>`;
                document.querySelector('#slide-out').innerHTML = user + sideNavMyAccount + messages + sideNavItems + sideSignOut;
                //register click events
                var myAccount = document.querySelectorAll('.myAccount');
                for (var i = 0; i < myAccount.length; i++) {
                    myAccount[i].addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('.myAccount clicked');
                        app.accountPage(data)
                    });
                }
                var signIn = document.querySelectorAll('.signOut');
                for (var i = 0; i < signIn.length; i++) {
                    signIn[i].addEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('.signOut clicked');
                        app.logOut();
                    });
                }
                var userMessages = document.querySelector('#userMessages');
                userMessages.addEventListener('click', function (e) {
                    e.preventDefault();
                    //e.stopPropagation();
                    console.log(userMessages);
                    app.messenger();

                });
            });
        }
        console.log('loggedInUI end running');
    },
    accountPage: function (data) {
        console.log('accountPage start running');

        var user = firebase.auth().currentUser;

        var inputFName = `<div id='inputFName' class='input-field'>
                            <i class='material-icons prefix'>account_circle</i>
                            <input disabled id='yourFirstName' type='text' class='validate' placeholder='${data.firstName}'>
                            <label for='firstName'></label>
                          </div>`;

        var inputLName = `<div id='inputLName' class='input-field'>
                            <i class='material-icons prefix'></i>
                            <input disabled id='yourLastName' type='text' class='validate' placeholder='${data.lastName}'>
                            <label for='lastName'></label>
                          </div>`;

        var inputEmail = `<div id='inputEmail' class='input-field'>
                            <i class='material-icons prefix'>email</i>
                            <input disabled id='yourEmail' type='email' class='validate' placeholder='${data.email}'>
                            <label for='email'></label>
                          </div>`;

        var inputPass = `<div id='inputPass' class='input-field'>
                          <i class='material-icons prefix'>lock_outline</i>
                          <input disabled id='yourPass' type='password' class='validate' placeholder='enter a new password'>
                          <label for='email'></label>
                        </div>`;

        var confirmPass = `<div id='confirmPass' class='input-field'>
                        <i class='material-icons prefix'>lock</i>
                        <input disabled id='confirmYourPass' type='password' class='validate' placeholder='confirm password'>
                        <label for='email'></label>
                      </div>`;

        var deleteAccountButton = `<a id='deleteAccount' class='btn'>Delete</a>`;

        var editFName = `<a id='editFName' data='edit' class='btn-floating edit'>
                            <i id='editFNameIcon' class="small material-icons">edit</i>
                         </a>`;

        var editLName = `<a id='editLName' data='edit' class='btn-floating edit'>
                            <i id='editLNameIcon' class="small material-icons">edit</i>
                         </a>`;

        var editEmail = `<a id='editEmail' data='edit' class='btn-floating edit'>
                            <i id='editEmailIcon' class="small material-icons">edit</i>
                         </a>`;

        var editPass = `<a id='editPass' class='btn-floating edit'>
                         <i id='editPassIcon' class="small material-icons">edit</i>
                      </a>`;

        var addNewPass = `<a id='addNewPass' class='btn-floating edit'>
                         <i id='confirmPassIcon' class="small material-icons">add</i>
                      </a>`;

        var acctInfoFName = `<div class='row acctField'>
                                <div class='col s9'>${inputFName}</div>
                                <div class='col s2 '>${editFName}</a></div>
                             </div>`;

        var acctInfoLName = `<div class='row acctField'>
                                <div class='col s9'>${inputLName}</div>
                                <div class='col s2 '>${editLName}</a></div>
                             </div>`;

        var acctInfoEmail = `<div class='row acctField'>
                                <div class='col s9'>${inputEmail}</div>
                                <div class='col s2 '>${editEmail}</div>
                             </div>`;

        var acctConfirmPass = `<div id='addanewpassword' class='row acctField'>
                                <div class= 'col s12'>
                                    <ul id='passCollapse' data='closed' class="collapsible z-depth-0">
                                        <li>
                                            <div id='passCollapse-header' class=" blue-grey darken-1">
                                                <div class='row acctField'>
                                                    <div class='col s9'>${inputPass}</div>
                                                    <div class='col s2 '>${editPass}</div>
                                                </div>
                                            </div>
                                            <div id='passCollapse-body' class="collapsible-body blue-grey darken-1">
                                                <div class='row acctField'>
                                                    <div class='col s9'>${confirmPass}</div>
                                                    <div class='col s2 '>${addNewPass}</div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                               </div>`;

        var deleteAccount = `<div class='row acctField'>
                                <div class='col s12'>${deleteAccountButton}</div>
                             </div>`;

        var accountInfo = `<div class='card horizontal blue-grey darken-1'>
                            <div id='acctInfoCont' class='card-content white-text'>
                                <span class='card-title'>Card Title</span>
                                    ${acctInfoFName + acctInfoLName + acctInfoEmail + acctConfirmPass + deleteAccount}    
                            </div>`;

        var profilePic = 'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg';

        var profilePicCard = `<div class='card'>
                                <div class='card-image'>
                                    <img src='${profilePic}'/>
                                </div>
                              </div>`;

        var accountPanel = `<div id='accountSummary' class='row'>
                                <div class='col s12'>
                                    <div id='accountPanel' class='card-panel teal'>
                                        <div class='row'>
                                            <div class='col s12 m5'>${profilePicCard}</div>
                                            <div class='col s12 m7'>${accountInfo}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>`;

        document.querySelector('#main-content').innerHTML = '';
        document.querySelector('#main-content').innerHTML = accountPanel;
        //register click events
        //first name
        document.querySelector('#editFName').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#editFName clicked');
            var status = document.querySelector('#editFName').getAttribute('data');
            var icon = document.querySelector('#editFNameIcon');
            var input = document.querySelector('#yourFirstName');
            if (status === 'edit') {
                icon.innerHTML = 'add';
                document.querySelector('#editFName').setAttribute('data', 'add');
                input.removeAttribute('disabled');
            } else {
                icon.innerHTML = 'edit';
                document.querySelector('#editFName').setAttribute('data', 'edit');
                input.setAttribute('disabled', '');
                var newFName = document.querySelector('#yourFirstName').value;
                var userId = data.userID;
                data.firstName = newFName;
                firebase.database().ref('users/' + userId).update({
                    'firstName': newFName
                });
                user.updateProfile({
                    displayName: data.firstName + ' ' + data.lastName,
                }).then(function () {
                    // Update successful.
                }).catch(function (error) {
                    // An error happened.
                });
                document.querySelector('#yourFirstName').value = '';
                document.querySelector('#yourFirstName').setAttribute('placeholder', data.firstName);
                setTimeout(function () {
                    document.querySelector('#yourFirstName').classList.remove('valid');
                }, 1000 * 5);

            }
        });
        //lastname
        document.querySelector('#editLName').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#editLName clicked');
            var status = document.querySelector('#editLName').getAttribute('data');
            var icon = document.querySelector('#editLNameIcon');
            var input = document.querySelector('#yourLastName');
            if (status === 'edit') {
                icon.innerHTML = 'add';
                document.querySelector('#editLName').setAttribute('data', 'add');
                input.removeAttribute('disabled');
            } else {
                icon.innerHTML = 'edit';
                document.querySelector('#editLName').setAttribute('data', 'edit');
                input.setAttribute('disabled', '');

                var newLName = document.querySelector('#yourLastName').value;
                var userId = data.userID;
                console.log(userId);
                data.lastName = newLName;
                console.log(data);
                firebase.database().ref('users/' + userId).update({
                    'lastName': newLName
                });
                user.updateProfile({
                    displayName: data.firstName + ' ' + data.lastName,
                }).then(function () {
                    // Update successful.
                }).catch(function (error) {
                    // An error happened.
                });
                document.querySelector('#yourLastName').value = '';
                document.querySelector('#yourLastName').setAttribute('placeholder', data.lastName);
                setTimeout(function () {
                    document.querySelector('#yourLastName').classList.remove('valid');
                }, 1000 * 5);
            }
        });
        //email
        document.querySelector('#editEmail').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#editEmail clicked');
            var status = document.querySelector('#editEmail').getAttribute('data');
            var icon = document.querySelector('#editEmailIcon');
            var input = document.querySelector('#yourEmail');
            if (status === 'edit') {
                icon.innerHTML = 'add';
                document.querySelector('#editEmail').setAttribute('data', 'add');
                input.removeAttribute('disabled');
            } else {
                icon.innerHTML = 'edit';
                document.querySelector('#editEmail').setAttribute('data', 'edit');
                input.setAttribute('disabled', '');

                var newEmail = document.querySelector('#yourEmail').value;
                var userId = data.userID;
                console.log(userId);
                data.email = newEmail;
                console.log(data);
                firebase.database().ref('users/' + userId).update({
                    'email': newEmail
                });
                user.updateEmail(newEmail).then(function () {
                    // Update successful.
                }).catch(function (error) {
                    // An error happened.
                });
                document.querySelector('#yourEmail').value = '';
                document.querySelector('#yourEmail').setAttribute('placeholder', data.email);
                setTimeout(function () {
                    document.querySelector('#yourEmail').classList.remove('valid');
                }, 1000 * 5);
            }
        });
        //password

        document.querySelector('#addNewPass').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#addNewPass clicked');

            var elem = document.querySelector('.collapsible');
            var instance = M.Collapsible.getInstance(elem);
            var newPass = document.querySelector('#yourPass');
            var newPassConfirmed = document.querySelector('#confirmYourPass');
            if (newPass.value === newPassConfirmed.value) {
                console.log('its a match');
                var newPassword = newPassConfirmed.value;
                user.updatePassword(newPassword).then(function () {
                    // Update successful.
                }).catch(function (error) {
                    // An error happened.
                });
                instance.close();
                newPass.setAttribute('disabled', '');
                newPassConfirmed.setAttribute('disabled', '');
                document.querySelector('#passCollapse').setAttribute('data', 'closed');
                document.querySelector('#yourPass').value = '';
                document.querySelector('#confirmYourPass').value = '';
                setTimeout(function () {
                    document.querySelector('#yourPass').classList.remove('valid');
                    document.querySelector('#confirmYourPass').classList.remove('valid');
                }, 1000 * 5);

            }
        });

        document.querySelector('#editPass').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#editPass clicked');
            var state = document.querySelector('#passCollapse').getAttribute('data');
            var newPass = document.querySelector('#yourPass');
            var newPassConfirmed = document.querySelector('#confirmYourPass');
            var elem = document.querySelector('.collapsible');
            console.log(elem);
            var instance = M.Collapsible.getInstance(elem);
            console.log(instance);
            if (state === 'closed') {
                instance.open();
                newPass.removeAttribute('disabled');
                newPassConfirmed.removeAttribute('disabled');
                document.querySelector('#passCollapse').setAttribute('data', 'open');

            } else {
                instance.close();
                newPass.setAttribute('disabled', '');
                newPassConfirmed.setAttribute('disabled', '');
                document.querySelector('#passCollapse').setAttribute('data', 'closed');
                document.querySelector('#yourPass').value = '';
                document.querySelector('#confirmYourPass').value = '';

            }


        });
        //delete Account
        document.querySelector('#deleteAccount').addEventListener('click', function (e) {
            e.preventDefault();
            console.log('#deleteAccount clicked');
            console.log('risky');
            e.stopPropagation();
            //console.log(user);
            app.deleteAccountModal(user);


        });

        //initiate collapsible elements
        var elems = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems);

        console.log('accountPage end running');

    },
    loggedOutUI: function () {
        console.log('loggedOutUI start running');
        //No user is signed in.
        console.log('user not signed in');
        //remove signed in ui content
        document.querySelector('#main-content').innerHTML = '';
        var signedInContent = document.querySelectorAll(".signIn, .myAccount, .signOut, #sideUser");
        if (signedInContent) {
            for (var i = 0; i < signedInContent.length; i++)
                signedInContent[i].parentNode.removeChild(signedInContent[i]);
        }
        //create signed out ui content
        var navSignIn = `<li id='navSignIn'><a href='#' class='signIn'>Sign In / Register</a></li>`;
        var navItems = document.querySelector('#nav-items').innerHTML;
        document.querySelector('#nav-items').innerHTML = navSignIn + navItems;
        var sideSignIn = `<li id='sideNavSignIn'><a href='#' class='signIn'> Sign In / Register</li>`;
        var sideAbout = `<li id='sideAbout'><a href='#'>About</a></li>`;
        var sideContact = `<li id='sideContact'><a href='#'>Contact</a></li>`;
        document.querySelector('#slide-out').innerHTML = sideSignIn + sideAbout + sideContact;
        //register click events
        var signIn = document.querySelectorAll('.signIn');
        for (var i = 0; i < signIn.length; i++) {
            signIn[i].addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                console.log('.signIn clicked');
                var elem = document.querySelector('.sidenav');
                var instance = M.Sidenav.getInstance(elem);
                instance.close();
                app.signInForm();
            });
        }
        console.log('loggedOutUI end running');
    },
    messenger: function () {


        var somePhoto = 'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg';

        var contacts = `<div id="contacts">
                            Contacts
                        </div>`;

        var convoPanel = `<div id='convoPanel' class='card-panel teal'></div>`;

        var messageInput = `<div class='row'>
                                <div class="input-field col s9">
                                    <input placeholder="Send a Message" id="newMessage" type="text" class="validate">
                                    
                                </div>
                                <div class='col s3'>
                                    <a id='sendMessage' class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">send</i></a>
                                </div>
                            </div>`;

        var openConvo = `<div id='openConvo' class='card'>
                            <div class="card-content white-text">Blah Blah</div>
                            <div class="card-action">${messageInput}</div>
                         </div>`;

        var messages = `<div id="messages">
                            <div class='row'>
                                <div class='col m4 hide-on-small-only'>${convoPanel}</div>
                                <div class='col s12 m8'>${openConvo}</div>
                            </div>
                        </div>`;

        var messenger = `<div id='messenger' class='row'>
                            <div class='col s12'>
                                <div class='card'>
                                    <div class='card-content'>
                                        <div>Title</div>
                                    </div>
                                    
                                    <div id='messengerContent' class='card-content grey lighten-4'>
                                        ${contacts}
                                        ${messages}
                                    </div>

                                    <div class='card-tabs'>
                                        <ul class='tabs tabs-fixed-width'>
                                            <li id='contactsTab' class='tab'><a href='#contacts'>Contacts</a></li>
                                            <li id='messagesTab'class='tab'><a href='#messages'>Messages</a></li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>`;

        document.querySelector('#main-content').innerHTML = '';
        document.querySelector('#main-content').innerHTML = messenger;
        //M.AutoInit();

        var tabs = document.querySelectorAll('.tabs');
        for(var i = 0; i < tabs.length; i++){
            M.Tabs.init(tabs[i]);
        }
        
    },
    signInForm: function () {
        console.log('signInForm start running');
        //create sign in form content
        var title = `<h4>Sign In</h4>`;
        var email = `<input id='userEmail' type='email' placeholder='example@gmail.com'></input>`;
        var password = `<input id='userPassword' type='password' placeholder='password'></input>`;
        var signIn = `<button id='signInButton' class='btn-flat blue darken-4 white-text center-align'>Sign In</button>`;
        var signInForm = `<form id='signInForm'>${title + email + password + signIn}</form>`;
        //update modal content
        document.querySelector('#form-modal-content').innerHTML = signInForm;
        //update modal footer
        var register = `<div>Don't have an account? <a href='#' id='toRegister'>Register Here</a></div>
                        <div><a id='passwordResetLink' href='#'>Reset Your Password</a></div>`;
        document.querySelector('#form-modal-footer').innerHTML = register;
        //register click events
        document.querySelector('#signInButton').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#signInButton clicked');
            var email = document.querySelector('#userEmail').value;
            var password = document.querySelector('#userPassword').value;
            app.logIn(email, password);
            var elem = document.querySelector('.modal');
            var instance = M.Modal.getInstance(elem);
            instance.close();

        });
        document.querySelector('#toRegister').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#toRegister clicked');
            var elem = document.querySelector('.modal');
            var instance = M.Modal.getInstance(elem);
            instance.close();
            app.registrationForm();
        });
        document.querySelector('#passwordResetLink').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#passwordResetLink clicked');
            app.passWordResetModal();
        });

        //open modal
        var elem = document.querySelector('.modal');
        var instance = M.Modal.getInstance(elem);
        instance.open();
        console.log('signInForm end running');
    },
    passWordResetModal: function () {
        console.log('passWordResetModal start running');
        document.querySelector('#form-modal-content').innerHTML = `<div><div class="row">
            <div class="input-field col s12">
              <input id="emailForNewPass" type="email" class="validate">
              <label for="email">Email</label>
              <span class="helper-text" data-error="wrong" data-success="right">Helper text</span>
            </div></div>`;
        document.querySelector('#form-modal-footer').innerHTML = `<a id='sendNewPass' class='btn'>Reset Password</a>`;

        document.querySelector('#sendNewPass').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#sendNewPass clicked');
            var email = document.querySelector('#emailForNewPass').value;
            app.forgotPassword(email);
        });

        app.openModal();
        console.log('passWordResetModal end running');
    },
    registrationForm: function () {
        console.log('registrationForm start running');
        //create registration form content
        var title = `<h4>Create an Account</h4>`;
        var firstName = `<input id='newUserfName' type='email' placeholder='John'></input>`;
        var lastName = `<input id='newUserlName' type='email' placeholder='Smith'></input>`;
        var email = `<input id='newUserEmail' type='email' placeholder='example@gmail.com'></input>`;
        var password = `<input id='newUserPassword' type='password' placeholder='password'></input>`;
        var register = `<button id='register' class='btn-flat blue darken-4 white-text center-align'>Register</button>`;
        var registrationForm = `<form id='registrationForm'>${title + firstName + lastName + email + password + register}</form>`;
        //update modal content
        document.querySelector('#form-modal-content').innerHTML = registrationForm;
        //update modal footer
        var signIn = `<div>Already have an account? <a href='#' id='toSignIn'>Sign In</a></div>`;
        document.querySelector('#form-modal-footer').innerHTML = signIn;
        //register click events
        document.querySelector('#register').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#register clicked');
            app.createUser();
            var elem = document.querySelector('.modal');
            var instance = M.Modal.getInstance(elem);
            instance.close();

        });
        document.querySelector('#toSignIn').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#toSignIn clicked');
            var elem = document.querySelector('.modal');
            var instance = M.Modal.getInstance(elem);
            instance.close();
            app.signInForm();
        });
        //open modal
        var elem = document.querySelector('.modal');
        var instance = M.Modal.getInstance(elem);
        instance.open();
        console.log('registrationForm end running');

    },
    deleteAccountModal: function (user) {
        console.log('deleteAccountModal start running');
        var content = `<div>Are you sure that you want to delete your account?</div>`;
        var confirmation = `<div>
                                <a id='deleteAcctLink' class='btn'> Delete Account </a>
                                <a id='closeDeleteAccountModal' class='btn'> Go Back </a>
                            </div>`;

        document.querySelector('#form-modal-content').innerHTML = content;
        document.querySelector('#form-modal-footer').innerHTML = confirmation;

        document.querySelector('#deleteAcctLink').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#deleteAcctLink clicked');
            app.deleteUser(user);
            //console.log(user);
        });

        document.querySelector('#closeDeleteAccountModal').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#closeDeleteAccountModal clicked');
            app.closeModal();
        });

        //open modal
        var elem = document.querySelector('.modal');
        var instance = M.Modal.getInstance(elem);
        instance.open();
        console.log('deleteAccountModal end running');
    },
    createUser: function () {
        console.log('createUser start running');
        var userFirstName = document.querySelector('#newUserfName').value;
        var userLastName = document.querySelector('#newUserlName').value;
        var email = document.querySelector('#newUserEmail').value;
        var password = document.querySelector('#newUserPassword').value;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (user) {
                console.log("got the user");
                console.log(user.user.uid);
                var uid = user.user.uid;
                function createNewProfile(uid, userEmail) {
                    // A post entry.
                    var defaultPhoto = 'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg';
                    var userData = {
                        userID: uid,
                        profilePic: defaultPhoto,
                        firstName: userFirstName,
                        lastName: userLastName,
                        email: userEmail,
                        userSessions: [],
                        userPosts: [],
                        userMessages: []
                    };
                    // Write the new post's data simultaneously in the posts list and the user's post list.
                    var updates = {};
                    updates['/users/' + uid] = userData;
                    return firebase.database().ref().update(updates);
                }
                createNewProfile(uid, email);



            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.error(errorCode);
                console.error(errorMessage);
            });
        document.querySelector('#newUserEmail').value = '';
        document.querySelector('#newUserEmail').value = '';
        console.log('createUser end running');

    },
    deleteUser: function (user) {
        console.log('deleteUser start running');
        // document.querySelector('#form-modal-content').innerHTML = '';
        // document.querySelector('#form-modal-footer').innerHTML = '';
        // document.querySelector('#form-modal-content').innerHTML = `<div>Account Successfully Deleted</div>`;
        // document.querySelector('#form-modal-footer').innerHTML = `<a onClick='app.closeModal()'class='btn'>Ok</a>`;
        // app.openModal();

        user.delete().then(function () {
            // User deleted.
            document.querySelector('#form-modal-content').innerHTML = `<div>Account Successfully Deleted</div>`;
            document.querySelector('#form-modal-footer').innerHTML = `<a id='accountDeletedOK' class='btn'>Ok</a>`;

            document.querySelector('#accountDeletedOK').addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('#accountDeletedOK clicked');
                app.closeModal();
            });


            app.openModal();



        }).catch(function (error) {
            // An error happened.
        });


        console.log('deleteUser end running');

    },
    verifyEmail: function (user) {
        console.log('verifyEmail start running');
        user.sendEmailVerification().then(function () {
            // Email sent.
            document.querySelector('#form-modal-content').innerHTML = '';
            document.querySelector('#form-modal-footer').innerHTML = '';
            document.querySelector('#form-modal-content').innerHTML = `<div>
                                                                        <p>A verification email has been sent to your email addess</p>
                                                                        <p>Verify your email address to finish setting up your account</p>
                                                                        </div>`;
            app.openModal();

        }).catch(function (error) {
            // An error happened.
        });
        console.log('verifyEmail end running');
    },
    forgotPassword: function (email) {
        console.log('forgotPassword start running');
        var auth = firebase.auth();
        var emailAddress = email;

        auth.sendPasswordResetEmail(emailAddress).then(function () {
            // Email sent.
        }).catch(function (error) {
            // An error happened.
        });
        console.log('forgotPassword end running');
    },
    openModal: function () {
        console.log('openModal start running');
        var elem = document.querySelector('.modal');
        var instance = M.Modal.getInstance(elem);
        instance.open();
        console.log('openModal end running');
    },
    closeModal: function () {
        console.log('closeModal start running');
        var elem = document.querySelector('.modal');
        var instance = M.Modal.getInstance(elem);
        instance.close();
        console.log('closeModal end running');
    },
    logIn: function (email, password) {
        console.log('logIn start running');

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(function () {

            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
            });
        console.log('logIn end running');
    },
    logOut: function () {
        console.log('logOut start running');
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.

        });
        console.log('logOut end running');
    },
    getUserAuthState: function (loggedIn, loggedOut) {
        console.log('getUserAuthState start running');
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                loggedIn(user);
            } else {
                // No user is signed in.
                loggedOut();
            }
        });
        console.log('getUserAuthState end running');
    },
    init: function () {
        console.log('init start running');
        document.addEventListener('DOMContentLoaded', function () {
            console.log("setting up user interface...");
            app.baseUI();
            M.AutoInit();
        });
        console.log('init end running');
    }
}
app.init();
