import {Meteor} from 'meteor/meteor';
import {FlowRouter} from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';

import './signup.html';

Template.signup.onRendered( () => {
    console.log("signup");
});

Template.signup.events({
    'submit form': ( event ) => {
        event.preventDefault();
        var email = $('[type=email]').val();
        var password = $('[name=password]').val();
        var role = $('#role').val();

        Meteor.call('users.addUser', {
            email:email, password:password, role:role
        }, (error,result) => {
            if(error) {
                Bert.alert(error.reason, 'danger');
            }
            else if(result) {
                Meteor.loginWithPassword(email, password, (error) => {

                    if(error) {
                        Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-frown-o');
                    }
                });
            }
        });

    }
});
