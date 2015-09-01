/**
 * Created by shen on 15/9/1.
 */

/**
 * Created by shen on 15/8/24.
 */

Questions = new Mongo.Collection("questions");
Answers = new Mongo.Collection("answers");
Votes = new Mongo.Collection("votes");


Meteor.startup(function () {
    // code to run on server at startup


});


Meteor.methods({

    addQuestion: function (text) {
        console.log("add question");
        var questionId = Questions.insert({
            'questionText': text,
            'submittedOn': new Date(),
            //'submittedBy': Meteor.user().profile.name + "_" + Meteor.userId()
            'submittedBy': Meteor.userId(),
            //'submittedUser': Meteor.user().services.facebook.name
            'submittedUser':Meteor.user().username

        });
        return questionId;
    },
    incrementYesVotes: function (answerId) {

        console.log("incrementYes:" + answerId);
        Answers.update(answerId, {$inc: {num: 1}});

    },
    incrementNoVotes: function (answerId) {


        console.log("incementNo:" + answerId);
        Answers.update(answerId, {$inc: {num: -1}});

    },
    doVote: function (answerId) {
        console.log("doVote:" + answerId);

        if (Votes.find({userId: Meteor.userId(), answerId: answerId}).count() === 0) {
            Votes.insert({userId: Meteor.userId(), answerId: answerId});
        }
    },
    deleteQuestion: function (questionId) {
        console.log("deleteQuestion:" + questionId);
        Answers.remove({'questionId': questionId});
        Questions.remove({'_id': questionId});
    },
    addAnswer: function (questionId, text) {

        console.log("add answer");
        var answerId = Answers.insert({
            'questionId': questionId,
            'answerText': text,
            'submittedOn': new Date(),
            'submittedBy': Meteor.userId(),
            'submittedUser': Meteor.user().username,
            'num': 0
        });
        return answerId;
    }
});