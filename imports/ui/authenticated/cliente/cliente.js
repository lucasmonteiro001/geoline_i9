import {Template} from 'meteor/templating';
import './cliente.html';
import '../../globals/page-heading.html';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {CtrlCliente} from '../../../api/cliente/controllerCliente.js'


Template.cliente.onCreated(() => {
    //Faz alguma coisa ao criar o template
});

Template.cliente.helpers({});

Template.clienteAdd.onCreated(() => {
    //Faz alguma coisa ao criar o template de inserção
});


Template.clienteAdd.events({

    //Eventos do template de inserção
    'submit form' (event, template) {
        template = Template.instance();
        event.preventDefault();
        const clienteData = {
            userId: '',
            nome: template.find('[id="nome"]').value.trim(),
            endereco: template.find('[id="endereco"]').value.trim(),
            telefone: template.find('[id="telefone"]').value.trim(),
            Email: template.find('[id="Email"]').value.trim()
        };

        CtrlCliente.insert(clienteData, (erro, data) => {
            if (erro) {
                console.log(erro.reason);
            } else {
                FlowRouter.go('/clienteView/' + data);
            }

        });
    }


});

var updateFields = function (template) {

    var id = FlowRouter.getParam('_id');
    const clientes = CtrlCliente.getCliente({_id: id});
    if (clientes && template.view.isRendered) {
        template.find('[id="nomeObjeto"]').textContent = clientes.nome;
        template.find('[id="bc-nomeObjeto"]').textContent = clientes.nome;
        template.find('[id="nome"]').value = clientes.nome;
        template.find('[id="endereco"]').value = clientes.endereco;
        template.find('[id="telefone"]').value = clientes.telefone;
        template.find('[id="Email"]').value = clientes.Email;
    }

};

var updateSpans = function (template) {

    var id = FlowRouter.getParam('_id');
    const clientes = CtrlCliente.getCliente({_id: id});
    if (clientes && template.view.isRendered) {
        template.find('[id="nomeObjeto"]').textContent = clientes.nome;
        template.find('[id="bc-nomeObjeto"]').textContent = clientes.nome;
        template.find('[id="nome"]').textContent = clientes.nome;
        template.find('[id="endereco"]').textContent = clientes.endereco;
        template.find('[id="telefone"]').textContent = clientes.telefone;
        template.find('[id="Email"]').textContent = clientes.Email;

    }

}


Template.clienteView.onCreated(() => {
    Meteor.subscribe('cliente');

});

Template.clienteView.onRendered(() => {
    var id = FlowRouter.getParam('_id');
    Template.instance().clienteNome = "";
    Template.instance().clienteID = id;
    updateSpans(Template.instance());

});

Template.clienteView.helpers({
    clienteID() {
        return FlowRouter.getParam('_id');
    },
    clientes() {

        updateSpans(Template.instance());
    }
});

Template.clienteView.events({

    //Eventos do template de inserção
    'click #linkExcluir' (event, template) {
        var sel = event.target;
        var id = sel.getAttribute('value');
        CtrlCliente.delete(id, (erro, data) => {
            if (erro) {
                console.log(erro.reason);
            } else {
                FlowRouter.go('cliente');
            }
        });
    }


});


Template.clienteEdit.onCreated(() => {
    template = Template.instance();
    Meteor.subscribe('cliente');
});

Template.clienteEdit.onRendered(() => {
    updateFields(Template.instance());
});

Template.clienteEdit.helpers({
    clienteID() {
        return FlowRouter.getParam('_id');
    },
    clientes() {

        updateFields(Template.instance());
    }
});

Template.clienteEdit.events({

    //Eventos do template de inserção
    'submit form' (event, template) {
        event.preventDefault();
        const id = FlowRouter.getParam('_id');
        const clienteData = {
            nome: template.find('[id="nome"]').value.trim(),
            endereco: template.find('[id="endereco"]').value.trim(),
            telefone: template.find('[id="telefone"]').value.trim(),
            Email: template.find('[id="Email"]').value.trim()
        };

        CtrlCliente.update(id, clienteData, (erro, data) => {
            if (erro) {
                console.log(erro.reason);
            } else {
                FlowRouter.go('/clienteView/' + id);
            }

        });
    }
});


Template.clienteList.onCreated(() => {
    Meteor.subscribe('cliente');
});

Template.clienteList.helpers({
    clientes() {
        CtrlCliente.getClientes();
    },
    'settings': function () {
        return {
            collection: CtrlCliente.getCollection(),
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            showColumnToggles: true,
            multiColumnSort: true,
            fields: [
                {key: 'nome', label: 'Informe um nome', tmpl: Template.clienteTmpl},
                {key: 'endereco', label: 'Informe o Endereço'},
                {key: 'telefone', label: 'Telefone/Cel:'},
                {key: 'Email', label: 'Meu Email'}
            ]
        };
    }
});

