/**
 * Created by shen on 15/9/15.
 */


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

                    Questions.remove(selected_questionId);
                  //  Answers.remove({'questionId': selected_questionId});
                    // Answers.remove('ECQb8G9NGcbNSg8GN');
                    // Meteor.call("deleteQuestion", selected_questionId);
                    Answers.find({'questionId': selected_questionId}).forEach(function (answer) {

                        Answers.remove(answer._id);
                    });
                    console.log("delete for questionid:" + selected_questionId);
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

function VerifyLogin() {

    if (!Meteor.userId()) {
        BootstrapModalPrompt.prompt({
            title: "Attention",
            content: "Please sign in first"
        }, null);
        return;
    }
};



