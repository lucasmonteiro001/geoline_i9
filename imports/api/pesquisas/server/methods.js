import { Pesquisas } from "./../pesquisas.js"
import {Meteor} from 'meteor/meteor';

Meteor.methods({
    'pesquisas.insert' ( dataObj ) {

        // dataObj.userId = Meteor.userId();

        check(dataObj, Pesquisas.simpleSchema());

        Pesquisas.insert( dataObj, ( error ) => {
            if ( error ) {
                console.log( error );
            }
        });
    },
    'pesquisas.update' ( id,dataObj ) {

        check(id, String);
        check(dataObj,{nome: String, endereco: String, telefone: String, Email: String});

        Pesquisas.update( id,{
            $set: { nome: dataObj.nome, endereco: dataObj.endereco, telefone: dataObj.telefone, Email: dataObj.Email },
        });
    },
    'pesquisas.delete'(id) {
        check(id, String);        
        Pesquisas.remove(id);
    },
});