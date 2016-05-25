import { Template } from 'meteor/templating';
import './reset-password.html';

Template.resetPassword.onRendered( () => {
  console.log("reset-password");
});

Template.resetPassword.events({
  'submit form': ( event ) => event.preventDefault()
});
