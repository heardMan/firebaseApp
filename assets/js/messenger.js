var messenger = {
    UI: function (user) {



        var discover = `<div id="discover"></div>`;

        var conversations = `<div id="conversations"></div>`;

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
                                <div id='convoContainer' class="card-content black-text" currentconvo='blank'></div>
                                <div class="card-action">${messageInput}</div>
                             </div>`;

        var messages = `<div id="messages">
                                <div class='row'>
                                    <div class='col m4 hide-on-small-only'>${convoPanel}</div>
                                    <div class='col s12 m8'>${openConvo}</div>
                                </div>
                            </div>`;

        var messengerElem = `<div id='messenger' class='row'>
                                <div class='col s12'>
                                    <div class='card'>
                                        <div class='card-content'>
                                            <div class='row'>
                                                <div class='col s3 valign-wrapper'> 
                                                <i class="large material-icons">mail_outline</i>
                                                
                                                    

                                                 </div>
                                                 <div class="col s5 offset-s2">
                                                    <div class="input-field inline">
                                                        <i class="material-icons prefix">search</i>
                                                        <input placeholder="Search Users" id="findUser" type="text" class="validate">
                                                    </div>
                                                 </div>
                                                 <div class="col s2">
                                                 <a id="aCChatBtn" class="btn-floating btn-large waves-effect waves-light red"><i class="material-icons">chevron_right</i></a>
                                                 </div>
                                            </div>
                                        </div>
                                        
                                        <div id='messengerContent' class='card-content grey lighten-4'>
                                            ${discover +conversations +messages}
                                            
                                        </div>
    
                                        <div class='card-tabs'>
                                            <ul class='tabs tabs-fixed-width'>
                                                <li id='discoverTab' class='tab'><a id="discoverTabLink" href='#discover'>Discover</a></li>
                                                <li id='conversationsTab' class='tab'><a id="conversationsTabLink" href='#conversations'>Conversations</a></li>
                                                <li id='messagesTab'class='tab'><a id="messagesTabLink" href='#messages'>Messages</a></li>
                                            </ul>
                                        </div>
    
                                    </div>
                                </div>
                            </div>`;

        document.querySelector('#main-content').innerHTML = '';
        document.querySelector('#main-content').innerHTML = messengerElem;
        messenger.displayUsers(user);
        messenger.displayUserConvos(user);

        //autocomplete chat button
        var aCChatBtn = document.querySelector("#aCChatBtn");
        aCChatBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            var autoComplete = document.querySelector("#findUser");
            console.log(autoComplete.getAttribute("dataID"));
            var userID = autoComplete.getAttribute("dataID");
            var members = [userID, user.uid];
            console.log(members);
            messenger.getConvo(user, members, "direct");
            //messenger.displayCurrentConvo(user, convoID);
            //var convoRef = firebase.database().ref();

            var messageTab = document.querySelector("#messagesTabLink");
            var messageTabStatus = messageTab.getAttribute("class");

            console.log(messageTabStatus);

            if (messageTabStatus !== "active") {
                var el = document.querySelector('.tabs');
                var instance = M.Tabs.getInstance(el);
                instance.select('messages');
            }




        });

        //enter key sends message
        document.querySelector('#newMessage').onkeypress = function (e) {
            if (!e) e = window.event;
            var keyCode = e.keyCode || e.which;
            if (keyCode == '13') {
                // Enter pressed
                var dest = document.querySelector('#convoContainer');
                var currentConvo = dest.getAttribute('currentconvo');
                console.log(currentConvo);
                messenger.createNewMessage(user, currentConvo);
            }
        }

        //register click events
        document.querySelector('#sendMessage').addEventListener('click', function (e) {
            e.preventDefault();
            var dest = document.querySelector('#convoContainer');
            var currentConvo = dest.getAttribute('currentconvo');
            console.log(currentConvo);
            messenger.createNewMessage(user, currentConvo);
        });

        //initiate tabs
        var tabs = document.querySelectorAll('.tabs');
        for (var i = 0; i < tabs.length; i++) {
            M.Tabs.init(tabs[i]);
        }
        //initiate autocomplete
        app.findUserAutoComplete(user);

    },
    getConvo: function (user, members, messageType) {
        console.log(members);
        console.log(user.uid);
        if(members[0] === members[1]){
            console.log("rick n morty")
        }
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
                messenger.createConversation(user, members, messageType);
            } else {
                console.log('converstion Found!!!')
                document.querySelector('#convoContainer').setAttribute('currentConvo', matchFound);

                messenger.displayCurrentConvo(user, matchFound);

            }
        })

    },
    displayCurrentConvo: function (user, convoID) {
        console.log('display convo has run')
        var convoContainer = document.querySelector('#convoContainer');
        convoContainer.setAttribute('currentConvo', convoID);
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
           
            convoContainer.scrollTop = convoContainer.scrollHeight;
        });



    },
    conversationView: function(){

    },
    displayUsers: function (user) {

        var target = document.querySelector('#discover');
        firebase.database().ref('users/').on('child_added', function (snapshot) {
            var data = snapshot.val();
            var userID = data.userID;
            console.log(userID);
            if(userID === user.uid){

            } else {
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

            //chat button
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

                    messenger.getConvo(user, members, 'direct');


                    var el = document.querySelector('.tabs');
                    var instance = M.Tabs.getInstance(el);
                    instance.select('messages');

                });
            }
        }
        });

    },
    createConversation: function (user, members, messageType) {
        var userID = user.uid;
        console.log(user);
        if(members[0] === members[1]){
            console.log("rick n morty");
        }
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
        messenger.displayCurrentConvo(user, newKey);

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
            var newConvoPreview = `<div class='row convo-prev' id='${snap.key}'>
                                    <div id="convoImgCont-${snap.key}" class="col s4">
                                        <img id="convoImg-${convoID}" class="responsive-img">
                                    </div>
                                    <div id="convoInfo-${snap.key}" class="col s8"></div>
                                    </div>`;
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
                            var currentPreviewContainer = document.querySelector("#convoInfo-" + convoID);
                            var previewImg = document.querySelector('#convoImg-' + convoID);
                            previewImg.setAttribute('src', data.profilePic);
                            currentPreviewContainer.innerHTML = convoTitle;
                            console.log(currentPreviewContainer);
                            var keepContent = currentPreviewContainer.innerHTML;
                            var lastMessageRef = firebase.database().ref().child('convo-messages').child(convoID);
                            lastMessageRef.limitToLast(1).on('child_added', function (snap) {
                                var key = snap.key;
                                var data = snap.val();

                                console.log(data);
                                console.log(data.message);

                                var lastMessage = `<div id="lastMessage">${data.message}</div>`

                                currentPreviewContainer.innerHTML = keepContent + lastMessage
                            });

                        });
                    } else {
                        console.log('not match');
                        console.log('match');

                        var getTitleRef = firebase.database().ref().child('users').child(keys[0]);
                        getTitleRef.on('value', function (snap) {
                            var data = snap.val();
                            var convoTitle = `<div>${data.firstName} ${data.lastName}</div>`;
                            var currentPreviewContainer = document.querySelector("#convoInfo-" + convoID);
                            var previewImg = document.querySelector('#convoImg-' + convoID);
                            previewImg.setAttribute('src', data.profilePic);
                            currentPreviewContainer.innerHTML = convoTitle;
                            console.log(convoID);
                            var keepContent = currentPreviewContainer.innerHTML;

                            var lastMessageRef = firebase.database().ref().child('convo-messages').child(convoID).limitToLast(1);
                            lastMessageRef.on('child_added', function (snap) {
                                var data = snap.val();
                                console.log(data);
                                console.log(data.message);
                                var lastMessage = `<div>${data.message}</div>`

                                currentPreviewContainer.innerHTML = keepContent + lastMessage
                            })

                        });
                    }
                    document.querySelector(`#${convoID}`).addEventListener('click', function (e) {
                        e.preventDefault();
                        messenger.displayCurrentConvo(user, convoID);

                    });

                });
            } else {
                console.log('group messaging not yet supported')
            }

        })

    },
    createNewMessage: function (user, currentConvo) {
        console.log(user);
        if (currentConvo !== "blank") {
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
        }
    },
    init: function (user) {
        messenger.UI(user);
        console.log(`Messenger Loaded`);

    }
}