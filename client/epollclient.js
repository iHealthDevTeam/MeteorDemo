/**
 * Created by shen on 15/9/1.
 */



Questions = new Mongo.Collection("questions");
Answers = new Mongo.Collection("answers");
Votes = new Mongo.Collection("votes");
Permissions = new Mongo.Collection("permissions");
Messages = new Mongo.Collection("messages");

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

Router.map(function () {
    this.route('home', {
        path: '/',  //overrides the default '/home'
        template: "home"
    });
    this.route('admin', {

        path: '/admin',
        template: "adminBoard"
    });
});


Template.addQuestion.events({
    "click input.add-question": function (event) {

        event.preventDefault();
        if (Permissions.findOne({userId: Meteor.userId()}).questionPer === true) {
            var questionText = document.getElementById('questionText').value;

            if (questionText !== "") {
                Meteor.call("addQuestion", questionText, function (error, questionId) {

                    console.log("add question with id..." + questionId);
                });
                document.getElementById('questionText').value = "";
            }
            else
                return;
        }
        else
            return;
    }
});


Template.questions.helpers({
    items: function () {

        return Questions.find({}, {sort: {'num': -1, 'submittedOn': -1}});
    }
});


Template.question.helpers({

    answers: function () {
        return Answers.find({questionId: this._id}, {sort: {'num': -1, 'submittedOn': -1}});
    },
    author: function () {
        if (this.submittedUser === null) {
            return "<p style='display:inline;color:red;font-size:xx-small'>unknown</p>";
        }
        else if (this.submittedUser !== null) {
            return "<p style='display:inline;color:green;font-size:xx-small'>" + this.submittedUser + "</p>";
        }
    },
    isOwner: function () {
        if (this.submittedBy === Meteor.userId()) {
            return true;
        }
        else {
            return false;
        }
    }
});

Template.question.events({

    "click": function () {
        Session.set("selected_questionId", this._id);
    },
    "click a.delete": function (event) {
        event.preventDefault();
        if (Meteor.userId()) {
            var selected_questionId = Session.get("selected_questionId");

            BootstrapModalPrompt.prompt({
                title: "Confirm",
                content: "Do you really want to delete whatever?"
            }, function (result) {
                if (result) {
                    console.log("delete for questionid:" + selected_questionId);
                    Meteor.call("deleteQuestion", selected_questionId);
                }
            });
        }
    },
    "click input.add-answer": function (event) {
        event.preventDefault();
        var selected_questionId = Session.get("selected_questionId");
        var answerText = document.getElementById('answerText' + selected_questionId.toString()).value;
        if (answerText !== "") {
            VerifyLogin();
            Meteor.call("addAnswer", selected_questionId, answerText, function (error, answerId) {

                console.log("add answer with id:" + answerId);

            });
            document.getElementById('answerText' + selected_questionId.toString()).value = "";
        }
        else return;

    }
});

Template.answer.events({

    "click a.yes": function (event) {
        event.preventDefault();
        if (Meteor.userId()) {
            if (CanVote(this._id)) {
                console.log("updating yes count for answerid:" + this._id);
                Meteor.call("incrementYesVotes", this._id);
                Meteor.call("doVote", this._id);
            }
            else {
                alert("You have voted!");
            }
        }
        else {
            alert("Please sign in first");
        }


    },
    "click a.no": function (event) {
        event.preventDefault();
        if (Meteor.userId()) {

            if (CanVote(this._id)) {
                console.log("updating no count for answerid:" + this._id);
                Meteor.call("incrementNoVotes", this._id);
                Meteor.call("doVote", this._id);
            }
            else {
                alert("You have noted!");
            }
        }
        else {
            alert("Please sign in first");
        }


    }
});
Template.login.events({
    'click #facebook-login': function (event) {
        Meteor.loginWithFacebook({}, function (err) {

            if (err) {
                throw new Meteor.Error("facebook login failed");
            }
            else {
                Meteor.call("insertPermission", Meteor.userId());
                //alert(Meteor.userId());
            }
        });
    },

    'click #facebook-logout': function (event) {
        Meteor.logout(function (err) {
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        });
    }
});


Template.portrait.helpers({


    items: function () {
        /*       if (Meteor.user().services.facebook) {

         return "https://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture?type=small";
         }*/

        return Meteor.users.find({}, {fields: {"services.facebook.id": 1}});

    }
});


Template.admin.helpers({

    //you can change it
    isAdministrator: function () {

        return Meteor.userId() === "5WSfdjaT7ZjDwWLjj"
    }
});


Template.adminBoard.helpers({

    users: function () {

        return Meteor.users.find({}, {sort: {createAt: -1}});
    },
    settings: function () {
        return {
            rowsPerPage: 10,
            showFilter: false,
            fields: [
                {key: 'profile.name', label: "Name", headerClass: "col-md-2"},
                {
                    key: 'createdAt', label: "Create date", headerClass: "col-md-2",
                    fn: function (value) {
                        return moment(new Date(value)).format("MM/DD/YYYY");
                    }
                },
                {

                    key: '_id',
                    label: "Question", headerClass: "col-md-4",
                    fn: function (value, object) {

                        var quesPermission = Permissions.findOne({userId: value}).questionPer;

                        //  return permission.questionPer;
                        //return value;

                        //need to be improved, ternary operator?
                        if (quesPermission === true) {
                            return new Spacebars.SafeString('Post question:&nbsp;' +
                                '<input class="cbQuesPermis" type="checkbox" checked /> ');
                        }
                        else {
                            return new Spacebars.SafeString('Post question:&nbsp;' +
                                '<input class="cbQuesPermis" type="checkbox"  /> ');
                        }

                    }
                },
                {

                    key: '_id',
                    label: "Chat", headerClass: "col-md-4",
                    fn: function (value, object) {

                        var chatPermission = Permissions.findOne({userId: value}).chatPer;
                        //  return permission.questionPer;
                        //return value;

                        //need to be improved, ternary operator?
                        if (chatPermission === true) {
                            return new Spacebars.SafeString('Multi-Dialog:&nbsp;' +
                                '<input class="cbMulDialPermis" type="checkbox" checked /> ');
                        }
                        else {
                            return new Spacebars.SafeString('Multi-Dialog:&nbsp;' +
                                '<input class="cbMulDialPermis" type="checkbox"  /> ');
                        }

                    }
                }
            ]
        }
    }
});


Template.adminBoard.events({


    'click .reactive-table tbody tr': function (event) {

        event.preventDefault();


        var permissionId = Permissions.findOne({userId: this._id})._id;
        if (event.target.className == "cbQuesPermis") {

            Permissions.update(permissionId, {$set: {questionPer: event.target.checked}});
        }
        if (event.target.className == "cbMulDialPermis") {

            Permissions.update(permissionId, {$set: {chatPer: event.target.checked}});
        }

    }
});

Template.message.helpers({
    getMessage: function(){
        return Messages.find();
    },

    isCurrentUser: function(messageUserId){
        console.log(messageUserId," ",Meteor.userId);
        return messageUserId == Meteor.userId();
    }
});

Template.inputMessage.events({
    'keypress #inputBox': function (event){
        if (event.which == 13){
            if (Meteor.user()){
                var messageContent = document.getElementById("inputBox").value;
                document.getElementById("inputBox").value ="";
                Meteor.call('saveMessage',Meteor.user(),messageContent,function(error,result){
                 console.log("error: ",error," result: ",result);
                });
            }
        }
    }
});
// Template.loginFacebook.events({

//     "click #facebook-login": function (event) {
//         Meteor.loginWithFacebook({}, function (err) {
//             if (err) {
//                 throw new Meteor.Error("Facebook login failed");
//             }
//         });
//     },
//     "click #logout": function (event) {
//         Meteor.logout(function (err) {
//             if (err) {
//                 throw new Meteor.Error("Logout failed.");
//             }
//         });
//     }
// });
// Template.loginNormal.events({

//     "click #logout": function (event) {
//         Meteor.logout(function (err) {
//             if (err) {
//                 throw  new Meteor.Error("Logout failed.");
//             }
//         });
//     }
// });

/*Functions*/

function VerifyLogin() {

    if (!Meteor.userId()) {
        BootstrapModalPrompt.prompt({
            title: "Attention",
            content: "Please sign in first"
        }, null);
        return;
    }
};
function CanVote(answerId) {
    if (Votes.find({userId: Meteor.userId(), answerId: answerId}).count() > 0) {
        return false;
    }
    else {
        return true;
    }
};


