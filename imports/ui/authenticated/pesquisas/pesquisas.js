import {Template} from 'meteor/templating';
import './pesquisas.html';
import '../../globals/page-heading.html';
import { Pesquisas } from '../../../api/pesquisas/pesquisas.js'
import {FlowRouter} from 'meteor/kadira:flow-router';


let template;

//=============== INICIO PESQUISAS ==================//

Template.pesquisas.onCreated(() => {

    template = Template.instance();

    template.subscribe('Pesquisas');


    template.pesquisas = () => {
        return Pesquisas.find();
    };


});



Template.pesquisas.helpers({

});

//=============== FIM PESQUISAS ==================//


//=============== INICIO PESQUISAS ADD ==================//

Template.pesquisasAdd.onCreated(() => {

    //Faz alguma coisa ao criar o template de inserção

});



Template.pesquisasAdd.events({

    //Eventos do template de inserção

    'submit form' (event, template) {

        template = Template.instance();
        

        event.preventDefault();

        let nome = $('[name="nome"]').val(),
            status = $('[name="status"]:checked').val(),
            numMaxEntrevistados = $('[name="numMaxEntrevistados"]').val(),
            // entrevistadores = $('#entrevistadores').tokenInput("get"),
            entrevistadores = ["algum"],
            candidatos = $('[name="candidatos"]:checked').map(function(i, val) {
                return $(val).val()
            }),
            bairros = $('[name="bairros"]:checked').map(function(i, val) {
                return $(val).val()
            }),
            dataInicio = $('[name="dataInicio"]').val(),
            dataFim = $('[name="dataFim"]').val();

        candidatos = candidatos.toArray();
        bairros = bairros.toArray();

        const pesquisasData = {
            nome: nome,
            status: status,
            numMaxEntrevistados: numMaxEntrevistados,
            entrevistadores:entrevistadores,
            candidatos:candidatos,
            bairros:bairros,
            dataInicio: dataInicio,
            dataFim: dataFim
        }

        Meteor.call('pesquisas.insert', pesquisasData, (error) => {

            if (error) {

                alert(error.reason);
            }
            else {

                FlowRouter.go('pesquisas');
            }
        });



    }




});

var updateFields = function(template) {

    var id = FlowRouter.getParam('_id');
    const pesquisass = Pesquisas.findOne({_id: id});
    if (pesquisass && template.view.isRendered) {
        template.find('[id="nomeObjeto"]').textContent = pesquisass.nome;
        template.find('[id="bc-nomeObjeto"]').textContent = pesquisass.nome;
        template.find('[id="nome"]').value = pesquisass.nome;
        template.find('[id="endereco"]').value = pesquisass.endereco;
        template.find('[id="telefone"]').value = pesquisass.telefone;
        template.find('[id="Email"]').value = pesquisass.Email;
    }

};

var updateSpans = function(template) {

    var id = FlowRouter.getParam('_id');
    const pesquisass = Pesquisas.findOne({_id: id});
    if (pesquisass && template.view.isRendered) {
        template.find('[id="nomeObjeto"]').textContent = pesquisass.nome;
        template.find('[id="bc-nomeObjeto"]').textContent = pesquisass.nome;
        template.find('[id="nome"]').textContent = pesquisass.nome;
        template.find('[id="endereco"]').textContent = pesquisass.endereco;
        template.find('[id="telefone"]').textContent = pesquisass.telefone;
        template.find('[id="Email"]').textContent = pesquisass.Email;

    }

}

//=============== FIM PESQUISAS ADD ==================//


//=============== INICIO PESQUISAS VIEW ==================//

Template.pesquisasView.onCreated(() => {
    Meteor.subscribe('Pesquisas');

});

Template.pesquisasView.onRendered(() => {
    var id = FlowRouter.getParam('_id');
    Template.instance().pesquisasNome = "";
    Template.instance().pesquisasID = id;
    updateSpans(Template.instance());

});

Template.pesquisasView.helpers({
    pesquisasID() {
        return FlowRouter.getParam('_id');
    },
    pesquisass() {

        updateSpans(Template.instance());
    }
});

Template.pesquisasView.events({

    //Eventos do template de inserção

    'click #linkExcluir' (event, template) {

        var sel = event.target;
        var id = sel.getAttribute('value');

        Meteor.call('pesquisas.delete',id, (error) => {
            if (error) {
                alert(error.reason);
            } else {
                FlowRouter.go('pesquisas');
            }
        });


    }

});

//=============== FIM PESQUISAS VIEW ==================//


//=============== INICIO PESQUISAS EDIT ==================//

Template.pesquisasEdit.onCreated(() => {

    template = Template.instance();


    Meteor.subscribe('pesquisas');

});

Template.pesquisasEdit.onRendered(() => {
    updateFields(Template.instance());

});

Template.pesquisasEdit.helpers({
    pesquisasID() {
        return FlowRouter.getParam('_id');
    },
    pesquisass() {

        updateFields(Template.instance());
    }
});

Template.pesquisasEdit.events({

    //Eventos do template de inserção

    'submit form' (event, template) {

        template = Template.instance();



        event.preventDefault();
        const id = FlowRouter.getParam('_id');
        const pesquisasData = {
            nome: template.find('[id="nome"]').value.trim(),
            endereco: template.find('[id="endereco"]').value.trim(),
            telefone: template.find('[id="telefone"]').value.trim(),
            Email: template.find('[id="Email"]').value.trim()
        };

        Meteor.call('pesquisas.update',id, pesquisasData, (error) => {
            if (error) {
                alert(error.reason);
            } else {
                FlowRouter.go('/pesquisasView/'+id);
            }
        });


    }

});

//=============== FIM PESQUISAS EDIT ==================//


//=============== INICIO PESQUISAS LIST ==================//

Template.pesquisasList.onCreated(() => {

    Meteor.subscribe('Pesquisas');



});

Template.pesquisasList.helpers({
    pesquisass() {
        const pesquisass = Pesquisas.find();
        if ( pesquisass ) {
            return pesquisass;
        }
    },
    'settings': function () {
        return {
            collection: Pesquisas,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            showColumnToggles: true,
            multiColumnSort: true,
            fields: [
                {key:'nome', label:'Informe um nome', tmpl: Template.pesquisasTmpl},
                {key:'endereco', label:'Informe o Endere�o'},
                {key:'telefone', label:'Telefone/Cel:'},
                {key:'Email', label:'Meu Email'}
            ]
        };
    }
});

//=============== FIM PESQUISAS LIST ==================//