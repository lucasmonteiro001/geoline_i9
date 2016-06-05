export const Entrevistas_Schema = new SimpleSchema({
    _id: {
        type: String
    },
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