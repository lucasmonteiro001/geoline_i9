import { Users } from '../users';
import './methods';

Meteor.publish('Users', function(filter, projection) {

    projection || (projection = {});
    check(projection, Object);

    let isAdmin = Roles.userIsInRole( this.userId, 'administrador' );

    if(isAdmin) {

        // se existe um filtro
        if( typeof filter === "object") {

            check(filter, Object);

            return Users.find(filter, projection);
        }
        // se eh um string, infere-se que esta procurando por uma ID
        else if(typeof filter === "string") {

            check(filter, String);

            return Users.find({_id: filter}, projection);
        }
        // se nao eh especificado nenhum filtro ou projection, retorna todos os usuarios
        else {

            return Users.find({});
        }
    }

    else {
        
        return null;
    }

});