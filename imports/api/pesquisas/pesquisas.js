import { Mongo } from 'meteor/mongo';
import { Perfis_Schema } from '../perfis/perfis';
import { Entrevistas_Schema } from '../entrevistas/entrevistas';

export const Pesquisas = new Mongo.Collection('pesquisas');

Pesquisas.schema = new SimpleSchema({
    nome: {
        type: String,
        label: 'Nome da pesquisa',
        optional: false,
        unique: true
    },
    entrevistadores: {
        type: [String],
        label: 'Entrevistadores associados',
        optional: true
    },
    status: {
        type: Boolean,
        label: 'Status (fechada ou aberta)',
        optional: false
    },
    dataInicio: {
        type: Date,
        label: 'Data de inicio da pesquisa',
        optional: false
    },
    dataFim: {
        type: Date,
        label: 'Data de fim da pesquisa',
        optional: true
    },
    numMaxEntrevistados: {
        type: Number,
        label: 'Numero maximo de entrevistados',
        min: 0,
        optional: false
    },
    candidatos: { // candidatos que podem ser votados
        type: [String],
        label: 'Candidatos',
        optional: false
    },
    bairros: {
        type: [String],
        label: 'Bairros',
        optional: false
    },
    entrevistas: {
        type: [Entrevistas_Schema],
        label: 'Entrevistas',
        optional: true
    },
    perfis: {
        type: [Perfis_Schema],
        label: 'Perfil',
        optional: true
    }

});

Pesquisas.attachSchema(Pesquisas.schema);

// Deny all client-side updates on the Cliente collection
Pesquisas.deny({
    insert() { return true; },
    update() { return true; },
    remove() { return true; },
});
