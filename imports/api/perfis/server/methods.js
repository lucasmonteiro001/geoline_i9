import { Perfis } from "./../perfis.js"
import { Pesquisas } from '../../pesquisas/pesquisas';
import {Meteor} from 'meteor/meteor';

Meteor.methods({
    'perfis.insert' ( pesquisaId, perfil ) {

        check(perfil, Object);
        check(pesquisaId, String);

        perfil._id = Random.id();

        Pesquisas.update( pesquisaId, {$push: {perfis : perfil}} , ( error ) => {
            if ( error ) {
                console.log( error );
            }});

    },
    'perfis.update' ( id,dataObj ) {

        check(id, String);
        check(dataObj,{nome: String, endereco: String, telefone: String, Email: String});

        Perfis.update( id,{
            $set: { nome: dataObj.nome, endereco: dataObj.endereco, telefone: dataObj.telefone, Email: dataObj.Email },
        });
    },
    'perfis.delete'(id) {
        check(id, String);        
        Perfis.remove(id);
    },
});