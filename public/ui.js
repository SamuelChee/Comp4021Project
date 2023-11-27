const Console = (function(){
    // Init
    const initialize = function(){
        $("#console").text("Welcome to Metal Mayhem!");
    }

    const update = function(text){
        $("#console").text(text);
    }

    return {initialize, update};
})();

const SignInForm = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Populate the avatar selection
        Avatar.populate($("#register-avatar"));
        
        // Hide it
        $("#signin-overlay").hide();

        // Submit event for the signin form
        $("#signin-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#signin-username").val().trim();
            const password = $("#signin-password").val().trim();

            // Send a signin request
            Authentication.signin(username, password,
                () => {
                    hide();
                    UserPanel.update(Authentication.getUser());
                    UserPanel.show();

                    Socket.connect();
                },
                (error) => { $("#signin-message").text(error); }
            );
        });

        // Submit event for the register form
        $("#register-form").on("submit", (e) => {
            // Do not submit the form
            e.preventDefault();

            // Get the input fields
            const username = $("#register-username").val().trim();
            const avatar   = $("#register-avatar").val();
            const name     = $("#register-name").val().trim();
            const password = $("#register-password").val().trim();
            const confirmPassword = $("#register-confirm").val().trim();

            // Password and confirmation does not match
            if (password != confirmPassword) {
                $("#register-message").text("Passwords do not match.");
                return;
            }

            // Send a register request
            Registration.register(username, avatar, name, password,
                () => {
                    $("#register-form").get(0).reset();
                    $("#register-message").text("You can sign in now.");
                },
                (error) => { $("#register-message").text(error); }
            );
        });
    };

    // This function shows the form
    const show = function() {
        $("#signin-overlay").fadeIn(500);
    };

    // This function hides the form
    const hide = function() {
        $("#signin-form").get(0).reset();
        $("#signin-message").text("");
        $("#register-message").text("");
        $("#signin-overlay").fadeOut(500);
    };

    return { initialize, show, hide };
})();

const UserPanel = (function() {
    // This function initializes the UI
    const initialize = function() {
        // Hide it
        $("#user-panel").hide();

        // Click event for the signout button
        $("#signout-button").on("click", () => {
            // Send a signout request
            Authentication.signout(
                () => {
                    Socket.disconnect();

                    hide();
                    SignInForm.show();
                }
            );
        });
    };

    // This function shows the form with the user
    const show = function(user) {
        $("#user-panel").show();
    };

    // This function hides the form
    const hide = function() {
        $("#user-panel").hide();
    };

    // This function updates the user panel
    const update = function(user) {
        if (user) {
            $("#user-panel .user-avatar").html(Avatar.getCode(user.avatar));
            $("#user-panel .user-name").text(user.name);
        }
        else {
            $("#user-panel .user-avatar").html("");
            $("#user-panel .user-name").text("");
        }
    };

    return { initialize, show, hide, update };
})();

const Lobby = (function(){

    // For queue button
    let join = true;
    let waitingOnServer = false;
    
    // Init
    const initialize = function(){
        // submit event for queue event
        $("#queue-button").click(() => {
            console.log("pressed");

            if(!waitingOnServer){
                if(join){
                    Socket.joinQueue();
                }
                else{
                    Socket.leaveQueue();
                }
                $("#queue-button").css('color', "red");
            }
        });

        // show profile
        $("#profile-button").click(() => {
            Lobby.hide();
            Profile.show();
        });
    }

    const update = function(joinOrLeave){
        waitingOnServer = false;
        $("#queue-button").css('color', "white");

        if(joinOrLeave){
            $("#queue-button").text("Join Queue");
        }
        else{
            $("#queue-button").text("Leave Queue");
        }
        join = joinOrLeave;
    }

    const show = function(){
        $("#lobby").show()
    };

    const hide = function(){
        $("#lobby").hide();
    };

    return {initialize, show, hide, update};


})();

const Profile = (function(){

    let updated = false;

    const initialize = function(){
        $("#profile").hide();

        $("#profile-back-button").click(() => {
            Profile.hide();
            Lobby.show();
        });

    };
    const show = function(){
        if(!updated){
            let profile = Authentication.getUser().profile;
            let keys = Object.keys(profile);

            for(let i = 0; i < keys.length; i++){
                let key = keys[i];
                let newElementId = "profile " + key;

                $("#append").append('<p id="' + newElementId + '">' +
                key + ': ' + profile[key] + '</p>');

                head = $("#" + newElementId);
            }

            updated = true;
        }
        $("#profile").show();
    };

    const hide = function(){
        $("#profile").hide();
    };

    return {initialize, show, hide};
})();


const UI = (function() {
    // This function gets the user display
    const getUserDisplay = function(user) {
        return $("<div class='field-content row shadow'></div>")
            .append($("<span class='user-avatar'>" +
			        Avatar.getCode(user.avatar) + "</span>"))
            .append($("<span class='user-name'>" + user.name + "</span>"));
    };

    // The components of the UI are put here
    const components = [SignInForm, UserPanel, Lobby, Profile];

    // This function initializes the UI
    const initialize = function() {
        // Might hide all the components, but not the Console.
        Console.initialize();
        // Initialize the components
        for (const component of components) {
            component.initialize();
        }
    };

    const hide = function(){
        for(const component of components){
            component.hide();
        }
    }

    return { getUserDisplay, initialize };
})();


// ScoreBoard Here
// For displaying ScoreBoard
// FetchScoreBoardData() will call this funciton
/*const populateScoreboard =function(data){
    const scoreboard = document.getElementById('scoreboard');
  
  const tbody = scoreboard.querySelector('tbody');
  tbody.innerHTML = '';

  // Sorting according the #of kills, HP remaining and survival time
  data.sort((a, b) => {
    if (a.statistics.kills !== b.statistics.kills) {
      return b.statistics.kills - a.statistics.kills; // Sort by kills in descending order
    } else if (a.statistics.hpRemaining !== b.statistics.hpRemaining) {
      return b.statistics.hpRemaining - a.statistics.hpRemaining; // Sort by HP remaining in descending order
    } else {
      return a.statistics.survivalTime - b.statistics.survivalTime; // Sort by survive time in ascending order
    }
  });

  // Input the row according to the rank and number of players
  data.forEach((player, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.name}</td>
      <td>${player.statistics.kills}</td>
      <td>${player.statistics.hpRemaining}</td>
      <td>${player.statistics.survivalTime}</td>
      <td>${player.statistics.shotsFired}</td>
      <td>${player.statistics.numberOfItemsPickedUp}</td>
    `;
    tbody.appendChild(row);
  });
}

const FetchScoreBoardData =(function(){
    // The scoreboard from server, Please replace it here
  fetch('/scoreboard')
  .then(response => response.json())
  .then(data => {
    // The function written at the bottom for populating the scoreboard
    populateScoreboard(data);
  })
  .catch(error => {
    console.log('Error:', error); 
  });
})();*/