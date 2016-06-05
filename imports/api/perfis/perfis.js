
export const Perfis_Schema = new SimpleSchema({
    _id : {
        type: String,
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
    },
    quantidade: {
        type: Number,
        label: 'Quantidade',
        optional: false
    }
});