import { Mongo } from 'meteor/mongo';


export const Cliente = new Mongo.Collection('cliente');

Cliente_Schema = new SimpleSchema({
    "endereco": {
        type: String,
        defaultValue: "",
        label: "Informe o Endere�o"
    },
    "telefone": {
        type: String,
        defaultValue: "",
        label: "Telefone/Cel:"
    },
    "nome": {
        type: String,
        defaultValue: "",
        label: "Informe um nome"
    },
    "Email": {
        type: String,
        defaultValue: "",
        label: "Meu Email"
    },

    "userId": {
        type: String,
        label: "Associated User ID"
    }
});

Cliente.attachSchema( Cliente_Schema );

// Deny all client-side updates on the Cliente collection
Cliente.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
