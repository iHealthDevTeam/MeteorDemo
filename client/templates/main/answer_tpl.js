/**
 * Created by shen on 15/9/15.
 */


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


function CanVote(answerId) {
    if (Votes.find({userId: Meteor.userId(), answerId: answerId}).count() > 0) {
        return false;
    }
    else {
        return true;
    }
};