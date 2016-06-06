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

    setTimeout(function() {

        var form = $("#example-form");

        form.children("div").steps({
            headerTag: "h3",
            bodyTag: "section",
            transitionEffect: "slideLeft",
            onStepChanged: function (event, currentIndex) {

                // se o formulario esta na ultima pagina
                if($('.last.current').length === 1) {

                    let candidato = $( "input[id^='form-candidato']:checked" ).val(),
                        bairro = $( "input[id^='form-bairro']:checked" ).val(),
                        faixaEtaria = $( "input[id^='form-faixaEtaria']:checked" ).val(),
                        faixaDeRenda = $( "input[id^='form-faixaDeRenda']:checked" ).val(),
                        sexo = $( "input[id^='form-sexo']:checked" ).val();

                    $('.confirmar').html(`Os dados abaixo estão corretos?<br><br>Candidato: ${candidato}<br><br>Bairro: ${bairro}<br><br>Faixa etária: ${faixaEtaria}<br><br>Faixa de renda: ${faixaDeRenda}<br><br>Sexo: ${sexo}`)

                }

            },
            onStepChanging: function (event, currentIndex, newIndex)
            {
                // Allways allow step back to the previous step even if the current step is not valid!
                if (currentIndex > newIndex)
                {
                    return true;
                }

                form.validate().settings.ignore = ":disabled,:hidden";
                return form.valid();
            },
            onFinishing: function (event, currentIndex)
            {
                form.validate().settings.ignore = ":disabled";
                return form.valid();
            },
            onFinished: function (event, currentIndex)
            {
                event.preventDefault();
            }
        });

    }, 100);

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
    'change .form-el' () {
        $($('[href="#next"]')[0]).click();
    },
    //Eventos do template de inserção

    'click [href="#finish"]' (event, template) {

        event.preventDefault();

        const entrevistaData = {
            candidato : $( "input[id^='form-candidato']:checked" ).val().trim(),
            bairro : $( "input[id^='form-bairro']:checked" ).val().trim(),
            faixaEtaria : $( "input[id^='form-faixaEtaria']:checked" ).val().trim(),
            faixaDeRenda : $( "input[id^='form-faixaDeRenda']:checked" ).val().trim(),
            sexo : $( "input[id^='form-sexo']:checked" ).val().trim()
        };

        console.log(entrevistaData)
        Meteor.call('entrevistas.insert', FlowRouter.getParam('pesquisaId'), entrevistaData, (error) => {
            if (error) {
                alert(error.reason);
            } else {

                Bert.alert( 'Entrevista realizada com sucesso!', 'success', 'growl-top-right');
                setTimeout(function() {
                    location.reload();
                },1000);
                //FlowRouter.go('/entrevistasList/' + FlowRouter.getParam('pesquisaId'));
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