import {Documents} from '../../api/documents/documents'

const admin = {
    email: 'admin@admin',
    password: 'asdfasdf',
    roles: ['administrador']
};

const comum = {
    email: 'comum@comum',
    password: 'asdfasdf',
    roles: ['comum'],
};


console.log("Iniciando o arquivo fixtures.js");

// cria usuario se nao existe nenhum
if(Meteor.users.find().count() === 0) {

    console.log("Nenhum usuario localizando no banco.\n Criando usuarios iniciais...");

    let userId = Accounts.createUser({ email:admin.email, password:admin.password });
    Roles.addUsersToRoles(userId, admin.roles);
    console.log("Usuario <", admin.email, "> com senha <", admin.password,
        "> foi criado com o papel de <", admin.roles[0], ">");

    userId = Accounts.createUser({ email:comum.email, password:comum.password });
    Roles.addUsersToRoles(userId, comum.roles);
    console.log("Usuario <", comum.email, "> com senha <", comum.password,
        "> foi criado com o papel de <", comum.roles[0], ">");
}

// cria documentos se nao existe nenhum
if(Documents.find().count() === 0) {
    console.log("Nenhum documento localizando no banco.\n Populando documentos iniciais...");
    for(let i = 0; i < 10; i++) {
        Documents.insert({title: "documento (" + (i + 1) + ")"});
    }
    console.log("Foram criados 10 documentos!");
}