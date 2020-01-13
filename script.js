$(document).ready(function(){

    var template_html = $('#day-template').html();
    var template_function = Handlebars.compile(template_html);


    var start_date = '2018-01-01';
    var start_moment = moment(start_date);

    display_month(start_moment);

    //intercetto il click sul button
    $('#mese_succ').click(function(){
        //devo aggiungere 1 al mese corrente
        start_moment.add(1, 'months');
        //leggo il mese corrente
        var mese_corrente = $('#mese_corrente').text();

        //se clicco e rimango su gennaio
        if (mese_corrente == 'Gennaio') {
            //fai comparire button prec
            $('#mese_prec').show();
        }
        //se mi trovo su dicembre
        if (mese_corrente == 'Dicembre') {
            //fai scomparire icona succ
            $('#mese_succ').hide();
            alert('fine calendario');
        } else {
            //visualizzo il calendario aggiornato
            display_month(start_moment);
        }
    });

    //intercetto il click
    $('#mese_prec').click(function(){

        start_moment.subtract(1, 'months');
        var mese_corrente = $('#mese_corrente').text();

        if (mese_corrente == 'Dicembre') {
            $('#mese_succ').show();
        }

        //Controllare se il mese è valido
        if (mese_corrente == 'Gennaio') {
            //fai scomparire icona prec
            $('#mese_prec').hide();
            alert('fine calendario');
        } else {
            //visualizza calendario aggiornato
            display_month(start_moment);
        }
    });

    //per stampare i giorni del mese da visualizzare
    function display_month(data_moment){
        //svuoto il calendario
        $('#calendario').empty();

        //clono l'oggetto per usarlo per il data-day
        var date = data_moment.clone();

        //numero giorni del mese da visualizzare
        var days_of_month = date.daysInMonth();
        //mese testuale
        var text_month = date.format('MMMM');
        text_month = text_month.charAt(0).toUpperCase() + text_month.slice(1);
        //giorno della settimana in numero
        var day_of_week = date.day();
        //mese in numero
        var month = date.month();
        //anno in numero
        var year = date.year();

        //inserisco in modo dinamico il mese che appare come titolo
        $('#mese_corrente').text(text_month);

        //stampo dei li vuoti per i giorni mancanti dall'inizio
        display_empty_block(day_of_week);
        //stampo i giorni
        display_days(days_of_month, date);
        //richiamo funzione per stampare le festività
        display_holiday(start_moment);
    };

    //stampo blocchi vuoti ad inizio mese per giorni mancanti
    function display_empty_block(day_position) {
        //se il primo è domenica appendi 6 vuoti
        if (day_position == 0 ) {
            for (var k = 0; k < 6; k++) {
                $('#calendario').append('<div class="day_box"></div>');
            }
        } else if (2 <= day_position <= 6) {
            for (var j = 0; j < (day_position - 1); j++) {
                $('#calendario').append('<div class="day_box"></div>');
            }
        }
    }

    //funzione per stampare i giorni
    function display_days(days_of_month, date) {
        //ciclo for per stampare i giorni del mese e data-day
        for (var i = 1; i <= days_of_month; i++) {
            //uso template handlebars
            var context = {
                'day': i,
                'date': date.format('YYYY-MM-DD')
            };
            var html_finale = template_function(context);
            $('#calendario').append(html_finale);
            //aggiungo un giorno all'oggetto clonato
            date.add(1, 'days');
        }
    }

    //funzione per stampare le festività
    function display_holiday(data_moment) {
        $.ajax({
            'url': 'https://flynn.boolean.careers/exercises/api/holidays',
            'method': 'GET',
            'data': {
                'year': data_moment.year(),
                'month': data_moment.month()
            },
            'success': function(data){
                //mi restituisce un array con le festività mensili
                var holidays = data.response;
                //scorro l'array delle festività
                for (var i = 0; i < holidays.length; i++) {
                    var holiday_date = holidays[i].date;
                    var holiday_name = holidays[i].name;
                    //controllo se la data è uguale a data-id, aggiungo classe vacation e append il nome della festività
                    $('.day_box[data-day="'+ holiday_date +'"]').addClass('vacation').append('<span class="holiday">' + holiday_name + '</span>');
                }
            },
            'error': function(data){
                alert('error');
            }
        });
    }
});
