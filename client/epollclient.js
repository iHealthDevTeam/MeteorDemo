/**
 * Created by shen on 15/9/1.
 */
/**
 * Created by shen on 15/8/24.
 */


Questions = new Mongo.Collection("questions");
Answers = new Mongo.Collection("answers");
Votes = new Mongo.Collection("votes");

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});


Template.addQuestion.events({
    "click input.add-question": function (event) {

        event.preventDefault();
        var questionText = document.getElementById('questionText').value;

        if (questionText !== "") {
            Meteor.call("addQuestion", questionText, function (error, questionId) {

                console.log("add question with id..." + questionId);
            });
            document.getElementById('questionText').value = "";
        }
        else return;

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

                console.log("add answer with id..." + answerId);

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

/*Template.portraits.helpers({
 items: function () {
 var userId = Meteor.users.find({}, {fields: {"services.facebook.id": 1}});
 console.log(userId);

 }
 });*/

Template.portrait.helpers({


    items: function () {
        /*       if (Meteor.user().services.facebook) {

         return "https://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture?type=small";
         }*/

        return Meteor.users.find({}, {fields: {"services.facebook.id": 1}});

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


