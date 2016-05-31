import {Template} from 'meteor/templating';
import './pesquisas.html';
import '../../globals/page-heading.html';
import { Pesquisas } from '../../../api/pesquisas/pesquisas.js';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Users} from '../../../api/users/users';
import { ReactiveVar } from 'meteor/reactive-var';


let template;

const TAG_CONFIG = {
    "no-spacebar":true,
    "case-sensitive":true
};

const SUB_ENTREVISTADOR = {
    filter : {
        roles: "entrevistador"
    },
    projection: {
        fields: { _id: 1, emails: 1, roles: 1, nome: 1 }
    },
    projectionNome: {
        fields: { _id: 1, nome: 1 }
    }
}

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

Template.pesquisasAdd.onCreated(function () {

    Template.instance().subscribe("Users", SUB_ENTREVISTADOR.filter, SUB_ENTREVISTADOR.projection);

    Template.instance().entrevistadores = () => {
        return Users.find({roles: "entrevistador"});
    }

    this.autorun(function () {

        let entrevistadores = Template.instance().entrevistadores().fetch();

        $(".token-input-list-custom").remove();

        $("#entrevistadores").tokenInput(
            entrevistadores,
            {
                propertyToSearch: "nome",
                theme: "custom",
                hintText: "Pesquise pelo nome",
                noResultsText: "Nenhum resultado encontrado",
                searchingText: "Procurando...",
                minChars: 3,
                resultsFormatter:
                    function(item){
                        return '<li>' + item.nome + '</li>'
                    },
                tokenFormatter:
                    function(item){
                        return '<li><p>' +  item.nome + '</p></li>'
                    },
                preventDuplicates: true,
                tokenValue: "_id",
                allowTabOut: true
            }
        );
    });

});

Template.pesquisasAdd.onRendered(() => {

    let candidatos = $("#candidatos").tagging(TAG_CONFIG);
    let bairros = $("#bairros").tagging(TAG_CONFIG);

    $tag_box = candidatos[0];
    $tag = bairros[0];

    $tag_box.on( "remove:after", function ( el, text, tagging ) {

        // limpa a zona de insercao
        $('.type-zone').val("");

    });

    $tag.on( "remove:after", function ( el, text, tagging ) {

        // limpa a zona de insercao
        $('.type-zone').val("");

    });
});

Template.pesquisasAdd.events({

    //Eventos do template de inserção

    'submit form' (event, template) {

        template = Template.instance();


        event.preventDefault();

        let nome                = $('[name="nome"]').val(),
            status              = $('[name="status"]:checked').val(),
            numMaxEntrevistados = parseInt($('[name="numMaxEntrevistados"]').val()),
            entrevistadores     = $('#entrevistadores').tokenInput("get"),
            dataInicio          = $('[name="dataInicio"]').val(),
            dataFim             = $('[name="dataFim"]').val(),
            candidatos          = $('#candidatos').tagging( "getTags" ),
            bairros             = $('#bairros').tagging( "getTags" );


        // valor booleano para saber se a pesquisa esta aberta ou fechada
        (status === "aberta") ? (status = true) : (status = false);

        dataInicio = new Date(dataInicio);

        dataFim = new Date(dataFim);

        // salva no array de entrevistadores a id de cada objeto
        entrevistadores = entrevistadores.map(function (val) {
            return val.ID;
        })

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

//=============== FIM PESQUISAS ADD ==================//


//=============== INICIO PESQUISAS VIEW ==================//

var updateSpans = function(template) {

    let id = FlowRouter.getParam('_id');

    const pesquisass = Pesquisas.findOne({_id: id});

    if (pesquisass && template.view.isRendered) {

        // template.find('[id="nome"]').textContent = pesquisass.nome;
        template.find('[id="status"]').textContent = (pesquisass.status) ? "Aberta" : "Fechada";
        template.find('[id="numMaxEntrevistados"]').textContent = pesquisass.numMaxEntrevistados;
        template.find('[id="entrevistadores"]').textContent =
            pesquisass.entrevistadores.map(function(val) {
                let entrevistador = Users.findOne({_id: val});
                return entrevistador.nome;
            }).join(", ");
        template.find('[id="candidatos"]').textContent = pesquisass.candidatos.join(", ");
        template.find('[id="bairros"]').textContent = pesquisass.bairros.join(", ");

    }

}

Template.pesquisasView.onCreated(() => {

    let template = Template.instance();

    template.id = FlowRouter.getParam('_id');

    template.subscribe('Pesquisas', template.id);

    template.subscribe("Users", SUB_ENTREVISTADOR.filter, SUB_ENTREVISTADOR.projectionNome);

    template.pesquisa = Pesquisas.find({_id: template.id});

    template.entrevistadores = new ReactiveVar([]);

    template.autorun(function () {

        let pesquisa = template.pesquisa.fetch()[0];

        if(pesquisa) {

            template.entrevistadores.set(pesquisa.entrevistadores);
        }

    })

});

Template.pesquisasView.onRendered(() => {
    let id = FlowRouter.getParam('_id');
    Template.instance().pesquisasNome = "";
    Template.instance().pesquisasID = id;
    // updateSpans(Template.instance());

});

Template.pesquisasView.helpers({
    pesquisasID () {
        return FlowRouter.getParam('_id');
    },
    pesquisa () {

        return Template.instance().pesquisa;
    },
    entrevistadores () {

        let entrevistadores = Users.find({
            _id: { $in: Template.instance().entrevistadores.get()
            }}).fetch();

        let entrevistadoresNome = entrevistadores.map(function(val) {
               return val.nome;
            });

        return entrevistadoresNome;
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

var updateFields = function(template) {


    if (template.view.isRendered) {

        document.getElementById("nome").value = template.pesquisa.nome;

        if(template.pesquisa.status) {
            document.getElementById("status-aberta").click()
        }
        else {
            document.getElementById("status-fechada").click();
        }

        document.getElementById("numMaxEntrevistados").value = template.pesquisa.numMaxEntrevistados;

        let candidatos = $("#candidatos"), bairros = $("#bairros");

        // se os boxes de tag nao foram instanciados
        if($('.tagging').length === 0) {
            candidatos = $("#candidatos").tagging(TAG_CONFIG);
            bairros = $("#bairros").tagging(TAG_CONFIG);
        }

        let candidatos_box = candidatos[0],
            bairros_box = bairros[0];

        $(candidatos_box).tagging("removeAll");
        $(candidatos_box).tagging( "add", template.pesquisa.candidatos );
        $(candidatos_box).on( "remove:after", function () {
            // limpa a zona de insercao
            $('.type-zone').tagging("emptyInput");
        });

        $(bairros_box).tagging("removeAll");
        $(bairros_box).tagging( "add", template.pesquisa.bairros );
        $(bairros_box).on( "remove:after", function () {
            // limpa a zona de insercao
            $('.type-zone').tagging("emptyInput");

        });
    }
};

Template.pesquisasEdit.onCreated(function () {

    let template = Template.instance();

    template.subscribe('Pesquisas', FlowRouter.getParam('_id'), {

        onReady: function() {

            template.subscribe("Users", SUB_ENTREVISTADOR.filter, SUB_ENTREVISTADOR.projection,
                {
                    onReady: function() {

                        template.autorun(function () {

                            console.log("Rodou o this!");

                            template.pesquisa = Pesquisas.findOne({_id: FlowRouter.getParam('_id')});

                            template.entrevistadoresSelecionados =
                                Users.find({roles: "entrevistador", _id: { $in : template.pesquisa.entrevistadores}}).fetch();

                            template.entrevistadores = Users.find({roles: "entrevistador"}).fetch();

                            $(".token-input-list-custom").remove();

                            $("#entrevistadores").tokenInput(
                                template.entrevistadores,
                                {
                                    propertyToSearch: "nome",
                                    theme: "custom",
                                    hintText: "Pesquise pelo nome",
                                    noResultsText: "Nenhum resultado encontrado",
                                    searchingText: "Procurando...",
                                    minChars: 3,
                                    resultsFormatter:
                                        function(item){
                                            return '<li>' + item.nome + '</li>'
                                        },
                                    tokenFormatter:
                                        function(item){
                                            return '<li><p>' +  item.nome + '</p></li>'
                                        },
                                    preventDuplicates: true,
                                    tokenValue: "_id",
                                    allowTabOut: true,
                                    prePopulate: template.entrevistadoresSelecionados
                                }
                            );

                            updateFields(template);
                        });
                    }
                });


        }
    });


});

Template.pesquisasEdit.onRendered(() => {
    // updateFields(Template.instance());

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

        event.preventDefault();

        template = Template.instance();


        let id                  = FlowRouter.getParam('_id'),
            nome                = $('[name="nome"]').val(),
            status              = $('[name="status"]:checked').val(),
            numMaxEntrevistados = parseInt($('[name="numMaxEntrevistados"]').val()),
            entrevistadores     = $('#entrevistadores').tokenInput("get"),
            dataInicio          = $('[name="dataInicio"]').val(),
            dataFim             = $('[name="dataFim"]').val(),
            candidatos          = $('#candidatos').tagging( "getTags" ),
            bairros             = $('#bairros').tagging( "getTags" );


        // valor booleano para saber se a pesquisa esta aberta ou fechada
        (status === "aberta") ? (status = true) : (status = false);


        //TODO consertar as datas
        dataInicio = new Date();

        dataFim = new Date();

        // salva no array de entrevistadores a id de cada objeto
        entrevistadores = entrevistadores.map(function (val) {
            return val.ID;
        })

        const pesquisasData = {
            nome: nome,
            status: status,
            numMaxEntrevistados: numMaxEntrevistados,
            entrevistadores:entrevistadores,
            candidatos:candidatos,
            bairros:bairros,
            dataInicio: dataInicio,
            dataFim: dataFim
        };

        Meteor.call('pesquisas.update', id, pesquisasData, (error) => {

            if (error) {

                alert(error.reason);
            }
            else {

                FlowRouter.go('pesquisas');
            }
        });

    }

});

//=============== FIM PESQUISAS EDIT ==================//


//=============== INICIO PESQUISAS LIST ==================//

Template.pesquisasList.onCreated(() => {

    Template.instance().subscribe('Pesquisas');

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
                {key:'nome', label:'Pesquisa', tmpl: Template.pesquisasTmpl},
                {key:'status', label:'Status', fn: function(val) {
                    if(val)
                        return "Aberta";
                    else
                        return "Fechada";
                }},
                {key:'numMaxEntrevistados', label:'# máximo de entrevistados'},
                {key:'entrevistadores', label:'# de entrevistadores associados', fn: function(val) {
                    return val.length;
                }},
                {key:'candidatos', label:'# de candidatos incluídos na pesquisa', fn: function(val) {
                    return val.length;
                }},
                {key:'bairros', label:'# de bairros incluídos na pesquisa', fn: function(val) {
                    return val.length;
                }}
            ]
        };
    }
});

//=============== FIM PESQUISAS LIST ==================//