import { Mongo } from 'meteor/mongo';


export const Perfis = new Mongo.Collection('perfis');

Perfis_Schema = new SimpleSchema({
    "_id": {
        type: String
    },
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

Perfis.attachSchema( Perfis_Schema );

// Deny all client-side updates on the Cliente collection
Perfis.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
