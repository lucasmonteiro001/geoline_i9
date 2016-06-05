import { Perfis } from "../perfis.js"

Meteor.publish( 'perfis', function(){
    var user = this.userId;

    if ( user ) {
        var data = [
            Perfis.find( )
        ];
    }

    if ( data ) {
        return data;
    }

    return this.ready();
});