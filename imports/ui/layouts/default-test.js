import {Template} from 'meteor/templating';
import {FlowRouter} from 'meteor/kadira:flow-router';
import './default-test.html';
import '../globals/authenticated-menu.html';
import '../globals/public-menu.html';

import '../globals/header.html';
import '../globals/public-navigation.html';
import '../globals/loading.html';
import '../globals/authenticated-navigation';
import '../globals/footer.html';



const handleRedirect = (routes, redirect) => {
    let currentRoute = FlowRouter.getRouteName();

    if (routes.indexOf(currentRoute) > -1) {
        FlowRouter.go(redirect);
    }
    else
        return false;
};


Template.defaultTest.onCreated(() => {
    //Inicializa o Menu
    $('#side-menu').metisMenu();

    // FIXED TOP NAVBAR OPTION
    // Uncomment this if you want to have fixed top navbar
    // $('body').addClass('fixed-nav');
    // $(".navbar-static-top").removeClass('navbar-static-top').addClass('navbar-fixed-top');


    // Minimalize menu when screen is less than 768px
    $(window).bind("resize load", function () {
        if ($(this).width() < 769) {
            $('body').addClass('body-small')
        } else {
            $('body').removeClass('body-small')
        }
    });

    // Fix height of layout when resize, scroll and load
    $(window).bind("load resize scroll", function() {
        if(!$("body").hasClass('body-small')) {

            var navbarHeigh = $('nav.navbar-default').height();
            var wrapperHeigh = $('#page-wrapper').height();

            if(navbarHeigh > wrapperHeigh){
                $('#page-wrapper').css("min-height", navbarHeigh + "px");
            }

            if(navbarHeigh < wrapperHeigh){
                $('#page-wrapper').css("min-height", $(window).height()  + "px");
            }

            if ($('body').hasClass('fixed-nav')) {
                if (navbarHeigh > wrapperHeigh) {
                    $('#page-wrapper').css("min-height", navbarHeigh - 60 + "px");
                } else {
                    $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
                }
            }
        }
    });


    // SKIN OPTIONS
    // Uncomment this if you want to have different skin option:
    // Available skin: (skin-1 or skin-3, skin-2 deprecated)
    //$('body').addClass('.md-skin');

    // FIXED-SIDEBAR
    // Uncomment this if you want to have fixed left navigation
    // $('body').addClass('fixed-sidebar');
    // $('.sidebar-collapse').slimScroll({
    //     height: '100%',
    //     railOpacity: 0.9
    // });

    // BOXED LAYOUT
    // Uncomment this if you want to have boxed layout
    //$('body').addClass('boxed-layout');


});

Template.defaultTest.helpers({
    'email': function () {
        return Meteor.user().emails[0].address;
    },    
    loggingIn() {
        return Meteor.loggingIn();
    },
    authenticated() {
        return !Meteor.loggingIn() && Meteor.user();
    },
    redirectAuthenticated() {
        return handleRedirect([
            'login',
            'signup',
            'recover-password',
            'reset-password'
        ], '/');
    },
    redirectPublic() {
        return handleRedirect([
            'index',
            'dashboard',
            'users'
        ], '/login');
    }
});



Template.defaultTest.events({

    // Toggle left navigation
    'click .navbar-minimalize': function (event) {

        event.preventDefault();

        // Toggle special class
        $("body").toggleClass("mini-navbar");

        // Enable smoothly hide/show menu
        if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
            // Hide menu in order to smoothly turn on when maximize menu
            $('#side-menu').hide();
            // For smoothly turn on menu
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(400);
                }, 200);
        } else if ($('body').hasClass('fixed-sidebar')) {
            $('#side-menu').hide();
            setTimeout(
                function () {
                    $('#side-menu').fadeIn(400);
                }, 100);
        } else {
            // Remove all inline style from jquery fadeIn function to reset menu state
            $('#side-menu').removeAttr('style');
        }
    },
    'click .logout': (e) => {
        e.preventDefault();
        FlowRouter.go('login');
        Meteor.logout();
        Bert.alert("Logged out", 'info');
    }    

});
