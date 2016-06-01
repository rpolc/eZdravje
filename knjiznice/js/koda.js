
var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";


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
 * generiranju podatkov je potrebno najprej kreirati novega pacienta z
 * določenimi osebnimi podatki (ime, priimek in datum rojstva) ter za njega
 * shraniti nekaj podatkov o vitalnih znakih.
 * @param stPacienta zaporedna številka pacienta (1, 2 ali 3)
 * @return ehrId generiranega pacienta
 */
function generirajPodatke(stPacienta) {
  var ehrId = "";
  var ime, priimek, datumrojstva, visina, teza, vpritisk, npritisk, utrip, alergije, temperatura;
  switch(stPacienta){
    case 1: //Janez Novak
      ime="Janez";
      priimek="Novak";
      datumrojstva="1978-12-6T18:24";
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
        "Authorization": authorization
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
            partyAdditionalInfo: [{key: "ehrId",value: ehrId}]
        };
        $.ajax({
            url: baseUrl + "/demographics/party",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(partyData),
            success: function (party) {
                if (party.action == 'CREATE') {
                    console.log("yay %s", ehrId);
                    
                }
            }
           
        });
    }
  });

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
    committer: 'Medicinska sestra'
  };
  $.ajax({
    url: baseUrl + "/composition?" + $.param(queryParams),
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(compositionData),
    success: function (res) {
        console.log('yay podatki');
    }
  });
   $('#bla').append(ehrId);
  return ehrId;
}


// TODO: Tukaj implementirate funkcionalnost, ki jo podpira vaša aplikacija
