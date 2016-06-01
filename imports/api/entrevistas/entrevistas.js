import { Mongo } from 'meteor/mongo';


export const Entrevistas = new Mongo.Collection('entrevistas');

Entrevistas_Schema = new SimpleSchema({
    "nome": {
        type: String,
        defaultValue: "",
        label: "Informe um nome"
    },
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

Entrevistas.attachSchema( Entrevistas_Schema );

// Deny all client-side updates on the Cliente collection
Entrevistas.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
