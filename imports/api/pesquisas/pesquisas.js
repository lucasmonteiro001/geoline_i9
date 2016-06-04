import { Mongo } from 'meteor/mongo';


export const Pesquisas = new Mongo.Collection('pesquisas');

const Entrevista = new SimpleSchema({
    candidato : {
        type: String,
        label: 'Candidato',
        optional: false
    },
    bairro : {
        type: String,
        label: 'Bairro',
        optional: false
    },
    faixaEtaria : {
        type: String,
        label: 'Faixa etária',
        optional: false
    },
    faixaDeRenda : {
        type: String,
        label: 'Faixa de renda',
        optional: false
    },
    sexo: {
        type: String,
        label: 'Sexo',
        allowedValues: ['masculino', 'feminino'],
        optional: false
    }
});

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
        type: [Entrevista],
        label: 'Entrevistas',
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
