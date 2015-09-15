/**
 * Created by shen on 15/9/15.
 */

Messages = new Mongo.Collection('messages');


Meteor.methods({

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