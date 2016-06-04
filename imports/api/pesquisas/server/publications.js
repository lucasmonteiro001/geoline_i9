import { Pesquisas } from "../pesquisas.js";
import { Users } from "../../users/users";

Meteor.publish( 'Pesquisas', function(filter, projection){

    projection || (projection = {});
    check(projection, Object);

    let isAdmin = Roles.userIsInRole( this.userId, 'administrador' );
    let isEntrevistador = Roles.userIsInRole( this.userId, 'entrevistador' );

    // se o usuario nao esta logado
    if(!this.userId) return null;

    if(isAdmin) {

        // se existe um filtro
        if( typeof filter === "object") {

            check(filter, Object);

            return Pesquisas.find(filter, projection);
        }
        // se eh um string, infere-se que esta procurando por uma ID
        else if(typeof filter === "string") {

            check(filter, String);

            return Pesquisas.find({_id: filter}, projection);
        }
        // se nao eh especificado nenhum filtro ou projection, retorna todos os usuarios
        else {

            return Pesquisas.find({});
        }
    }
    // retorna as pesquisa onde o entrevistador esta relacionado a pesquisa
    else if(isEntrevistador) {

        filter || (filter = {});

        check(filter, Object);

        // se existe um filtro
        if( typeof filter === "object") {

            console.log(filter);
            console.log(projection);

            // se contem o objeto fields
            if(projection.fields) {
                return Pesquisas.find(filter, projection);
            }
            else {
                return Pesquisas.find(filter, {fields: projection});
            }
        }
        // se nao eh especificado nenhum filtro ou projection, retorna todos os usuarios
        else {

            return null;
        }
    }
    else
        return null;

});