/**
 * Created by lucas on 5/5/16.
 */
import { Template } from 'meteor/templating';
import { Users } from '../../api/users/users';
import './users.html';
import '../globals/page-heading.html';

let template;

Template.users.onCreated(() => {

    template = Template.instance();

    let currentPage = new ReactiveVar(Session.get('current-page') || 0);

    template.subscribe('Users');
    template.subscribe('UsersTable')

    template.users = () => {
        return Users.find();
    };


    template.currentPage = currentPage;
    template.autorun(function () {
        Session.set('current-page', currentPage.get());
    });

});

Template.users.helpers({
    'users' : () => {

        return template.users();
    },
    'settings': function () {
        return {
            collection: template.users(),
            currentPage: template.currentPage,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            showColumnToggles: true,
            multiColumnSort: true,
            fields: [
                {key:'emails', label:'Emails',
                    fn: function (value, object, key) {
                        return value[0].address;
                    }
                },
                {key:'roles', label:'Grupo'}
            ]
        };
    }
});

Template.users.events({

    'change [id="role"]' : function(event) {

        let role = $( event.target ).find( 'option:selected' ).val();

        Meteor.call( "users.setRoleOnUser", {
            user: this._id,
            role: role
        }, ( error, response ) => {
            if ( error ) {
                Bert.alert( error.reason, "warning" );
            }
        });
    }
});
