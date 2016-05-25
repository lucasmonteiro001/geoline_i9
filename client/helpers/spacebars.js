    /**
     * Created by lucas on 5/5/16.
     */

    Template.registerHelper('arrayify',function(obj){
        result = [];
        for (var key in obj) result.push({name:key,value:obj[key]});
        return result;
    });

    Template.registerHelper('arrayifyUserEmails',function(obj){
        result = [];
        for (var key in obj) result.push({address:obj[key]["address"],verified:obj[key]["verified"]});
        return result;
    });
