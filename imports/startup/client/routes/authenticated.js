import "../../../ui/authenticated/pesquisas/pesquisas";
import "../../../ui/authenticated/cliente/cliente";
import "../../../ui/authenticated/cliente/cliente";
import {FlowRouter} from 'meteor/kadira:flow-router';
import '../../../ui/authenticated/index';
import  '../../../ui/authenticated/users';


const blockUnauthorizedAdmin = ( context, redirect ) => {
    if ( Meteor.userId() && !Roles.userIsInRole( Meteor.userId(), 'administrador' ) ) {
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

authenticatedRoutes.route( '/dashboard', {
    name: 'dashboard',
    action() {
        BlazeLayout.render( 'default', { yield: 'dashboard' } );
        console.log('rota: dashboard');
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
authenticatedRoutes.route( '/cliente', {
	name: 'cliente',
	action() {
		BlazeLayout.render( 'default', { yield: 'cliente' } );
	} 
});
authenticatedRoutes.route( '/clienteAdd', {
    name: 'clienteAdd',
    action() {
        BlazeLayout.render( 'default', { yield: 'clienteAdd' } );
    }
});

authenticatedRoutes.route( '/clienteEdit/:_id', {
    name: 'clienteEdit',
    action() {
        BlazeLayout.render( 'default', { yield: 'clienteEdit'} );
    }
});

authenticatedRoutes.route( '/clienteView/:_id', {
    name: 'clienteView',
    action() {
        BlazeLayout.render( 'default', { yield: 'clienteView'} );
    }
});

authenticatedRoutes.route( '/pesquisas', {
	name: 'pesquisas',
	action() {
		BlazeLayout.render( 'default', { yield: 'pesquisas' } );
	} 
});
authenticatedRoutes.route( '/pesquisasAdd', {
	name: 'pesquisasAdd',
	action() {
		BlazeLayout.render( 'default', { yield: 'pesquisasAdd' } );
	} 
});
authenticatedRoutes.route( '/pesquisasEdit/:_id', {
	name: 'pesquisasEdit',
	action() {
		BlazeLayout.render( 'default', { yield: 'pesquisasEdit' } );
	} 
});
authenticatedRoutes.route( '/pesquisasView/:_id', {
	name: 'pesquisasView',
	action() {
		BlazeLayout.render( 'default', { yield: 'pesquisasView' } );
	} 
});