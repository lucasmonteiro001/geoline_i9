import {Template} from 'meteor/templating';
import './entrevistas.html';
import '../../globals/page-heading.html';
import { Entrevistas } from '../../../api/entrevistas/entrevistas.js'
import {FlowRouter} from 'meteor/kadira:flow-router';


let template;

Template.entrevistas.onCreated(() => {

    //Faz alguma coisa ao criar o template

});



Template.entrevistas.helpers({

});

Template.entrevistasAdd.onCreated(() => {

    //Faz alguma coisa ao criar o template de inserção

});



Template.entrevistasAdd.events({

    //Eventos do template de inserção

    'submit form' (event, template) {

        template = Template.instance();



            event.preventDefault();

            const entrevistasData = {
               userId: '',
                nome: template.find('[id="nome"]').value.trim(),
endereco: template.find('[id="endereco"]').value.trim(),
telefone: template.find('[id="telefone"]').value.trim(),
Email: template.find('[id="Email"]').value.trim()
            };

                Meteor.call('entrevistas.insert', entrevistasData, (error) => {
                    if (error) {
                        alert(error.reason);
                    } else {

                        FlowRouter.go('entrevistas');
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
    Meteor.subscribe('entrevistas');

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
    
    
    Meteor.subscribe('entrevistas');

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




Template.entrevistasList.onCreated(() => {

    Meteor.subscribe('entrevistas');



});

Template.entrevistasList.helpers({
    entrevistass() {
        const entrevistass = Entrevistas.find();
        if ( entrevistass ) {
            return entrevistass;
        }
    },
    'settings': function () {
        return {
            collection: Entrevistas,
            rowsPerPage: 10,
            showFilter: true,
            showRowCount: true,
            showColumnToggles: true,
            multiColumnSort: true,
            fields: [
                {key:'nome', label:'Informe um nome', tmpl: Template.entrevistasTmpl},
{key:'endereco', label:'Informe o Endere�o'},
{key:'telefone', label:'Telefone/Cel:'},
{key:'Email', label:'Meu Email'}
            ]
        };
    }
});

