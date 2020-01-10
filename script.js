$(document).ready(function() {

  var template_html = $('#giorno-template').html();
  var template_function = Handlebars.compile(template_html);

  var data_iniziale = '2018-01-01';
  var moment_iniziale = moment(data_iniziale);
  stampa_mese(moment_iniziale);
  stampa_festivita(moment_iniziale);

  //intercetto il click
  $('#mese_succ').click(function() {

    //aggiungo un mese con la funzione add
    moment_iniziale.add(1, 'months');
    //visualizzo il calendario aggiornato
    stampa_mese(moment_iniziale);
    stampa_festivita(moment_iniziale);

  });

  //intercetto il click sul mese Precedente
  $('#mese_prec').click(function() {

    //tolgo un mese con la funzione subtract
    moment_iniziale.subtract(1, 'months');
    stampa_mese(moment_iniziale);
    stampa_festivita(moment_iniziale);
    
  });

  function stampa_mese(data_mese) {
    //resetto il calendario
    $('#calendario').empty();

    //clono la data del mese per poter sommare i giorni
    var data_mese_giorno = moment(data_mese);
    //recupero i giorni del mese da visualizzare
    var giorni_mese = data_mese.daysInMonth();
    var mese_testuale = data_mese.format('MMMM');

    //imposto il titolo con il mese corrente
    $('#mese-corrente').text(mese_testuale);

    //con un ciclo for disegno tutti i giorni del giorni_mese
    for (var i = 1; i <= giorni_mese; i++) {

      var giorno_standard = data_mese.format('YYYY-MM-') + formatta_giorno(i);
      var placeholder = {
        day: i + ' ' + mese_testuale,
        standard_day: data_mese_giorno.format('YYYY-MM-DD')
      };
      var html_finale = template_function(placeholder);
      $('#calendario').append(html_finale);

      data_mese_giorno.add(1, 'days');
    }
  }

  function stampa_festivita(data_mese) {
    $.ajax({
      'url': 'https://flynn.boolean.careers/exercises/api/holidays',
      'method': 'GET',
      'data': {
        'year': 2018,
        'month': data_mese.month()
      },
      'success': function(data) {
        var festivita = data.response;
        for (var i = 0; i < festivita.length; i++) {
          var festivita_corrente = festivita[i];
          var data_festa = festivita_corrente.date;
          var nome_festa = festivita_corrente.name;

          $('#calendario li').each(function(){
            var giorno_li = $(this).attr('data-giorno');
            //controllo se il giorno del calendario e' un giorno di festivita
            if (giorno_li == data_festa) {
              $(this).addClass('festa');
              $(this).append(' - ' + nome_festa);

            }

          })

        }

      },
      'error': function() {
        alert('errore');
      }
    });
  }

  function formatta_giorno(giorno) {
    if (giorno < 10) {
      return '0' + giorno;

    } else {
      return giorno;
    }

  }

});









//
