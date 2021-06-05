const { result } = require('lodash');
var resultEnum = require('../enums/resultadoEstudio');
var filtersEnum = require('../enums/filters');
var error = require('throw.js');

var studyService = require('../services/study');


module.exports.insert = insert;
module.exports.getStats = getStats;
module.exports.getAll = getAll;
module.exports.search = search;
module.exports.test = test;


//expuesto para el test automatico con mocha
module.exports.tieneCuartetoHorizontal = tieneCuartetoHorizontal;
module.exports.contarCuartetos = contarCuartetos;
module.exports.validateDnaFormat = validateDnaFormat;
module.exports.validateDnaCharacters = validateDnaCharacters;
//expuesto para el test automatico con mocha


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

/**
 * Metodo que solo sirve para checkear que este vivo en el server 
 */
function test(req, res, next) {
        return res.json({ message:"vivo"});
}

/**
 * Metodo que trae todos los estudios de la bdd 
 */
function getAll(req, res, next) {
    studyService.getAll(function (err, studies) {
        if (err)
            return next(err);

        response = { results : studies};    
        return res.json(response);
    });
}

/**
 * Metodo que busca todos los estudios de la bdd 
 * @params search?key=country&values=Brasil,Argentina
 * @params search?key=result&values=0,1
 * 
 */
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

/**
 * Metodo que valida el formato del dna NxN
 */
function validateDnaFormat(dnaArray){
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

  /**
 * Metodo que valida que el dna tenga los caracteres validos
 */
  async function validateDnaCharacters(dnaArray){
    dnaAllowed = ["C","T","G","A"];
    var retorno = true;
    await asyncForEach(dnaArray,async function(dnaElement){
        await asyncForEach(Array.from(dnaElement),async function(dnaChar){
            if(!dnaAllowed.includes(dnaChar.toUpperCase())){
                retorno = false;
            }
        });

        
    });
    return retorno;
  }
/**
 * Metodo que inserta un estudio en la bdd
 */
async function insert(req, res, next) {
    var estudio = req.body;

    if(validateDnaFormat(estudio.dna)){
        if(await validateDnaCharacters(estudio.dna)){
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
            return next(new error.BadRequest("El adn posee caracteres invalidos"));


        }
        
    
    }
    else{
        return next(new error.BadRequest("El adn no tiene el formato NxN"));
    }
    

   
}

/**
 * Metodo que cuenta los pares de 4 encontrados en el array de dna
 */
 async function contarCuartetos(adnArray){
    cuentaDeCuartetos = 0;
    //convierto el array de string en un array de chars
    adnArray = adnArray.map(function(element) {
        return Array.from(element)
        }

    );
    
    //cuento los los pares de 4 horizontalmente en la matriz
    await asyncForEach(adnArray,async function(element){
        var coincidenciaHor = await tieneCuartetoHorizontal(element);
        if(coincidenciaHor){
            cuentaDeCuartetos ++;
        }
    });

    //traspongo la matriz
    adnArray = adnArray[0].map((_, colIndex) => adnArray.map(row => row[colIndex]));
    
    //cuento los los pares de 4 horizontalmente en la matriz (ahora traspuesta)

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


 /**
  * 
  * Metodo que chechea si el array pasado tiene 4 caracteres iguales
  */  
 async function  tieneCuartetoHorizontal(adnArray){
    var contador = 0;
    var lastElement = '-1';
    await asyncForEach(adnArray,async function(element){
        if(contador < 4){
            if(element.toUpperCase() == lastElement.toUpperCase()){
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

