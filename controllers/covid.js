const { result } = require('lodash');
var resultEnum = require('../enums/resultadoEstudio');
var filtersEnum = require('../enums/filters');

var studyService = require('../services/study');


module.exports.insert = insert;
module.exports.getStats = getStats;
module.exports.getAll = getAll;
module.exports.search = search;
module.exports.test = test;


function getStats(req, res, next) {
    studyService.getStats(resultEnum.NO_INFECTED,function (err, noIfectedCount) {
        if (err)
            return next(err);
         
            studyService.getStats(resultEnum.INFECTED,function (err, infectedCount) {
                if (err)
                    return next(err);
                    studyService.getStats(resultEnum.INFECTED_IMMUNE,function (err, immuneCount) {
                        if (err)
                            return next(err);
                
                          
                        return res.json({
                            "healthy": noIfectedCount,
                            "infected": infectedCount,
                            "immune": immuneCount
                        });
                    });            
                });
          
    });
}

function test(req, res, next) {
        return res.json({ message:"vivo"});
}
function getAll(req, res, next) {
    studyService.getAll(function (err, studies) {
        if (err)
            return next(err);

        response = { results : studies};    
        return res.json(response);
    });
}
function search(req, res, next) {

    var valuesSearch;
    var keySearch;
    switch(req.query.key){
        case  filtersEnum.RESULT:
            valuesSearch = req.query.values.split(",");
            valuesSearch = valuesSearch.map(function(value){
                return parseInt(value); //convierto el array a int para la query
            });
            keySearch = filtersEnum.RESULT;
        break; 
        case  filtersEnum.COUNTRY:
            valuesSearch = req.query.values.split(",");
            keySearch = filtersEnum.COUNTRY;
        break; 
        }
        studyService.getByKey(keySearch,valuesSearch,function (err, studies) {
            if (err)
                return next(err);
    
            response = { results : studies};    
            return res.json(response);
        });
    



    
}
function validateDna(dnaArray){
    var valida = true;
    if(!dnaArray || dnaArray.length == 0){
      valida = false;
    }
    else{
      dnaArray.forEach(element => {
          if(element.length != dnaArray.length){
            valida = false;
          }
      });
    }
    return valida;

  }
async function insert(req, res, next) {
    var estudio = req.body;

    if(validateDna(estudio.dna)){
        var adnArray = estudio.dna;

        var cantCuartetos = await contarCuartetos(adnArray);
        var result;
        if(cantCuartetos < 2){
            result = resultEnum.NO_INFECTED;
        }
    
        else if(cantCuartetos >= 2 && cantCuartetos < 4 ){
            result = resultEnum.INFECTED;
        }
        else{
            result = resultEnum.INFECTED_IMMUNE;
    
        }
        estudio.result = result;
        studyService.insert(estudio, function (err, study) {
            if (err)
                return next(err);
            
            return res.json({ study: study });
        });
    
    }
    else{
        return res.json({ message: "El dna no tiene el formato NxN" });

    }
    

   
}

 async function contarCuartetos(adnArray){
    cuentaDeCuartetos = 0;
    adnArray = adnArray.map(function(element) {
        return Array.from(element)
        }

    );
    
    await asyncForEach(adnArray,async function(element){
        var coincidenciaHor = await tieneCuartetoHorizontal(element);
        if(coincidenciaHor){
            cuentaDeCuartetos ++;
        }
    });

    //traspongo la matriz
    adnArray = adnArray[0].map((_, colIndex) => adnArray.map(row => row[colIndex]));
    
    await asyncForEach(adnArray,async function(element){
        var coincidenciaHor = await tieneCuartetoHorizontal(element);
        if(coincidenciaHor){
            cuentaDeCuartetos ++;
        }
    });


    return cuentaDeCuartetos;

    
}


const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index]);
     }
   };
 async function  tieneCuartetoHorizontal(adnArray){
    var contador = 0;
    var lastElement;
    await asyncForEach(adnArray,async function(element){
        if(contador < 4){
            if(element == lastElement){
                contador ++;
            }
            else{
                contador = 1;
            }
        }
        lastElement = element;
        
    });
    if(contador >= 4){
        return true;
    }
    else{
        return false;
    }    

}

