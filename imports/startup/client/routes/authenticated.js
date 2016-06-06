import "../../../ui/authenticated/perfis/perfis";
import "../../../ui/authenticated/entrevistas/entrevistas";
import "../../../ui/authenticated/pesquisas/pesquisas";
import {FlowRouter} from 'meteor/kadira:flow-router';
import '../../../ui/authenticated/index';
import  '../../../ui/authenticated/users';
import {Meteor} from 'meteor/meteor';


const blockUnauthorizedAdmin = ( context, redirect ) => {

    if (!Roles.userIsInRole( Meteor.userId(), 'administrador' ) ) {
        Bert.alert('Acesso nao permitido!', 'danger')
        redirect('index');
    }

};

const blockUnauthorizedEntrevistador = ( context, redirect ) => {

    if (!Roles.userIsInRole( Meteor.userId(), 'entrevistador' ) ) {
        Bert.alert('Acesso nao permitido!', 'danger')
        redirect('index');
    }

};

const authenticatedRedirect = ( context, redirect ) => {
    if ( !Meteor.userId() ) {
        redirect('login');
    }
};

const authenticatedRoutes = FlowRouter.group({
    name: 'authenticated',
    triggersEnter: [ authenticatedRedirect ]
});

authenticatedRoutes.route( '/', {
    name: 'index',
    action() {
        BlazeLayout.render( 'default', { yield: 'index' } );
        console.log('rota: index');

    }
});
authenticatedRoutes.route( '/users', {
    name: 'users',
    triggersEnter: [ blockUnauthorizedAdmin ],
    action() {
        BlazeLayout.render( 'default', { yield: 'users' } );
        console.log('rota: users');
    }
});
authenticatedRoutes.route( '/pesquisas', {
    name: 'pesquisas',
    triggersEnter: [blockUnauthorizedAdmin],
    action() {
        BlazeLayout.render( 'default', { yield: 'pesquisas' } );
    }
});
authenticatedRoutes.route( '/pesquisasAdd', {
    name: 'pesquisasAdd',
    triggersEnter: [blockUnauthorizedAdmin],
    action() {
        BlazeLayout.render( 'default', { yield: 'pesquisasAdd' } );
    }
});
authenticatedRoutes.route( '/pesquisasEdit/:_id', {
    name: 'pesquisasEdit',
    triggersEnter: [blockUnauthorizedAdmin],
    action() {
        BlazeLayout.render( 'default', { yield: 'pesquisasEdit' } );
    }
});
authenticatedRoutes.route( '/pesquisasView/:_id', {
    name: 'pesquisasView',
    triggersEnter: [blockUnauthorizedAdmin],
    action() {
        BlazeLayout.render( 'default', { yield: 'pesquisasView' } );
    }
});
authenticatedRoutes.route( '/entrevistas', {
    name: 'entrevistas',
    triggersEnter: [ blockUnauthorizedEntrevistador ],
    action() {
        BlazeLayout.render( 'default', { yield: 'entrevistas' } );
    }
});
authenticatedRoutes.route( '/entrevistasAdd/:pesquisaId', {
    name: 'entrevistasAdd',
    triggersEnter: [ blockUnauthorizedEntrevistador ],
    action() {
        BlazeLayout.render( 'default', { yield: 'entrevistasAdd' } );
    }
});
authenticatedRoutes.route( '/entrevistasEdit/:_id', {
    name: 'entrevistasEdit',
    triggersEnter: [ blockUnauthorizedEntrevistador ],
    action() {
        BlazeLayout.render( 'default', { yield: 'entrevistasEdit' } );
    }
});
authenticatedRoutes.route( '/entrevistasView/:_id', {
    name: 'entrevistasView',
    triggersEnter: [ blockUnauthorizedEntrevistador ],
    action() {
        BlazeLayout.render( 'default', { yield: 'entrevistasView' } );
    }
});
authenticatedRoutes.route( '/entrevistasList/:pesquisaId', {
    name: 'entrevistasList',
    triggersEnter: [ blockUnauthorizedEntrevistador ],
    action() {
        BlazeLayout.render( 'default', { yield: 'entrevistasList' } );
    }
});
authenticatedRoutes.route( '/perfis', {
    name: 'perfis',
    triggersEnter: [blockUnauthorizedAdmin],
    action() {
        BlazeLayout.render( 'default', { yield: 'perfis' } );
    }
});
authenticatedRoutes.route( '/perfisAdd/:pesquisaId', {
    name: 'perfisAdd',
    triggersEnter: [blockUnauthorizedAdmin],
    action() {
        BlazeLayout.render( 'default', { yield: 'perfisAdd' } );
    }
});
authenticatedRoutes.route( '/perfisEdit/:_id', {
    name: 'perfisEdit',
    triggersEnter: [blockUnauthorizedAdmin],
    action() {
        BlazeLayout.render( 'default', { yield: 'perfisEdit' } );
    }
});
authenticatedRoutes.route( '/perfisView/:_id', {
    name: 'perfisView',
    triggersEnter: [blockUnauthorizedAdmin],
    action() {
        BlazeLayout.render( 'default', { yield: 'perfisView' } );
    }
});