var app = {
    baseUI: function () {
        //create navbar base UI content
        var navAbout = `<li id='navAbout'><a href='#'>About</a></li>`;
        var navContact = `<li id='navContact'><a href='#'>Contact</a></li>`;
        document.querySelector('#nav-items').innerHTML = navAbout + navContact;
        //create sidenav base UI content
        var sideAbout = `<li id='sideAbout'><a href='#'>About</a></li>`;
        var sideContact = `<li id='sideContact'><a href='#'>Contact</a></li>`;
        document.querySelector('#slide-out').innerHTML = sideAbout + sideContact;
        //check authorization status
        app.getUserAuthState(app.loggedInUI, app.loggedOutUI)
        //register click events
        document.querySelector('#toggler').addEventListener('click', function (e) {
            e.preventDefault();
            var elem = document.querySelector('.sidenav');
            var instance = M.Sidenav.getInstance(elem);
            instance.open();
        });
        document.querySelector('#side-toggler').addEventListener('click', function (e) {
            e.preventDefault();
            var elem = document.querySelector('.sidenav');
            console.log(elem);
            var instance = M.Sidenav.getInstance(elem);
            console.log(instance);
            instance.close();
        });
    },
    loggedInUI: function (user) {
        // User is signed in.
        console.log('user signed in');
        //remove signed out ui content
        var signedOutContent = document.querySelectorAll('.signIn');
        for (var i = 0; i < signedOutContent.length; i++) {
            signedOutContent[i].parentNode.removeChild(signedOutContent[i])
        }

        //user profile information

        var emailVerified = user.emailVerified;
        var uid = user.uid;
        var name;
        var email;
        var photoUrl = 'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg';
        console.log(user);

        console.log(uid);

        firebase.database().ref('users/' + uid).on('value', function (snapshot) {
            console.log(snapshot.val());
            var data = snapshot.val();
            name = data.firstName + ' ' + data.lastName;
            email = data.email;


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
            document.querySelector('#slide-out').innerHTML = user + sideNavMyAccount + sideNavItems + sideSignOut;
            //register click events
            var myAccount = document.querySelectorAll('.myAccount');
            for (var i = 0; i < myAccount.length; i++) {
                myAccount[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    app.accountPage(data)
                });
            }
            var signIn = document.querySelectorAll('.signOut');
            for (var i = 0; i < signIn.length; i++) {
                signIn[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    app.logOut();
                });
            }
        });
    },
    accountPage: function (data) {

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

        var addNewPass = `<a id='confirmPass' class='btn-floating edit'>
                         <i id='confirmPassIcon' class="small material-icons">add</i>
                      </a>`;

        var acctInfoFName = `<div class='row acctField'>
                                <div class='col s9'>${inputFName}</div>
                                <div class='col s2 valign-wrapper'>${editFName}</a></div>
                             </div>`;

        var acctInfoLName = `<div class='row acctField'>
                                <div class='col s9'>${inputLName}</div>
                                <div class='col s2 valign-wrapper'>${editLName}</a></div>
                             </div>`;

        var acctInfoEmail = `<div class='row acctField'>
                                <div class='col s9'>${inputEmail}</div>
                                <div class='col s2 valign-wrapper'>${editEmail}</div>
                             </div>`;

        var acctInfoPass= `<div class='row acctField'>
                             <div class='col s9'>${inputPass}</div>
                             <div class='col s2 valign-wrapper'>${editPass}</div>
                          </div>`;

        var acctConfirmPass = `<div id='addanewpassword' class='row acctField'>
                                <div class= 'col s12'>
                                <ul id='passCollapse' data='closed' class="collapsible z-depth-0">
                                <li>
                                  <div id='passCollapse-header' class=" blue-grey darken-1">
                                    <div class='row acctField'>
                                    <div class='col s9'>${inputPass}</div>
                                    <div class='col s2 valign-wrapper'>${editPass}</div>
                                    </div>
                                  </div>
                                  <div id='passCollapse-body' class="collapsible-body blue-grey darken-1">
                                  <div class='row acctField'>
                                  <div class='col s9'>${confirmPass}</div>
                                  <div class='col s2 valign-wrapper'>${addNewPass}</div>
                                  </div>
                                  </div>
                                </li>
                                
                                
                              </ul>
                                </div>
                               </div>`;

        var accountInfo = `<div class='card horizontal blue-grey darken-1'>
                            <div id='acctInfoCont' class='card-content white-text'>
                                <span class='card-title'>Card Title</span>
                                    ${acctInfoFName+acctInfoLName+acctInfoEmail+acctConfirmPass}
                                    
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
        document.querySelector('#main-content').innerHTML = accountPanel;
        //register click events
        //first name
        document.querySelector('#editFName').addEventListener('click', function (e) {
            e.preventDefault();
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
            }
        });
        //lastname
        document.querySelector('#editLName').addEventListener('click', function (e) {
            e.preventDefault();
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
            }
        });
        //email
        document.querySelector('#editEmail').addEventListener('click', function (e) {
            e.preventDefault();
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
            }
        });
        //password
        //document.addEventListener('DOMContentLoaded', function () {
            var elems = document.querySelectorAll('.collapsible');
            
            var instances = M.Collapsible.init(elems);
        //});

        document.querySelector('#editPass').addEventListener('click', function (e) {
            e.preventDefault();
            var state = document.querySelector('#passCollapse').getAttribute('data');
            var newPass = document.querySelector('#yourPass');
            var newPassConfirmed = document.querySelector('#confirmYourPass');
            var elem = document.querySelector('.collapsible');
            console.log(elem);
            var instance = M.Collapsible.getInstance(elem);
            console.log(instance);
            if(state === 'closed'){
                instance.open();
                newPass.removeAttribute('disabled');
                newPassConfirmed.removeAttribute('disabled');
                document.querySelector('#passCollapse').setAttribute('data', 'open');
                
            } else{
                instance.close();
                newPass.setAttribute('disabled', '');
                newPassConfirmed.setAttribute('disabled', '');
                document.querySelector('#passCollapse').setAttribute('data', 'closed');
            }
            
           
        });


    },
    loggedOutUI: function () {
        //No user is signed in.
        console.log('user not signed in');
        //remove signed in ui content
        var signedInContent = document.querySelectorAll(".myAccount, .signOut, #sideUser");
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
                e.preventDefault();
                var elem = document.querySelector('.sidenav');
                var instance = M.Sidenav.getInstance(elem);
                instance.close();
                app.signInForm();
            });
        }
    },
    signInForm: function () {
        //create sign in form content
        var title = `<h4>Sign In</h4>`;
        var email = `<input id='userEmail' type='email' placeholder='example@gmail.com'></input>`;
        var password = `<input id='userPassword' type='password' placeholder='password'></input>`;
        var signIn = `<button id='signInButton' class='btn-flat blue darken-4 white-text center-align'>Sign In</button>`;
        var signInForm = `<form id='signInForm'>${title + email + password + signIn}</form>`;
        //update modal content
        document.querySelector('#form-modal-content').innerHTML = signInForm;
        //update modal footer
        var register = `<div>Don't have an account? <a href='#' id='toRegister'>Register Here</a></div>`;
        document.querySelector('#form-modal-footer').innerHTML = register;
        //register click events
        document.querySelector('#signInButton').addEventListener('click', function (e) {
            e.preventDefault();
            var email = document.querySelector('#userEmail').value;
            var password = document.querySelector('#userPassword').value;
            app.logIn(email, password);
            var elem = document.querySelector('.modal');
            var instance = M.Modal.getInstance(elem);
            instance.close();
        });
        document.querySelector('#toRegister').addEventListener('click', function (e) {
            e.preventDefault();
            var elem = document.querySelector('.modal');
            var instance = M.Modal.getInstance(elem);
            instance.close();
            app.registrationForm();
        });
        //open modal
        var elem = document.querySelector('.modal');
        var instance = M.Modal.getInstance(elem);
        instance.open();

    },
    registrationForm: function () {
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
            app.createUser();
            var elem = document.querySelector('.modal');
            var instance = M.Modal.getInstance(elem);
            instance.close();

        });
        document.querySelector('#toSignIn').addEventListener('click', function (e) {
            e.preventDefault();
            var elem = document.querySelector('.modal');
            var instance = M.Modal.getInstance(elem);
            instance.close();
            app.signInForm();
        });
        //open modal
        var elem = document.querySelector('.modal');
        var instance = M.Modal.getInstance(elem);
        instance.open();

    },
    createUser: function () {
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
                    var userData = {
                        userID: uid,
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


    },
    logIn: function (email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });
    },
    logOut: function () {
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
        }).catch(function (error) {
            // An error happened.
        });
    },
    getUserAuthState: function (loggedIn, loggedOut) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                loggedIn(user);
            } else {
                // No user is signed in.
                loggedOut();
            }
        });
    },
    init: function () {
        document.addEventListener('DOMContentLoaded', function () {
            console.log("setting up user interface...");
            app.baseUI();
        });
    }
}
app.init();