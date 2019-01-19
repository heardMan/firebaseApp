var accountSettings = {
    UI: function (data) {

        console.log('accountPage start running');
        var profilePic;
        var user = firebase.auth().currentUser;
        console.log(user.photoURL);
        if (user.photoURL === null) {

            profilePic = 'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg';
        } else {
            profilePic = user.photoURL;
        }

        var inputFName = `<div id='inputFName' class='input-field col s6'>
                                
                                <input disabled id='yourFirstName' type='text' class='validate' placeholder='${data.firstName}'>
                                <label for='firstName'></label>
                              </div>
                              
                              `;

        var inputLName = `<div id='inputLName' class='input-field col s6'>
                                
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
                                    <div id="nameIcon" class='col s1 center'><i  class='small material-icons'>account_circle</i></div>
                                    <div class='col s10'>
                                        <div class="row"> 
                                            ${inputFName+inputLName}
                                        </div>
                                    </div>
                                    
                                    <div class='col s1 center'>${editLName}</div>
                                 </div>`;

        var acctInfoEmail = `<div class='row acctField'>
                                    <div class='col s10'>${inputEmail}</div>
                                    <div class='col s1 center'>${editEmail}</div>
                                 </div>`;

        var acctConfirmPass = `<div id='addanewpassword' class='row acctField'>
                                    <div id='addanewpasswordCol' class= 'col s12'>
                                        <ul id='passCollapse' data='closed' class="collapsible z-depth-0">
                                            <li>
                                                <div id='passCollapse-header' class="blue-grey darken-1">
                                                    <div id="passInput1" class='row acctField'>
                                                        <div id="passInput1Col1" class='col s10'>${inputPass}</div>
                                                        <div class='col s1 center'>${editPass}</div>
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
                                        ${acctInfoFName + acctInfoEmail + acctConfirmPass + deleteAccount}    
                                </div>`;

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
        
        //name
        document.querySelector('#editLName').addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('#editLName clicked');
            var status = document.querySelector('#editLName').getAttribute('data');
            var icon = document.querySelector('#editLNameIcon');
            var inputFirstName = document.querySelector('#yourFirstName');
            var inputLastName = document.querySelector('#yourLastName');
            if (status === 'edit') {
                icon.innerHTML = 'add';
                document.querySelector('#editLName').setAttribute('data', 'add');
                inputFirstName.removeAttribute('disabled');
                inputLastName.removeAttribute('disabled');

            } else {
                icon.innerHTML = 'edit';
                document.querySelector('#editLName').setAttribute('data', 'edit');
                inputFirstName.setAttribute('disabled', '');
                inputLastName.setAttribute('disabled', '');

                if (inputFirstName.value) {
                    console.log(inputFirstName.value);
                    icon.innerHTML = 'edit';
                    document.querySelector('#editLName').setAttribute('data', 'edit');
                    inputFirstName.setAttribute('disabled', '');

                    var newFName = document.querySelector('#yourFirstName').value;
                    var userId = data.userID;
                    data.firstName = newFName;
                    firebase.database().ref('users/' + userId).update({
                        'firstName': newFName
                    });
                    
                    document.querySelector('#yourFirstName').value = '';
                    document.querySelector('#yourFirstName').setAttribute('placeholder', data.firstName);
                    setTimeout(function () {
                        document.querySelector('#yourFirstName').classList.remove('valid');
                    }, 1000 * 5);

                }

                if (inputLastName.value) {
                    console.log(inputLastName.value);
                    var newLName = document.querySelector('#yourLastName').value;
                    var userId = data.userID;
                    data.lastName = newLName;
                    firebase.database().ref('users/' + userId).update({
                        'lastName': newLName
                    });

                    document.querySelector('#yourLastName').value = '';
                    document.querySelector('#yourLastName').setAttribute('placeholder', data.lastName);

                    setTimeout(function () {
                        document.querySelector('#yourLastName').classList.remove('valid');
                    }, 1000 * 5);
                }

                user.updateProfile({
                    displayName: data.firstName + ' ' + data.lastName,
                }).then(function () {
                    // Update successful.
                }).catch(function (error) {
                    // An error happened.
                });

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
    init: function (data) {
        accountSettings.UI(data);
        console.log(`Account Settings Module Loaded`);
    }
}