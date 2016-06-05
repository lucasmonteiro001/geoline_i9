import { Pesquisas } from "../pesquisas.js";
import { Users } from "../../users/users";

Meteor.publish( 'Pesquisas', function(filter, projection){

    projection || (projection = {});
    check(projection, Object);

    filter || (filter = {});
    check(filter, Object);

    // se o usuario nao esta logado
    if(!this.userId) return null;

    // if(isAdmin) {

    // se existe um filtro
    if( typeof filter === "object") {

        check(filter, Object);

        if(Object.keys(projection).length === 0) {

            if (Object.keys(filter).length === 0) {

                return Pesquisas.find();
            } else {

                return Pesquisas.find(filter);
            }
        }
        else {
            return Pesquisas.find(filter, {fields: projection});
        }
    }
    // se nao eh especificado nenhum filtro ou projection, retorna todos os usuarios
    else {

        return null;
    }


});