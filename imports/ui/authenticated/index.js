import { Template } from 'meteor/templating';
import './index.html';
import {Documents} from '../../api/documents/documents'
import '../globals/page-heading.html';

let template;

Template.index.onCreated(() => {

    template = Template.instance();

    template.subscribe('Documents');

    template.documents = () => {
        return Documents.find();
    }

});

Template.index.helpers({
    'docs': () => {
        return template.documents();
    }
});
