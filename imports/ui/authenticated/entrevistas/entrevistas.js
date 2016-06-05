import { Template } from 'meteor/templating';
import './entrevistas.html';
import '../../globals/page-heading.html';
import { Entrevistas } from '../../../api/entrevistas/entrevistas.js'
import { Pesquisas } from '../../../api/pesquisas/pesquisas';
import { Users } from '../../../api/users/users';
import {FlowRouter} from 'meteor/kadira:flow-router';


let template;

Template.entrevistas.onCreated(() => {

    //Faz alguma coisa ao criar o template

});



Template.entrevistas.helpers({

});

Template.entrevistasAdd.onCreated(() => {

    let template = Template.instance();

    template.pesquisaId = FlowRouter.getParam('pesquisaId');

    template.subscribe('Pesquisas',
        {_id: template.pesquisaId, entrevistadores: Meteor.userId()},
        {entrevistas: 0});

    template.pesquisa = Pesquisas.find({_id: template.pesquisaId});

});

Template.entrevistasAdd.helpers({
    'pesquisaId': () => {
        return FlowRouter.getParam('pesquisaId');
    },
    'pesquisa': () => {
        return Template.instance().pesquisa;
    }
});

Template.entrevistasAdd.events({

    //Eventos do template de inserção

    'submit form' (event, template) {

        event.preventDefault();


        const entrevistaData = {
            candidato : template.find('[id="candidato"]').value.trim(),
            bairro: template.find('[id="bairro"]').value.trim(),
            faixaEtaria: template.find('[id="faixaEtaria"]').value.trim(),
            faixaDeRenda: template.find('[id="faixaDeRenda"]').value.trim(),
            sexo: template.find('[name="sexo"]:checked').value.trim(),
        };

        Meteor.call('entrevistas.insert', FlowRouter.getParam('pesquisaId'), entrevistaData, (error) => {
            if (error) {
                alert(error.reason);
            } else {

                FlowRouter.go('/entrevistasList/' + FlowRouter.getParam('pesquisaId'));
            }
        });



    }




});

var updateFields = function(template) {

    var id = FlowRouter.getParam('_id');
    const entrevistass = Entrevistas.findOne({_id: id});
    if (entrevistass && template.view.isRendered) {
        template.find('[id="nomeObjeto"]').textContent = entrevistass.nome;
        template.find('[id="bc-nomeObjeto"]').textContent = entrevistass.nome;
        template.find('[id="nome"]').value = entrevistass.nome;
        template.find('[id="endereco"]').value = entrevistass.endereco;
        template.find('[id="telefone"]').value = entrevistass.telefone;
        template.find('[id="Email"]').value = entrevistass.Email;
    }

};

var updateSpans = function(template) {

    var id = FlowRouter.getParam('_id');
    const entrevistass = Entrevistas.findOne({_id: id});
    if (entrevistass && template.view.isRendered) {
        template.find('[id="nomeObjeto"]').textContent = entrevistass.nome;
        template.find('[id="bc-nomeObjeto"]').textContent = entrevistass.nome;
        template.find('[id="nome"]').textContent = entrevistass.nome;
        template.find('[id="endereco"]').textContent = entrevistass.endereco;
        template.find('[id="telefone"]').textContent = entrevistass.telefone;
        template.find('[id="Email"]').textContent = entrevistass.Email;

    }

}


Template.entrevistasView.onCreated(() => {


});

Template.entrevistasView.onRendered(() => {
    var id = FlowRouter.getParam('_id');
    Template.instance().entrevistasNome = "";
    Template.instance().entrevistasID = id;
    updateSpans(Template.instance());

});

Template.entrevistasView.helpers({
    entrevistasID() {
        return FlowRouter.getParam('_id');
    },
    entrevistass() {

        updateSpans(Template.instance());
    }
});

Template.entrevistasView.events({

    //Eventos do template de inserção

    'click #linkExcluir' (event, template) {

        var sel = event.target;
        var id = sel.getAttribute('value');

        Meteor.call('entrevistas.delete',id, (error) => {
            if (error) {
                alert(error.reason);
            } else {
                FlowRouter.go('entrevistas');
            }
        });


    }




});



Template.entrevistasEdit.onCreated(() => {

    template = Template.instance();


});

Template.entrevistasEdit.onRendered(() => {
    updateFields(Template.instance());

});

Template.entrevistasEdit.helpers({
    entrevistasID() {
        return FlowRouter.getParam('_id');
    },
    entrevistass() {

        updateFields(Template.instance());
    }
});

Template.entrevistasEdit.events({

    //Eventos do template de inserção

    'submit form' (event, template) {

        template = Template.instance();



        event.preventDefault();
        const id = FlowRouter.getParam('_id');
        const entrevistasData = {
            nome: template.find('[id="nome"]').value.trim(),
            endereco: template.find('[id="endereco"]').value.trim(),
            telefone: template.find('[id="telefone"]').value.trim(),
            Email: template.find('[id="Email"]').value.trim()
        };

        Meteor.call('entrevistas.update',id, entrevistasData, (error) => {
            if (error) {
                alert(error.reason);
            } else {
                FlowRouter.go('/entrevistasView/'+id);
            }
        });


    }




});




Template.pesquisasListParaEntrevistadores.onCreated(() => {

    let template = Template.instance();

    template.subscribe('Pesquisas', {entrevistadores : Meteor.userId()});

    template.pesquisas = () => {
        return Pesquisas.find();
    }

});

Template.pesquisasListParaEntrevistadores.helpers({
    entrevistass() {
        const entrevistass = Entrevistas.find();
        if ( entrevistass ) {
            return entrevistass;
        }
    },
    'settings': function () {
        return {
            collection: Template.instance().pesquisas().fetch(),
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            showColumnToggles: true,
            multiColumnSort: true,
            fields: [
                {key:'nome', label:'Nome', tmpl: Template.pesquisasTmplParaEntrevistadores},
                {key: 'entrevistas', label: '# de entrevistados', fn: function(val) {
                    if(!val) return 0;
                    return val.length;
                }},
                {key:'numMaxEntrevistados', label:'# max de entrevistados'},
            ]
        };
    }
});

Template.entrevistasList.onCreated(() => {
    // Session.set("pesquisa", FlowRouter.getParam('_id'));
    let template = Template.instance(),
        id = FlowRouter.getParam('pesquisaId');

    template.subscribe("Pesquisas", {_id: id}, {entrevistas:1});

    template.entrevistas = new ReactiveVar([]);

    template.autorun(function() {

        let pesquisa = Pesquisas.findOne();

        if(pesquisa) {

            template.entrevistas.set(pesquisa.entrevistas);
        }

    });

});

Template.entrevistasList.helpers({
    'pesquisaId': () => {
        return FlowRouter.getParam('pesquisaId');
    },
    'settings': function () {

        return {
            collection: Template.instance().entrevistas.get() || [],
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            showColumnToggles: true,
            multiColumnSort: true,
            fields: [
                {key:'candidato', label:'Candidato'},
                {key: 'bairro', label: 'Bairro'},
                {key: 'faixaEtaria', label: 'Faixa etária'},
                {key: 'faixaDeRenda', label: 'Faixa de renda'},
                {key: 'sexo', label: 'Sexo'}
            ]
        };
    }
});