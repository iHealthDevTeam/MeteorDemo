/**
 * Created by shen on 15/9/15.
 */

Template.admin.helpers({

    //you can change it
    isAdministrator: function () {

        return Meteor.userId() === "cQaF5q4xjraPxhLrs"
    }
});


Template.adminBoard.helpers({

    users: function () {

        return Meteor.users.find({}, {sort: {createAt: -1}});
    },
    settings: function () {
        return {
            rowsPerPage: 10,
            showFilter: false,
            fields: [
                {key: 'profile.name', label: "Name", headerClass: "col-md-2"},
                {
                    key: 'createdAt', label: "Create date", headerClass: "col-md-2",
                    fn: function (value) {
                        return moment(new Date(value)).format("MM/DD/YYYY");
                    }
                },
                {

                    key: '_id',
                    label: "Question", headerClass: "col-md-4",
                    fn: function (value, object) {

                        var quesPermission = Permissions.findOne({userId: value}).questionPer;

                        //  return permission.questionPer;
                        //return value;

                        //need to be improved, ternary operator?
                        if (quesPermission === true) {
                            return new Spacebars.SafeString('Post question:&nbsp;' +
                                '<input class="cbQuesPermis" type="checkbox" checked /> ');
                        }
                        else {
                            return new Spacebars.SafeString('Post question:&nbsp;' +
                                '<input class="cbQuesPermis" type="checkbox"  /> ');
                        }

                    }
                },
                {

                    key: '_id',
                    label: "Chat", headerClass: "col-md-4",
                    fn: function (value, object) {

                        var chatPermission = Permissions.findOne({userId: value}).chatPer;
                        //  return permission.questionPer;
                        //return value;

                        //need to be improved, ternary operator?
                        if (chatPermission === true) {
                            return new Spacebars.SafeString('Multi-Dialog:&nbsp;' +
                                '<input class="cbMulDialPermis" type="checkbox" checked /> ');
                        }
                        else {
                            return new Spacebars.SafeString('Multi-Dialog:&nbsp;' +
                                '<input class="cbMulDialPermis" type="checkbox"  /> ');
                        }

                    }
                }
            ]
        }
    }
});


Template.adminBoard.events({


    'click .reactive-table tbody tr': function (event) {

        event.preventDefault();


        var permissionId = Permissions.findOne({userId: this._id})._id;
        if (event.target.className == "cbQuesPermis") {

            Permissions.update(permissionId, {$set: {questionPer: event.target.checked}});
        }
        if (event.target.className == "cbMulDialPermis") {

            Permissions.update(permissionId, {$set: {chatPer: event.target.checked}});
        }

    }
});