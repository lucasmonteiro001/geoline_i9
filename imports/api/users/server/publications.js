import { Users } from '../users';
import './methods';

Meteor.publish('Users', function() {

    let isAdmin = Roles.userIsInRole( this.userId, 'administrador' );

    if(isAdmin)
        return Users.find({}, {fields: {emails: 1, roles:1}});
    else
        return null;

});