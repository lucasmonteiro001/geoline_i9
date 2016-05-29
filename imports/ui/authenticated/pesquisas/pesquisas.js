import {Template} from 'meteor/templating';
import './pesquisas.html';
import '../../globals/page-heading.html';
import { Pesquisas } from '../../../api/pesquisas/pesquisas.js';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {Users} from '../../../api/users/users'


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

Template.pesquisasAdd.onCreated(function () {

    Template.instance().subscribe("Entrevistadores");

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

    let candidatos = $("#candidatos").tagging();
    let bairros = $("#bairros").tagging();

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

var updateFields = function(template) {

    var id = FlowRouter.getParam('_id');
    const pesquisass = Pesquisas.findOne({_id: id});
    if (pesquisass && template.view.isRendered) {

        template.find('[id="nome"]').value = pesquisass.nome;

        if(pesquisass.status) {
            document.getElementById("status-aberta").click()
        }
        else {
            document.getElementById("status-fechada").click();
        }

        template.find('[id="numMaxEntrevistados"]').value = pesquisass.numMaxEntrevistados;

    }

};

var updateSpans = function(template) {

    let id = FlowRouter.getParam('_id');

    const pesquisass = Pesquisas.findOne({_id: id});

    if (pesquisass && template.view.isRendered) {

        template.find('[id="nome"]').textContent = pesquisass.nome;
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
    Template.instance().subscribe('Pesquisas', FlowRouter.getParam('_id'));
    Template.instance().subscribe('Entrevistadores');
});

Template.pesquisasView.onRendered(() => {
    let id = FlowRouter.getParam('_id');
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

Template.pesquisasEdit.onCreated(function () {

    let template = Template.instance();

    template.subscribe('Pesquisas', {

        onReady: function() {

            template.pesquisa = Pesquisas.findOne({_id: FlowRouter.getParam('_id')});

            template.subscribe("Entrevistadores", {

                onReady: function() {

                    template.entrevistadores = () => {
                        return Users.find({roles: "entrevistador", _id: { $in : template.pesquisa.entrevistadores}});
                    };

                    template.autorun(function () {

                        let entrevistadores = template.entrevistadores().fetch();

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
                                allowTabOut: true,
                                prePopulate: entrevistadores
                            }
                        );
                    });
                }
            });


        }
    });


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