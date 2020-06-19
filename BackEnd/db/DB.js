const mongoose = require("./mongodb-connection")

class DB{
    async query(query, projection={}, options={}){
        // console.log(query, projection, options);
        return await this._model.find(query, projection, options);
    }

    async queryOne(query, projection={}, options={}){
        return await this._model.findOne(query, projection, options);
    }

    async update(query, dataObject){
        return await this._model.findOneAndUpdate(query, {$set: dataObject},{useFindAndModify: false, new:true})
    }
    
    async updateMany(query, dataObject){
        return await this._model.updateMany(query, {$set: dataObject})
    }

    async exists(query){
        let doc = await this.queryOne(query)
        if(doc) return true
        else return false
    }

    async add(document){
        let documentoGuardar = this._model(document)
         return await documentoGuardar.save()
         
    }

    async delete(document){
        let doc = await this._model.findOneAndDelete(document)
        if(doc) return doc
        else return false
    }
}

module.exports = DB;