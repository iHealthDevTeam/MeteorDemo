/**
 * Created by shen on 15/9/15.
 */


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
                var objDiv = document.getElementById('conversation');
                objDiv.scrollTop = objDiv.scrollHeight;
                document.getElementById("inputBox").value ="";
                Meteor.call('saveMessage',Meteor.user(),messageContent,function(error,result){
                    console.log("error: ",error," result: ",result);
                });
            }
        }
    }
});

Template.message.onRendered(function(){
    var objDiv = this.$('#conversation');
    console.log('from cedric:',objDiv[0].scrollHeight);
    objDiv[0].scrollTop = objDiv[0].scrollHeight;
});