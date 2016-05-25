import { Template } from 'meteor/templating';
import './authenticated-navigation.html';

Template.authenticatedNavigation.events({
    'click .logout': (e) => {
        e.preventDefault();
        FlowRouter.go('login');
        Meteor.logout();
        Bert.alert("Logged out", 'info');
    }
});


Template.authenticatedNavigation.helpers({
    'email': function () {
        return Meteor.user().emails[0].address;
    }
});