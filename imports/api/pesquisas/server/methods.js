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
        check(dataObj, Pesquisas.simpleSchema());

        Pesquisas.update( id,{
            $set: dataObj
        });
    },
    'pesquisas.delete'(id) {
        check(id, String);        
        Pesquisas.remove(id);
    },
});