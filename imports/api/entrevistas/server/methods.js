import { Entrevistas } from "./../entrevistas.js"
import {Meteor} from 'meteor/meteor';

Meteor.methods({
    'entrevistas.insert' ( dataObj ) {

        dataObj.userId = this.userId;

        check(dataObj,{nome: String, endereco: String, telefone: String, Email: String,  userId:String});

        Entrevistas.insert( dataObj, ( error ) => {
            if ( error ) {
                console.log( error );
            }
        });
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