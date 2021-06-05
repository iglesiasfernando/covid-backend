var covidController = require('../controllers/covid.js');
var studyService = require('../services/study');
var resultEnum = require('../enums/resultadoEstudio');

var assert = require('assert');
describe('Funcion que checkea existencia de 4 caracteres iguales en array', function() {

    it('Caso true 4 chars', async function() {
      var result = await covidController.tieneCuartetoHorizontal(['C','C','C','C']);
      assert.equal(result, true);
    });
  
    it('Caso true 4 chars mayus y minus', async function() {
        var result = await covidController.tieneCuartetoHorizontal(['c','c','c','C']);
        assert.equal(result, true);
    });


    it('Caso true 6 chars', async function() {
    var result = await covidController.tieneCuartetoHorizontal(['C','C','C','C','A','T']);
    assert.equal(result, true);
    });

    it('Casos false 4 chars', async function() {
        var result = await covidController.tieneCuartetoHorizontal(['A','C','C','C']);
        assert.equal(result, false);
    });

    it('Caso false 5 chars', async function() {
      var result = await covidController.tieneCuartetoHorizontal(['A','C','C','C','T']);
      assert.equal(result,false);
    });
    it('Caso false 2 chars', async function() {
        var result = await covidController.tieneCuartetoHorizontal(['A','C']);
        assert.equal(result,false);
      });
  
    
  
  });


  describe('Funcion cuenta la cantidad de ocurrencias de 4 caracteres horizontal o vertical', function() {

    it('Caso 3', async function() {
      var result = await covidController.contarCuartetos(["ATGCGA", "CGGTGC", "TTATGT", "AGAAGG", "CCCCTA", "TCAAAA"]
      );
      assert.equal(result, 3);
    });

    it('Caso 2', async function() {
        var result = await covidController.contarCuartetos(["ATGCGA", "CGGTGC", "TTATGT", "AGAAGG", "FCCCCTA", "TCAAAA"]
        );
        assert.equal(result, 3);
      });

      
      it('Caso 2', async function() {
        var result = await covidController.contarCuartetos(["AA", "AA", "AA", "AA", "AA", "AA"]
        );
        assert.equal(result, 2);
      });

      it('Caso 0', async function() {
        var result = await covidController.contarCuartetos(["AB", "BB", "BA", "CB", "CA", "AC"]
        );
        assert.equal(result, 0);
      });

      it('Caso 0', async function() {
        var result = await covidController.contarCuartetos(["AB", "BB", "BA", "CB", "CA", "AC"]
        );
        assert.equal(result, 0);
      });

      it('Caso 4', async function() {
        var result = await covidController.contarCuartetos( ["ATGCGA",
        "CTGTGC",
        "TTATGT",
        "ATAAGG",
        "CCCCTA", 
        "TCAAAA"]
        );
        assert.equal(result, 4);
      });

      it('Caso 5', async function() {
        var result = await covidController.contarCuartetos( ["ATGCGAA",
        "CTGTGCA",
        "TTATGTA",
        "ATAAGGA",
        "CCCCTAA", 
        "TCAAAAA"]
        );
        assert.equal(result, 5);
      });

      it('Caso 0', async function() {
        var result = await covidController.contarCuartetos( ["a",
        "a",
        "A",
        "A",
        "a", 
        "A"]
        );
        assert.equal(result, 1);
      });
     


});

describe('Validacion de array NxN', function() {

    it('Caso true', async function() {
      var result = await covidController.validateDnaFormat(['ACC','CAA','CCC']);
      assert.equal(result, true);
    });
    it('Caso true', async function() {
        var result = await covidController.validateDnaFormat(['CA','aC']);
        assert.equal(result, true);
      });

      it('Caso false', async function() {
        var result = await covidController.validateDnaFormat(['CA','aC','aa']);
        assert.equal(result, false);
      });
      it('Caso false', async function() {
        var result = await covidController.validateDnaFormat(['A','aC']);
        assert.equal(result, false);
      });

});

describe('Validacion de caracteres', function() {

    it('Caso true', async function() {
      var result = await covidController.validateDnaCharacters(['ACC','CAA','CCC']);
      assert.equal(result, true);
    });
    it('Caso true', async function() {
        var result = await covidController.validateDnaCharacters(['CA','aC']);
        assert.equal(result, true);
      });

      it('Caso false', async function() {
        var result = await covidController.validateDnaCharacters(['CB','aC','aa']);
        assert.equal(result, false);
      });
      it('Caso false', async function() {
        var result = await covidController.validateDnaCharacters(['AW','aC']);
        assert.equal(result, false);
      });

});


//esta prueba la hice con una bdd controlada
describe('Get stats', function() {

    it('Caso infectados', async function() {
       await studyService.getStats(resultEnum.INFECTED,function(err,result){

        assert.equal(result, 10);
      });
    });
      it('Caso sanos', async function() {
        await studyService.getStats(resultEnum.NO_INFECTED,function(err,result){
 
         assert.equal(result, 3);
       });

       it('Caso inmunes', async function() {
        await studyService.getStats(resultEnum.NO_INFECTED,function(err,result){
 
         assert.equal(result, 3);
       });
    });
      
    });
});

