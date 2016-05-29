import { Pesquisas } from "../pesquisas.js";
import { Users } from "../../users/users";

Meteor.publish( 'Pesquisas', function(id){

    id || (id = "");
    check(id, String);

    let isAdmin = Roles.userIsInRole( this.userId, 'administrador' );
    let isEntrevistador = Roles.userIsInRole( this.userId, 'entrevistador' );

    // se o usuario nao esta logado
    if(!this.userId) return null;

    if(isAdmin) {

        if(id !== "") {
            return Pesquisas.find({_id:id});
        }
        else {
            return Pesquisas.find({});
        }
    }
    // retorna as pesquisa onde o entrevistador esta relacionado a pesquisa
    else if(isEntrevistador) {

        let user = Users.findOne({_id:this.userId});

        return Pesquisas.find({entrevistadores: user.nome});
    }
    else
        return null;

});