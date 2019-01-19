var app = {
    defaultPhoto: 'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg',
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

        // if (emailVerified === false) {
        //     console.log('user Not Verified');
        //     app.verifyEmail(user);
        //     app.logOut();
        // } else {
        console.log('user Verified');
        firebase.database().ref('users/' + uid).update({
            'online': 'true'
        });
        firebase.database().ref('users/' + uid).on('value', function (snapshot) {
            //console.log(snapshot.val());
            var data = snapshot.val();
            name = data.firstName + ' ' + data.lastName;
            email = data.email;
            //remove signed out ui content
            var signedOutContent = document.querySelectorAll('.signIn, .myMessages, #sideNavMyAccount, #navSignOut, #sideSignOut, #sideUser');
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
            var sideUser = `<li id='sideUser'>${userView}</li>`;
            var sideNavMyAccount = `<li id='sideNavMyAccount'><a href='#' class='myAccount'>My Account</a></li>`;
            var messages = `<li id='userMessages'><a href='#' class='myMessages'>Messenger</a></li>`;
            document.querySelector('#slide-out').innerHTML = sideUser + sideNavMyAccount + messages + sideNavItems + sideSignOut;
            //register click events
            var myAccount = document.querySelectorAll('.myAccount');
            for (var i = 0; i < myAccount.length; i++) {
                myAccount[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('.myAccount clicked');
                    //app.accountPage(data);
                    accountSettings.init(data);
                });
            }
            var signIn = document.querySelectorAll('.signOut');
            for (var i = 0; i < signIn.length; i++) {
                signIn[i].addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('.signOut clicked');

                    app.logOut(user);
                });
            }
            var userMessages = document.querySelector('#userMessages');
            userMessages.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                messenger.init();
                //app.messenger(user);
            });
        });
        //}

        console.log('loggedInUI end running');
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
    findUserAutoComplete: function () {
        var userAutoComplete = [];
        var usersRef = firebase.database().ref().child('users');
        usersRef.on('value', function (snap) {
            var response = snap.val();
            var keys = Object.keys(response);
            console.log(keys);
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                var currrentKey = response[keys[i]];
                var currentName = `${currrentKey.firstName} ${currrentKey.lastName}`;
                var currentEmail = currrentKey.email;
                console.log(currentName);
                var data = {
                    'userID': key,
                    'name': currentName,
                    'email': currentEmail
                }
                userAutoComplete.push(data);
            }
            var findUser = document.querySelector("#findUser");
            app.userautocomplete(findUser, userAutoComplete);
            console.log(userAutoComplete);
        });
    },

    userautocomplete: function (inp, arr) {
        /*the autocomplete function takes two arguments,
        the text field element and an array of possible autocompleted values:*/
        var currentFocus;
        /*execute a function when someone writes in the text field:*/
        inp.addEventListener("input", function (e) {
            var a, b, c, d, i, val = this.value;
            /*close any already open lists of autocompleted values*/
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            /*create a DIV element that will contain the items (values):*/
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            /*append the DIV element as a child of the autocomplete container:*/
            this.parentNode.appendChild(a);
            /*for each item in the array...*/
            for (i = 0; i < arr.length; i++) {
                /*check if the item starts with the same letters as the text field value:*/
                if (arr[i].name.substr(0, val.length).toUpperCase() == val.toUpperCase() || arr[i].email.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    /*create a DIV element for each matching element:*/
                    b = document.createElement("DIV");
                    b.setAttribute("class", "autocomplete-item");
                    c = document.createElement("DIV");
                    c.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                    c.innerHTML += arr[i].name.substr(val.length);
                    c.setAttribute("class", "autocomplete-item-name");
                    /*insert a input field that will hold the current array item's value:*/
                    c.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                    
                    
                    b.appendChild(c);

                    d = document.createElement("DIV");
                    d.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                    d.innerHTML += arr[i].email.substr(val.length);
                    d.setAttribute("class", "autocomplete-item-email");
                    /*insert a input field that will hold the current array item's value:*/
                    d.innerHTML += "<input type='hidden' value='" + arr[i].email + "'>";
                    b.appendChild(d);


                    /*make the matching letters bold:*/
                    //b.innerHTML = "<strong>" + arr[i].name.substr(0, val.length) + "</strong>";
                    //b.innerHTML += arr[i].name.substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    //b.innerHTML += "<input type='hidden' value='" + arr[i].name + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/

                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });

        /*execute a function presses a key on the keyboard:*/
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");

            if (x) x = x.getElementsByClassName("autocomplete-item");
            if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
            } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                    /*and simulate a click on the "active" item:*/
                    if (x) x[currentFocus].click();
                }
            }
        });
        function addActive(x) {
            /*a function to classify an item as "active":*/
            if (!x) return false;
            /*start by removing the "active" class on all items:*/
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            /*add class "autocomplete-active":*/
            x[currentFocus].classList.add("autocomplete-item-active");
        }
        function removeActive(x) {
            /*a function to remove the "active" class from all autocomplete items:*/
            for (var i = 0; i < x.length; i++) {
                x[i].classList.remove("autocomplete-item-active");
            }
        }
        function closeAllLists(elmnt) {
            /*close all autocomplete lists in the document,
            except the one passed as an argument:*/
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        /*execute a function when someone clicks in the document:*/
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    },

    displayUsers: function (user) {
        var target = document.querySelector('#contacts');
        firebase.database().ref('users/').on('child_added', function (snapshot) {
            var data = snapshot.val();

            var priorContent = target.innerHTML;
            var img = data.profilePic;
            var nameData = data.firstName + ' ' + data.lastName;
            var name = `<div>${nameData}</div>`;
            console.log(data);
            if (data.online === 'true') {
                var onlineStatus = `<div class='green-text'>Online</div>`;
                var chatButton = `<div><a id='chat${data.userID}' userID='${data.userID}' class="chatButton btn-floating btn-large waves-effect waves-light green"><i class="material-icons">message</i></a></div>`;
            } else {
                var onlineStatus = `<div class='red-text'>Offline</div>`;
                var chatButton = `<div><a id='chat${data.userID}' userID='${data.userID}' class="chatButton btn-floating btn-large waves-effect waves-light red"><i class="material-icons">message</i></a></div>`;
            }

            //var signedIn = `<div class='red-text'>Offline</div>`;
            var newContent = `<div id='' class='row'>
                                <div class='col s4'>
                                    <img class='circle responsive-img' src='${img}'>
                                </div>
                                <div class='col s8'>
                                    ${name + onlineStatus + chatButton}
                                    
                                </div>
                              </div>`;
            target.innerHTML = priorContent + newContent;

            var startChat = document.querySelectorAll('.chatButton');
            console.log(startChat.length);
            for (var i = 0; i < startChat.length; i++) {
                var currentChatButton = startChat[i];
                console.log(currentChatButton);
                currentChatButton.addEventListener('click', function (e) {
                    e.stopPropagation();
                    e.preventDefault();
                    var members = [];
                    members.push(this.getAttribute('userID'));
                    members.push(user.uid);
                    console.log(members);
                    console.log('.startChat clicked');
                    console.log(members);

                    app.getConvo(user, members, 'direct');


                    var el = document.querySelector('.tabs');
                    var instance = M.Tabs.getInstance(el);
                    instance.select('messages');

                });
            }

        });

    },
    getConvo: function (user, members, messageType) {
        console.log(members);
        console.log(user.uid);
        var returnedData;
        var cMRef = firebase.database().ref("convo-members").orderByChild(user.uid).equalTo(messageType);
        cMRef.once('value', function (snapshot) {
            var data = snapshot.val();
            returnedData = data;
            if (returnedData === null) {
                returnedData = 'no convo yet';
            }
        }).then(function () {
            function aMatch() {
                var keys = Object.keys(returnedData);
                for (var i = 0; i < keys.length; i++) {
                    var match = 0;
                    var currentKey = keys[i];
                    var convo = returnedData[currentKey];
                    var convoMembers = Object.keys(convo);
                    for (var j = 0; j < convoMembers.length; j++) {
                        var currentConvoAndMember = convoMembers[j];
                        for (var k = 0; k < members.length; k++) {
                            var exists = (currentConvoAndMember === members[k]) ? true : false;
                            if (exists === true) {
                                match++;
                            }
                            if (match == members.length) {
                                return currentKey;
                            }
                        }
                    }
                }
            }
            var matchFound = aMatch();
            console.log(matchFound);
            if (!matchFound) {
                console.log('no conversations found... better Make a new one!!!');
                app.createConversation(user, members, messageType);
            } else {
                console.log('converstion Found!!!')
                document.querySelector('#convoContainer').setAttribute('currentConvo', matchFound);

                app.displayCurrentConvo(user, matchFound);

            }
        })

    },
    createConversation: function (user, members, messageType) {
        var userID = user.uid;
        console.log(user);
        // Get a key for a new Post.

        var root = firebase.database().ref();
        var newKey = root.push().key;
        var convoRef = root.child('convos');
        var convoMembersRef = root.child('convo-members');
        var userConvos = root.child('convos-' + userID);

        // A convo entry.
        userConvos.child(newKey).set({ type: messageType, });
        var convoTitle = userID;

        for (var i = 0; i < members.length; i++) {
            convoTitle += ' ' + members[i];
        }

        convoRef.child(newKey).set({
            title: convoTitle,
            type: messageType
        });
        var timeStamp = firebase.database.ServerValue.TIMESTAMP;
        for (var i = 0; i < members.length; i++) {
            var contactsConvos = root.child('convos-' + members[i]);
            contactsConvos.child(newKey).set({ type: messageType, timestamp: timeStamp });
        }

        var convoMembers = {};
        //swith to only using members and delete this line
        convoMembers[userID] = messageType;


        for (var i = 0; i < members.length; i++) {
            convoMembers[members[i]] = messageType;
        }

        convoMembersRef.child(newKey).set(convoMembers);
        document.querySelector('#convoContainer').setAttribute('currentConvo', newKey);
        //display 
        //app.displayUserConvos(user)
        app.displayCurrentConvo(user, newKey);

    },
    displayCurrentConvo: function (user, convoID) {
        console.log('display convo has run')
        var convoContainer = document.querySelector('#convoContainer');
        convoContainer.innerHTML = '';
        var convoRef = firebase.database().ref().child('convo-messages').child(convoID);
        convoRef.orderByChild('timestamp').limitToLast(20).on('child_added', function (snapshot) {
            var data = snapshot.val();
            var message = data.message;
            var senderID = data.sender;
            var userID = user.uid;
            var sntORrcvd = senderID === userID ? 'sentMessage' : 'receivedMessage';
            var timestamp = data.timestamp;
            var prevMessages = convoContainer.innerHTML;
            var nextMessage = `<div class='row'>
                                <div class='col s-12 ${sntORrcvd}'>${message}</div> 
                               </div>`;

            convoContainer.innerHTML = prevMessages + nextMessage;
        });



    },
    displayUserConvos: function (user) {
        console.log('display user convos running');
        console.log(user.uid);
        var userConvos = firebase.database().ref().child('convos-' + user.uid);
        userConvos.on('child_added', function (snap) {
            var data = snap.val();
            console.log(data);
            var convoID = snap.key;
            var convoPanel = document.querySelector('#convoPanel');
            var keepContent = convoPanel.innerHTML;
            var newConvoPreview = `<div class='row' id='${snap.key}'></div>`;
            convoPanel.innerHTML = newConvoPreview + keepContent;

            console.log(data.type);
            if (data.type === 'direct') {
                var convoTitleRef = firebase.database().ref().child('convo-members').child(snap.key);
                convoTitleRef.on('value', function (snap) {
                    var data = snap.val();
                    console.log(data);
                    var keys = Object.keys(data);
                    if (keys[0] === user.uid) {
                        console.log('match');
                        var getTitleRef = firebase.database().ref().child('users').child(keys[1]);
                        getTitleRef.on('value', function (snap) {
                            var data = snap.val();
                            var convoTitle = `<div>${data.firstName} ${data.lastName}</div>`;
                            var currentPreviewContainer = document.querySelector('#' + convoID);
                            currentPreviewContainer.innerHTML = convoTitle;
                            console.log(convoID);

                            var lastMessageRef = firebase.database().ref().child('convo-messages').child(convoID);
                            lastMessageRef.on('child_added', function (snap) {
                                var key = snap.key;
                                var data = snap.val();


                                console.log(data);
                                console.log(data.message);


                                var lastMessage = `<div>${data.message}</div>`

                                var keepContent = currentPreviewContainer.innerHTML;
                                currentPreviewContainer.innerHTML = keepContent + lastMessage
                            })

                        });
                    } else {
                        console.log('not match');
                        console.log('match');
                        var getTitleRef = firebase.database().ref().child('users').child(keys[0]);
                        getTitleRef.on('value', function (snap) {
                            var data = snap.val();
                            var convoTitle = `<div>${data.firstName} ${data.lastName}</div>`;
                            var currentPreviewContainer = document.querySelector('#' + convoID);
                            currentPreviewContainer.innerHTML = convoTitle;
                            console.log(convoID);

                            var lastMessageRef = firebase.database().ref().child('convo-messages').child(convoID).limitToLast(1);
                            lastMessageRef.on('child_added', function (snap) {
                                var data = snap.val();
                                console.log(data);
                                console.log(data.message);
                                var lastMessage = `<div>${data.message}</div>`
                                var keepContent = currentPreviewContainer.innerHTML;
                                currentPreviewContainer.innerHTML = keepContent + lastMessage
                            })

                        });
                    }
                    document.querySelector(`#${convoID}`).addEventListener('click', function (e) {
                        e.preventDefault();
                        app.displayCurrentConvo(user, convoID);

                    });

                });
            } else {
                console.log('group messaging not yet supported')
            }

        })

    },
    createNewMessage: function (user, currentConvo) {
        console.log(user);
        var newMessage = document.querySelector('#newMessage').value;
        var newKey = firebase.database().ref().push().key;
        var convosRef = firebase.database().ref().child('convos');
        var currentTimestamp = firebase.database.ServerValue.TIMESTAMP;
        var currentConvoRef = convosRef.child(currentConvo);
        currentConvoRef.child('lastUpdated').set(currentTimestamp);
        var convosMessagesRef = firebase.database().ref().child('convo-messages').child(currentConvo);
        convosMessagesRef.child(newKey).set({
            message: newMessage,
            sender: user.uid,
            timestamp: currentTimestamp,
        });
        var userConvosRef = firebase.database().ref().child('convos-' + user.uid).child(currentConvo).child('timestamp');
        userConvosRef.set(currentTimestamp);

        // app.displayCurrentConvo(user, currentConvo);
        document.querySelector('#newMessage').value = '';
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
    logOut: function (user) {
        var userId = user.uid;
        console.log('logOut start running');
        firebase.auth().signOut().then(function () {
            // Sign-out successful.
            firebase.database().ref('users/' + userId).update({
                'online': 'false'
            });
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
