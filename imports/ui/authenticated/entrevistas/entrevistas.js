import { Template } from 'meteor/templating';
import './entrevistas.html';
import '../../globals/page-heading.html';
import { Entrevistas } from '../../../api/entrevistas/entrevistas.js'
import { Pesquisas } from '../../../api/pesquisas/pesquisas';
import {FlowRouter} from 'meteor/kadira:flow-router';

Template.entrevistasAdd.onCreated(() => {

    let template = Template.instance();

    template.pesquisaId = FlowRouter.getParam('pesquisaId');

    template.subscribe('Pesquisas',
        {_id: template.pesquisaId, entrevistadores: Meteor.userId()},
        {entrevistas: 0});

    template.pesquisa = Pesquisas.find({_id: template.pesquisaId});

    template.estaFechada = new ReactiveVar(false);

    template.autorun(function() {
        if(template.pesquisa) {

            let pesquisa = template.pesquisa.fetch()[0];

            if(pesquisa) {
                template.estaFechada.set(pesquisa.status);
                // se a pesquisa esta fechada
                if(pesquisa.status === false) {
                    Bert.alert( 'Pesquisa fechada para novas entrevistas!', 'danger', 'growl-top-right');
                    FlowRouter.go('/entrevistasList/' + template.pesquisaId);
                }
            }

        }
    });

});

Template.entrevistasAdd.helpers({
    'pesquisaId': () => {
        return FlowRouter.getParam('pesquisaId');
    },
    'pesquisa': () => {
        return Template.instance().pesquisa;
    },
    'pesquisaNome': () => {
        if(Template.instance().pesquisa.fetch().length > 0 ) {
            return Template.instance().pesquisa.fetch()[0].nome;
        }
        return 'Não carregada ainda';
    },
    'entrevistasList': () => {
        return FlowRouter.path('entrevistasList') + '/' +  FlowRouter.getParam('pesquisaId');
    }
});

Template.entrevistasAdd.events({
    'click .fa.fa-arrow-left' (event) {
        // se algum dado ja foi preenchido
        if($('input:checked').length > 0) {

            // se o usuario cancelar, permanece na mesma pagina
            if(!confirm('Deseja cancelar a entrevista atual e voltar para a página de entrevistas?')) {
                event.preventDefault();
            }
            else {
                FlowRouter.go('/entrevistasList/' +  FlowRouter.getParam('pesquisaId'));
            }
        }
        else {
            FlowRouter.go('/entrevistasList/' +  FlowRouter.getParam('pesquisaId'));
        }
    },
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

Template.entrevistasAdd.onRendered(() => {

    $('form').validate({
        rules: {
            'candidato' : 'required',
            'bairro' : 'required',
            'faixaEtaria' : 'required',
            'faixaDeRenda' : 'required',
            'sexo' : 'required'
        }
    });

    let renderForm = (function() {

        var form = $('form');

        form.children("div").steps({
            headerTag: "h3",
            bodyTag: "section",
            transitionEffect: "slide",
            stepsOrientation: "vertical",
            enableKeyNavigation: false,
            onStepChanged: function (event, currentIndex) {

                // se o formulario esta na ultima pagina
                if($('.last.current').length === 1) {

                    let candidato = $( "input[id^='form-candidato']:checked" ).val(),
                        bairro = $( "input[id^='form-bairro']:checked" ).val(),
                        faixaEtaria = $( "input[id^='form-faixaEtaria']:checked" ).val(),
                        faixaDeRenda = $( "input[id^='form-faixaDeRenda']:checked" ).val(),
                        sexo = $( "input[id^='form-sexo']:checked" ).val();

                    $('.confirmar').html(`Candidato: ${candidato}<br>Bairro: ${bairro}<br>Faixa etária: ${faixaEtaria}<br>Faixa de renda: ${faixaDeRenda}<br>Sexo: ${sexo}`)

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
            },
            labels: {
                cancel: "Cancelar",
                current: "passo atual:",
                pagination: "Paginação",
                finish: "Salvar e enviar",
                next: "Próximo",
                previous: "Anterior",
                loading: "Carregando ..."
            }
        });
    });

    setTimeout(function() {
        renderForm();
        $('form').css("display", "block")
    }, 1000);

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