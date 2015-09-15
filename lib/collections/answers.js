/**
 * Created by shen on 15/9/15.
 */

Answers = new Mongo.Collection('answers');

Answers.allow({
    remove: function (userId, answer) {
         return ownsDocument(userId, answer);
    }
});

Meteor.methods({

    addAnswer: function (questionId, text) {

        console.log("add answer");
        var answerId = Answers.insert({
            'questionId': questionId,
            'answerText': text,
            'submittedOn': new Date(),
            'submittedBy': Meteor.userId(),
            'submittedUser': Meteor.user().profile.name,
            'num': 0
        });
        return answerId;
    }
});