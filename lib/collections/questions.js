/**
 * Created by shen on 15/9/15.
 */

Questions = new Mongo.Collection('questions');

Questions.allow({
    remove: function (userId, question) {
        return ownsDocument(userId, question);
    }
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
            'submittedUser': Meteor.user().profile.name

        });
        return questionId;
    },
    deleteQuestion: function (questionId) {
        console.log("deleteQuestion:" + questionId);
        Answers.remove({'questionId': questionId});
        Questions.remove({'_id': questionId});
    }
});