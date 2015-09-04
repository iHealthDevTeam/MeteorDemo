/**
 * Created by shen on 15/9/1.
 */



Questions = new Mongo.Collection("questions");
Answers = new Mongo.Collection("answers");
Votes = new Mongo.Collection("votes");
Permissions = new Mongo.Collection("permissions");
Messages = new Mongo.Collection("messages");


Meteor.startup(function () {
    // code to run on server at startup


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
    },
    insertPermission: function (userId) {
        console.log("add permission");
        if (Permissions.findOne({userId: userId}) == null) {
            var permissionId = Permissions.insert({
                'userId': userId,
                'questionPer': true,
                'chatPer': true
            });
            return permissionId;
        }
    saveMessage: function (user,messageContent){
        console.log("user is: ",user," message is: ",messageContent);
        var messageId = Messages.insert({
            'user_id': user._id,
            'name': user.profile.name,
            'time': new Date(),
            'avatar_id': user.services.facebook.id,
            'messageContent': messageContent
        });
        return messageId;
    }
});