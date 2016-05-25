import { Pesquisas } from "../pesquisas.js"

Meteor.publish( 'Pesquisas', function(){
    var user = this.userId;

    if ( user ) {
        var data = [
            Pesquisas.find( )
        ];
    }

    if ( data ) {
        return data;
    }

    return this.ready();
});