/**
 * Created by shen on 15/9/15.
 */


Template.login.events({
    'click #facebook-login': function (event) {
        Meteor.loginWithFacebook({}, function (err) {

            if (err) {
                throw new Meteor.Error("facebook login failed");
            }
            else {
                Meteor.call("insertPermission", Meteor.userId());
                //alert(Meteor.userId());
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