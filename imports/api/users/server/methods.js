    import {Meteor} from 'meteor/meteor';

    Meteor.methods({
        'users.addUser' (params) {
            // check(params, Object);
            check(params, {
                email:String,
                password:String,
                role:String
            });

            const userId = Accounts.createUser({
                email: params.email,
                password: params.password
            });

            Roles.addUsersToRoles(userId, params.role);

            return true;

        },
        'users.setRoleOnUser' ( options ) {

            check( options, {
                user: String,
                role: String
            });

            try {
                Roles.setUserRoles( options.user, [ options.role ] );
            } catch( exception ) {
                return exception;
            }
        }
    });
