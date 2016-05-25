/**
 * Created by lucas on 5/5/16.
 */
Template.registerHelper( 'isCurrentUser', ( currentUser ) => {
    return currentUser === Meteor.userId();
});

Template.registerHelper( 'disableIfAdmin', ( userId ) => {
    if ( Meteor.userId() === userId ) {
        return Roles.userIsInRole( userId, 'admin' ) ? "disabled" : "";
    }
});

Template.registerHelper( 'selected', ( v1, v2 ) => {
    return v1 === v2;
});