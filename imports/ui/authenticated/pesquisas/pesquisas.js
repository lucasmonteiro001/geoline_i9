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

    $("form").validate({
        // errorLabelContainer: $(".error"),
        // wrapper: 'li'
        errorPlacement: function(error, element) {
            // Append error within linked label
            $( element )
                .closest( "form" )
                .find( "label[for='" + element.attr( "name" ) + "']" )
                .append( error );
        },
        errorElement: "span",
    });
});

Template.pesquisasAdd.events({

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

        confirm("Tem certeza?")

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

Template.pesquisasView.onCreated(() => {

    let template = Template.instance();

    template.id = FlowRouter.getParam('_id');

    template.subscribe('Pesquisas', {_id: template.id});

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

        let entrevistadoresNome;

        if(entrevistadores) {
            entrevistadoresNome = entrevistadores.map(function(val) {
                return val.nome;
            });
        }

        return entrevistadoresNome;
    }

});

Template.pesquisasView.events({

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

Template.pesquisasEdit.onCreated(function () {

    let template = Template.instance();

    template.contemEntrevistas = new ReactiveVar(false);

    template.subscribe('Pesquisas', {_id: FlowRouter.getParam('_id')}, {

        onReady: function() {

            template.subscribe("Users", SUB_ENTREVISTADOR.filter, SUB_ENTREVISTADOR.projection,
                {
                    onReady: function() {

                        template.autorun(function () {

                            template.pesquisa = Pesquisas.findOne({_id: FlowRouter.getParam('_id')});

                            if(template.pesquisa.entrevistas) {

                                if(template.pesquisa.entrevistas.length > 0) {
                                    template.contemEntrevistas.set(true);
                                }
                                else {
                                    template.contemEntrevistas.set(false);
                                }

                            }

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

                        });
                    }
                });


        }
    });


});

Template.pesquisasEdit.onRendered(function() {

    let template = Template.instance();

    setTimeout(function(){

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


    },150)

});

Template.pesquisasEdit.helpers({
    pesquisasID() {
        return FlowRouter.getParam('_id');
    },
    candidatos() {
        return Template.instance().pesquisa.candidatos || [];
    },
    bairros() {
        return Template.instance().pesquisa.bairros || [];
    },
    contemEntrevistas() {

        return Template.instance().contemEntrevistas.get();
    }
});

Template.pesquisasEdit.events({

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

        // se nao eh possivel alterar os candidatos
        if(!candidatos) {

            candidatos = [];

            let arrayCandidatos = document.getElementsByName('candidato');

            $.each(arrayCandidatos, function(i, val) {
                candidatos.push($(val).text());
            })
        }

        // se nao eh possivel alterar os candidatos
        if(!bairros) {

            bairros = [];

            let arrayBairro = document.getElementsByName('bairro');

            $.each(arrayBairro, function(i, val) {
                bairros.push($(val).text());
            })
        }



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
                {key: 'entrevistas', label: '# de entrevistados', fn: function(val) {
                    if(!val) return 0;
                    return val.length;
                }},
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
    },
});

Template.perfisRelatorio.onCreated(() => {

    let template = Template.instance();

    template.subscribe("Pesquisas", {_id: FlowRouter.getParam("_id")});

    template.pesquisa = Pesquisas.find();

    template.perfis = new ReactiveVar({});

    template.autorun(function() {

        let pesquisa = template.pesquisa.fetch()[0];

        if(pesquisa) {

            let perfisMapa = [{}];

            // percorre cada pesquisa para descobrir quais perfis ja foram preenchidos
            if(pesquisa.entrevistas) {

                pesquisa.entrevistas.forEach(function(entrevista) {

                    if(pesquisa.perfis) {

                        // para cada perfil, analisa se ele possui todas as chaves da pesquisa
                        pesquisa.perfis.forEach(function (perfil) {

                            if (perfil.faixaEtaria === entrevista.faixaEtaria
                                && perfil.faixaDeRenda === entrevista.faixaDeRenda
                                && perfil.sexo === entrevista.sexo) {

                                let key = `faixaEtaria:${perfil.faixaEtaria};faixaDeRenda:${perfil.faixaDeRenda};sexo:${perfil.sexo};meta:${perfil.quantidade}`;

                                // se o perfil ja nao foi analisado
                                if (perfisMapa[key]) {
                                    perfisMapa[key].add(entrevista._id);
                                } else {
                                    perfisMapa[key] = new Set();
                                    perfisMapa[key].add(entrevista._id);
                                }


                            }

                        });
                    }

                });

                template.perfis.set(perfisMapa);

            }
        }
    });

});

Template.perfisRelatorio.helpers({
    'settings': function () {

        let perfis = Template.instance().perfis.get();
        let perfisImpressao = [];
        let perfilFinal = [];

        if(perfis) {

            for(let key in perfis) {

                // descarta a key 0
                if(key !== "0") {

                    let attrs = key.split(";");

                    //se o tamanho for igual a 1, quer dizer que nao ha registro de perfil relacionado
                    if(attrs.length === 1) {
                        perfisImpressao[key] =
                            {faixaEtaria: "não registrado", faixaDeRenda: "não registrado",
                                sexo: "não registrado" , meta:"não registrado", quantidade: perfis[key].size};
                    }
                    else {
                        perfisImpressao[key] =
                            {faixaEtaria: attrs[0].split(":")[1], faixaDeRenda: attrs[1].split(":")[1],
                                sexo: attrs[2].split(":")[1], meta:parseInt(attrs[3].split(":")[1]), quantidade: perfis[key].size};
                    }

                }

            }

            let votosRegistrados = 0;

            let pesquisa = Template.instance().pesquisa.fetch()[0];

            if(pesquisa) {

                if(pesquisa.perfis) {

                    pesquisa.perfis.forEach(function (perfil) {

                        let key = `faixaEtaria:${perfil.faixaEtaria};faixaDeRenda:${perfil.faixaDeRenda};sexo:${perfil.sexo};meta:${perfil.quantidade}`;

                        // se ha alguma entrevista relacionada ao perfil
                        if (perfisImpressao[key]) {
                            perfilFinal.push({
                                faixaEtaria: perfil.faixaEtaria, faixaDeRenda: perfil.faixaDeRenda,
                                sexo: perfil.sexo, meta: perfil.quantidade, quantidade: perfisImpressao[key].quantidade
                            });

                            votosRegistrados += perfisImpressao[key].quantidade;
                        }
                        // se nao existe entrevista, tudo eh zero
                        else {
                            perfilFinal.push({
                                faixaEtaria: perfil.faixaEtaria, faixaDeRenda: perfil.faixaDeRenda,
                                sexo: perfil.sexo, meta: perfil.quantidade, quantidade: 0
                            });
                        }

                    });
                }

                // verifica se exsite entrevistas
                if(pesquisa.entrevistas) {

                    // coloca os votos nao registrados
                    perfilFinal.push({
                        faixaEtaria: "não registrado", faixaDeRenda: "não registrado",
                        sexo: "não registrado", meta: "não registrado",
                        quantidade: pesquisa.entrevistas.length - votosRegistrados
                    });
                }
            }

        }

        return {
            collection: perfilFinal || [],
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            showColumnToggles: true,
            multiColumnSort: true,
            fields: [
                {key:'faixaEtaria', label:'Faixa Etária'},
                {key:'faixaDeRenda', label:'Faixa de Renda'},
                {key:'sexo', label:'Sexo'},
                {key:'quantidade', label:'Quantidade de votos'},
                {key:'meta', label:'Meta'},
            ]
        };
    }

});