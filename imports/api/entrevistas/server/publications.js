import { Entrevistas } from "../entrevistas.js"

Meteor.publish( 'entrevistas', function(){
    var user = this.userId;

    if ( user ) {
        var data = [
            Entrevistas.find( )
        ];
    }

    if ( data ) {
        return data;
    }

    return this.ready();
});