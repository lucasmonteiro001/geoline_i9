import { Documents } from '../documents';
import './methods';

Meteor.publish('Documents', () => {
    return Documents.find();
});
