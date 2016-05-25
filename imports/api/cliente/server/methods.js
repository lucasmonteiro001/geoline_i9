import {Cliente} from "./../cliente.js"
import {Meteor} from 'meteor/meteor';

Meteor.methods({
    'cliente.insert' (dataObj) {

        dataObj.userId = this.userId;

        check(dataObj, Cliente.simpleSchema());

        return Cliente.insert(dataObj, (error) => {
            if (error) {
                console.log(error);
            }
        });
    },
    'cliente.update' (id, dataObj) {

        check(id, String);

        //Resgistra o último usuário que alterou o objeto no banco
        dataObj.userId = this.userId;

        check(dataObj, Cliente.simpleSchema());

        Cliente.update(id, {
            $set: {nome: dataObj.nome, endereco: dataObj.endereco, telefone: dataObj.telefone, Email: dataObj.Email},
        });
    },
    'cliente.delete'(id) {
        check(id, String);
        Cliente.remove(id);
    },
});