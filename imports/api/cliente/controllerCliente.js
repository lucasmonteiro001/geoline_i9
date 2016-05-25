import {Cliente} from './cliente'

class controllerCliente {

    constructor() {
        console.log("Iniciou...");
    }

    getClientes() {
        const clientes = Cliente.find();
        if (clientes) {
            return clientes;
        }
    };

    getCollection() {
        return Cliente

    }

    getCliente(id) {
        return Cliente.findOne(id);
    }
    
    insert(clienteData, callback) {
        Meteor.call('cliente.insert', clienteData, (error, result) => {
            if (error) {
                callback(error, null)
            } else {
                callback(null, result)
            }
        });
    }

    update(id, clienteData, callback) {
        Meteor.call('cliente.update', id, clienteData, (error) => {
            if (error) {
                callback(error.reason, null)
            } else {
                callback(null, "ok")
            }
        });
    }

    delete(id, callback) {
        Meteor.call('cliente.delete', id, (error) => {
            if (error) {
                callback(error.reason, null)
            } else {
                callback(null, "ok")
            }
        });
    }


}


export const CtrlCliente = new controllerCliente();