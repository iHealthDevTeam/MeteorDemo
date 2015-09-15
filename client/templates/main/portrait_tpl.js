/**
 * Created by shen on 15/9/15.
 */

Template.portrait.helpers({


    items: function () {
        /*       if (Meteor.user().services.facebook) {

         return "https://graph.facebook.com/" + Meteor.user().services.facebook.id + "/picture?type=small";
         }*/

        return Meteor.users.find({}, {fields: {"services.facebook.id": 1}});

    }
});
