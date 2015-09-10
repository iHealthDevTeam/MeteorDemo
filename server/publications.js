Meteor.publish("messages",function(){
	return Messages.find();
});

Meteor.publish("answers",function(){
	return Answers.find();
});

Meteor.publish("votes",function(){
	return Votes.find();
});

Meteor.publish("permissions",function(){
	return Permissions.find();
});

Meteor.publish("questions",function(){
	return Questions.find();
});

Meteor.publish("userData",function(){
	if (this.userId){
		return Meteor.users.find({_id:this.userId},
			{fields:{"services.facebook.name":1
				,"services.facebook.gender":1
				,"services.facebook.id":1}});
	}else{
		this.ready();
	};
})