import { Entrevistas } from "./../entrevistas.js"
import { Meteor } from 'meteor/meteor';
import { Pesquisas } from '../../pesquisas/pesquisas';

Meteor.methods({
    'entrevistas.insert' ( pesquisaId, entrevista ) {

        entrevista.entrevistador = this.userId;

        check(entrevista, Object);
        check(pesquisaId, String);

        Pesquisas.update( pesquisaId, {$push: {entrevistas : entrevista}} , ( error ) => {
            if ( error ) {
                console.log( error );
            }});

    },
    'entrevistas.update' ( id,dataObj ) {

        check(id, String);
        check(dataObj,{nome: String, endereco: String, telefone: String, Email: String});

        Entrevistas.update( id,{
            $set: { nome: dataObj.nome, endereco: dataObj.endereco, telefone: dataObj.telefone, Email: dataObj.Email },
        });
    },
    'entrevistas.delete'(id) {
        check(id, String);
        Entrevistas.remove(id);
    },
});