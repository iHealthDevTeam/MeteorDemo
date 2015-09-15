/**
 * Created by shen on 15/9/15.
 */

Votes = new Mongo.Collection('votes');

Meteor.methods({

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
    }
});