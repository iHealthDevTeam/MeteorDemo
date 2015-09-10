Tracker.autorun(function(){
	Meteor.subscribe("messages");
	Meteor.subscribe("questions");
	Meteor.subscribe("answers");
	Meteor.subscribe("votes");
	Meteor.subscribe("permissions");
	Meteor.subscribe("userData");
});
