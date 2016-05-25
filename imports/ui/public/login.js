import { Template } from 'meteor/templating';
import './login.html';

Template.login.onRendered( () => {
    //Modules.client.login( { form: "#login", template: Template.instance() } );
    console.log("tela de login");
});

Template.login.events({
    'submit form': ( event ) => {
        event.preventDefault();
        var email = $('[type=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error) {
            if(error) {
                Bert.alert(error.reason, 'danger', 'fixed-top', 'fa-frown-o');
            }
        });
    }
});
