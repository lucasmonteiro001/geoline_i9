import {Template} from 'meteor/templating';
import './perfis.html';
import '../../globals/page-heading.html';
import { Perfis } from '../../../api/perfis/perfis.js'
import {FlowRouter} from 'meteor/kadira:flow-router';
import { Pesquisas } from '../../../api/pesquisas/pesquisas';


let template;

Template.perfis.onCreated(() => {

    //Faz alguma coisa ao criar o template

});



Template.perfis.helpers({

});

Template.perfisAdd.onCreated(() => {

    let template = Template.instance();

    template.pesquisaId = FlowRouter.getParam('pesquisaId');

    template.subscribe('Pesquisas',
        {_id: template.pesquisaId});

    template.pesquisa = Pesquisas.find({_id: template.pesquisaId});

});

Template.perfisAdd.helpers({
    'pesquisaId': () => {
        return FlowRouter.getParam('pesquisaId');
    },
    'pesquisa': () => {
        return Template.instance().pesquisa;
    }
});

Template.perfisAdd.events({


    'submit form' (event, template) {

        event.preventDefault();


        const perfilData = {
            bairro: template.find('[id="bairro"]').value.trim(),
            faixaEtaria: template.find('[id="faixaEtaria"]').value.trim(),
            faixaDeRenda: template.find('[id="faixaDeRenda"]').value.trim(),
            sexo: (template.find('[name="sexo"]:checked')) ? template.find('[name="sexo"]:checked').value.trim() : "null",
            quantidade: parseInt(template.find('[id="quantidade"]').value.trim()),
        };

        // verifica se todos os valores sao null, se sim, emite um alerta
        let isNull = [];

        for(let i in perfilData) {
            if(perfilData[i] === "null")
                isNull.push(i);
        }

        if(isNull === 5) {
            alert("Preencha os campos corretamente!!!");
            return false;
        }

        Meteor.call('perfis.insert', FlowRouter.getParam('pesquisaId'), perfilData, (error) => {
            if (error) {
                alert(error.reason);
            } else {

                FlowRouter.go('/pesquisasView/' + FlowRouter.getParam('pesquisaId'));
            }
        });

    }


    });

var updateFields = function(template) {

    var id = FlowRouter.getParam('_id');
    const perfiss = Perfis.findOne({_id: id});
    if (perfiss && template.view.isRendered) {
        template.find('[id="nomeObjeto"]').textContent = perfiss.nome;
        template.find('[id="bc-nomeObjeto"]').textContent = perfiss.nome;
        template.find('[id="nome"]').value = perfiss.nome;
        template.find('[id="endereco"]').value = perfiss.endereco;
        template.find('[id="telefone"]').value = perfiss.telefone;
        template.find('[id="Email"]').value = perfiss.Email;
    }

};

var updateSpans = function(template) {

    var id = FlowRouter.getParam('_id');
    const perfiss = Perfis.findOne({_id: id});
    if (perfiss && template.view.isRendered) {
        template.find('[id="nomeObjeto"]').textContent = perfiss.nome;
        template.find('[id="bc-nomeObjeto"]').textContent = perfiss.nome;
        template.find('[id="nome"]').textContent = perfiss.nome;
        template.find('[id="endereco"]').textContent = perfiss.endereco;
        template.find('[id="telefone"]').textContent = perfiss.telefone;
        template.find('[id="Email"]').textContent = perfiss.Email;

    }

}


Template.perfisView.onCreated(() => {
    Meteor.subscribe('perfis');

});

Template.perfisView.onRendered(() => {
    var id = FlowRouter.getParam('_id');
    Template.instance().perfisNome = "";
    Template.instance().perfisID = id;
    updateSpans(Template.instance());

});

Template.perfisView.helpers({
    perfisID() {
        return FlowRouter.getParam('_id');
    },
    perfiss() {

        updateSpans(Template.instance());
    }
});

Template.perfisView.events({

    //Eventos do template de inserção

    'click #linkExcluir' (event, template) {

        var sel = event.target;
        var id = sel.getAttribute('value');

        Meteor.call('perfis.delete',id, (error) => {
            if (error) {
                alert(error.reason);
            } else {
                FlowRouter.go('perfis');
            }
        });


    }




});



Template.perfisEdit.onCreated(() => {

    template = Template.instance();


    Meteor.subscribe('perfis');

});

Template.perfisEdit.onRendered(() => {
    updateFields(Template.instance());

});

Template.perfisEdit.helpers({
    perfisID() {
        return FlowRouter.getParam('_id');
    },
    perfiss() {

        updateFields(Template.instance());
    }
});

Template.perfisEdit.events({

    //Eventos do template de inserção

    'submit form' (event, template) {

        template = Template.instance();



        event.preventDefault();
        const id = FlowRouter.getParam('_id');
        const perfisData = {
            nome: template.find('[id="nome"]').value.trim(),
            endereco: template.find('[id="endereco"]').value.trim(),
            telefone: template.find('[id="telefone"]').value.trim(),
            Email: template.find('[id="Email"]').value.trim()
        };

        Meteor.call('perfis.update',id, perfisData, (error) => {
            if (error) {
                alert(error.reason);
            } else {
                FlowRouter.go('/perfisView/'+id);
            }
        });


    }




});

