var messenger = {
    UI: function(user){
        

            var somePhoto = 'https://articles-images.sftcdn.net/wp-content/uploads/sites/3/2016/01/wallpaper-for-facebook-profile-photo.jpg';
    
            var contacts = `<div id="contacts">
                                
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
                                <div id='convoContainer' class="card-content black-text" currentconvo='blank'></div>
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
                                            <div class='row'>
                                                <div class='col s12 valign-wrapper'> 
                                                <i class="large material-icons">mail_outline</i>
                                                
                                                    <div class="input-field inline">
                                                        <i class="material-icons prefix">search</i>
                                                        <input placeholder="Search User" id="findUser" type="text" class="validate">
                                                    </div>
                                                 </div>
                                            </div>
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
            // app.displayUsers(user);
            // app.displayUserConvos(user);
            
            //enter key sends message
            // document.querySelector('#newMessage').onkeypress = function (e) {
            //     if (!e) e = window.event;
            //     var keyCode = e.keyCode || e.which;
            //     if (keyCode == '13') {
            //         // Enter pressed
            //         var dest = document.querySelector('#convoContainer');
            //         var currentConvo = dest.getAttribute('currentconvo');
            //         console.log(currentConvo);
            //         app.createNewMessage(user, currentConvo);
            //     }
            // }
    
            //register click events
            // document.querySelector('#sendMessage').addEventListener('click', function (e) {
            //     e.preventDefault();
            //     var dest = document.querySelector('#convoContainer');
            //     var currentConvo = dest.getAttribute('currentconvo');
            //     console.log(currentConvo);
            //     app.createNewMessage(user, currentConvo);
            // });
    
    
    
            //initiate tabs
            var tabs = document.querySelectorAll('.tabs');
            for (var i = 0; i < tabs.length; i++) {
                M.Tabs.init(tabs[i]);
            }
            //initiate autocomplete
    
            app.findUserAutoComplete();
    
    
    
    
        
    },
    init: function(user){
            messenger.UI(user);
            console.log(`Messenger Loaded`);
        
    }
}