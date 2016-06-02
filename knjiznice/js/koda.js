
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";
var authorization = "Basic " + btoa(username + ":" + password);

/**
 * Prijava v sistem z privzetim uporabnikom za predmet OIS in pridobitev
 * enolične ID številke za dostop do funkcionalnosti
 * @return enolični identifikator seje za dostop do funkcionalnosti
 */
function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}


/**
 * Generator podatkov za novega pacienta, ki bo uporabljal aplikacijo. Pri
 * generiranju podatkov je potrebno najprej kreirati novega pacienta 
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
  var ehrId = "";
  var ime, priimek, datumrojstva, spol, visina, teza, vpritisk, npritisk, utrip, alergije, temperatura;
  switch(stPacienta){
    case 1: //Janez Novak
      ime="Janez";
      priimek="Novak";
      datumrojstva="1978-12-6T18:24";
      spol="m";
      visina="192";
      teza="130";
      vpritisk="140";
      npritisk="96";
      utrip="85";
      alergije="";
      temperatura="37.0";
    case 2: //Mojca Kovač
      ime="Mojca";
      priimek="Kovač";
      datumrojstva="1994-5-30T09:30";
      spol="z";
      visina="165";
      teza="58";
      vpritisk="120";
      npritisk="80";
      utrip="68";
      alergije="";
      temperatura="36.2";
    case 3: //Luka Hrovat
      ime="Luka";
      priimek="Hrovat";
      datumrojstva="1990-8-13T15:12";
      spol="m";
      visina="178";
      teza="70";
      vpritisk="110";
      npritisk="68";
      utrip="72";
      alergije="jagode";
      temperatura="36.8";
  }
  //generira podatke
  $.ajaxSetup({
    headers: {
        "Authorization": authorization,
        "Ehr-Session":getSessionId()
    }
  });
  $.ajax({
    url: baseUrl + "/ehr",
    type: 'POST',
    success: function (data) {
        var ehrId = data.ehrId;
        $("#header").html("EHR: " + ehrId);

        var partyData = {
            firstNames: ime,
            lastNames: priimek,
            dateOfBirth: datumrojstva,
            partyAdditionalInfo: [{key: "ehrId",value: ehrId, 
              key:"vital_signs/body_temperature/any_event/temperature|magnitude", value:temperatura,
              key: "vital_signs/blood_pressure/any_event/systolic",value:vpritisk,
              key: "vital_signs/blood_pressure/any_event/diastolic",value:npritisk,
              key: "vital_signs/height_length/any_event/body_height_length",value:visina,
              key: "vital_signs/body_weight/any_event/body_weight",value:teza,
              key: "gender",value:spol}]
        };
        $.ajax({
            url: baseUrl + "/demographics/party",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(partyData),
            success: function (party) {
                if (party.action == 'CREATE') {
                    console.log("yay %s", ehrId);
                    //vitalniZnaki(temperatura, vpritisk, npritisk, visina, teza, ehrId);
                    $('#seznamID').append("*"+ehrId+" "+visina+" cm "+teza+" kg. *");
                }
            }
           
        });
    }
  });
}

/*function vitalniZnaki(temperatura, vpritisk, npritisk, visina, teza, ehrId){

  var compositionData = {
    "ctx/language": "en",
    "ctx/territory": "SI",
    "vital_signs/body_temperature/any_event/temperature|magnitude": temperatura,
    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
    "vital_signs/blood_pressure/any_event/systolic": vpritisk,
    "vital_signs/blood_pressure/any_event/diastolic": npritisk,
    "vital_signs/height_length/any_event/body_height_length": visina,
    "vital_signs/body_weight/any_event/body_weight": teza,
  };
  var queryParams = {
    "ehrId": ehrId,
    templateId: 'Vital Signs',
    format: 'FLAT',
    committer: ''
  };
  $.ajax({
    url: baseUrl + "/composition/" + ehrId,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(compositionData),
    success: function (res) {
        console.log('yay podatki');
    }
  });
}*/


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
