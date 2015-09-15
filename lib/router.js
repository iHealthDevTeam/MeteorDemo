

Router.configure({
    //loading页面
    //loadingTemplate: 'loading'
});

Router.route('/', {
    name: 'home',
    template: 'home',
    waitOn: function () {
        return [
            Meteor.subscribe("messages"),
            Meteor.subscribe("questions"),
            Meteor.subscribe("answers"),
            Meteor.subscribe("votes"),
            Meteor.subscribe("userData"),
            Meteor.subscribe("permissions")
        ]
    }
});

Router.route('/admin', {
    name: 'admin',
    template: 'adminBoard'
});

