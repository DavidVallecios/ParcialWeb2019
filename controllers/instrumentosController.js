var Instrumento = require('../models/instrumentos');
var debug = require('debug')('parcialweb:instrumentos_controller');

module.exports.getOne = (req, res, next) => {
    debug('Buscando instrumento', req.params);
    Instrumento.findOne({
        nombre: req.params.nombre
    })
    .then((foundInstrument) => {
        if(foundInstrument)
            return res.s
        else
            return res.status(400).json(null)
    })
    .catch(err => {
        next(err);
    })
}

module.exports.getAll = (req, res, next) => {
    var perPage = Number(req.query.size) || 10,
        page = req.query.page > 0 ? req.quert.page : 0;

    var sortProperty = req.query.sortby || "createdAt",
        sort = req.query.sort || "desc";
    
    debug('User List', {size:perPage,page, sortby:sortProperty,sort})

    Instrumento.find({})
        .limit(perPage)
        .skip(perPage * page)
        .sort({ [sortProperty]: sort})
        .then((instrumentos) => {
            return res.render('index', {
                ins: instrumentos
            })
        }).catch(err => {
            next(err)
        })
}

module.exports.register = (req, res, next) => {
    debug("Nuevo instrumento", {
        body: req.body
    });
    Instrumento.findOne({
        nombre: req.body.nombre
    })
    .then((foundInstrument) => {
        if(foundInstrument){
            debug("Instrumento duplicado");
            throw new Error(`Instrumento duplicado ${req.body.nombre}`);
        }else{
            let newInstrument = new Instrumento({
                nombre: req.body.nombre,
                tipo : req.body.tipo || "viento",
                marca: req.body.marca || "",
                precio: req.body.precio || 0
            });
            return newInstrument.save();
        }
    }).then(instrument => {
        return res
            .header('Location', '/instrumentos/' + instrument._id)
            .status(201)
            .json({
                ins: instrument
            });
    }).catch(err => {
        next(err);
    });
}

module.exports.update = (req, res, next) => {
    debug("Update instrument", {
        id: req.params.id,
        ...req.body
    });

    let update = {
        ...req.body
    }
    Instrumento.findOneAndUpdate({
        _id: req.params.id
    }, update, {
        new:true
    })
    .then((updated) => {
        if(updated)
            return res.status(200).json(updated);
        else
            return res.status(400).json(null);
    }).catch(err => {
        next(err);
    });
}

module.exports.delete = (req, res, next) => {
    debug("Delete instrument", {
        id: req.params.id,
    });

    Instrumento.findOneAndDelete({_id: req.params.id})
    .then((data) => {
        if(data) res.status(200).json(data);
        else res.status(404).send();
    }).catch(err => {
        next(err)
    })
}