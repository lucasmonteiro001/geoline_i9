
Template.header.rendered = function(){

    $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: false, // Does not change width of dropdown to that of the activator
            hover: true, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        }
    );

};



Template.header.helpers({
    brandLink() {
        let login = FlowRouter.path( 'login' ),
            index = FlowRouter.path( 'index' );
        return !Meteor.loggingIn() && !Meteor.userId() ? login : index;
    },
    'email': function () {
        return Meteor.user().emails[0].address;
    }
});

Template.header.events({
    'click .logout' () {
        Meteor.logout( ( error ) => {
            if ( error ) {
                Bert.alert( error.reason, 'warning' );
            } else {
                Bert.alert( 'Logged out!', 'success' );
            }
        });
    },
    'click .logout': (e) => {
        e.preventDefault();
        FlowRouter.go('login');
        Meteor.logout();
        Bert.alert("Logged out", 'info');
    }
});
