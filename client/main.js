import '/imports/startup/client/';

FlowRouter.wait();

Tracker.autorun(function() {
    if (Roles.subscription.ready() && !FlowRouter._initialized) {
        FlowRouter.initialize()
    }
});


