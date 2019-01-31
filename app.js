$(document).ready(function () {
    // an array of stock symbols.
    const stockList = ["FB", "AAPL", "MANU", "AMZN"];
    const validationList = [];

    // creating function and methods

    // function that displays all gif buttons from array.

    function displayArray() {
        $("#stockButtonsView").empty();// erasing anything in this div
        for (let i = 0; i < stockList.length; i++) {
            //create a HTML buttton for each index number in array and assign it a varibale in order 
            const stockButton = $('<button>');
            //add a class for later ajax use
            stockButton.addClass("stock")
            //add a class to each button
            stockButton.addClass("btn btn-primary")
            //give a data name to each button that we use for a reference later in our AJAX call
            stockButton.attr("data-name", stockList[i]);
            //assign text to each button baseed off strings in array.
            stockButton.text(stockList[i]);
            //add each button to specific Div in HTML
            $("#stockButtonsView").prepend(stockButton);

        };
    };
    function compareSymbol() {
        $('#validStock').on('click', function(){
            let stock = $('#valid-input').val().toUpperCase().trim();
            // console.log(stock);
            if (stock=='') {
                return false
            }
            if(validationList.includes(stock)){
            alert(""+stock+" is a VAlID stock!!")
            
            return false;
            }
            if(validationList.includes(stock)===false) {
                alert(""+stock+" is not a valid stock")
            }
        })
    }
    //function to add new button and call displayArray function
    function addNewButton() {
        //When id specific button is pressed run this function
        $('#addStock').on('click', function () {
            //assign a variable equal to the value of the user input from id specific div in HTML
            //make the user input uppercase as all stock symbols are uppercase
            // (trim the text to remove whitepase)
            let stock = $("#stock-input").val().toUpperCase().trim();
            console.log(stock)
            //if user types in nothing then do nothing and return false
            if (stock == '') {
                return false;
            }
            //check to see if stock is being selected correctly
            console.log(stock)
            //push our new button to our array initial array
            stockList.push(stock)
            //make sure it updated our stocklist array with new stock symbol
            console.log(stockList)

            //run function display array as we have a new member to our array we'd like to showcase!
            displayArray();
            return false;
        });
    }

    function validStock() {
        // let userSymbol = $('#valid-input').val().toUpperCase().trim();
        // console.log(userSymbol)
        let queryURL = "https://api.iextrading.com/1.0/ref-data/symbols";
        // console.log(queryURL);
        $.ajax({
            url: queryURL,
            //defining wht method we are doing in this case we are GETting information
            method: 'GET'
        })
            .done(function (response) {
                // console.log(response[1])
                let results = response
                for (let i = 0; i < results.length; i++) {
                    let symbol = results[i].symbol;
                    validationList.push(symbol)
                    // console.log(userSymbol);
                    // for (let i = 0; i < validationList.length; i++) {
                    //     if (user) {

                    //     }

                    // }
                }

                // console.log(validationList)
            });
    }
    // function compare() {
    //     $('#validStock').on("click", function () {
    //         let valid = $("#valid-input").val().toUpperCase().trim();
    //         //if user types in nothing then do nothing and return false
    //         if (valid == '') {
    //             return false;
    //         }
        
    //         validationList.includes(valid);
            
    //         console.log(valid);
    //         validStock();
    //     })
    // }


    //run functions
    validStock();
    addNewButton();
    displayArray();
    compareSymbol();



    //function to grab Api data and display each comonay based off symbol clicked.
    function displayStock() {
        //assign a variable to the data name of element (this) clicked
        let stock = $(this).attr("data-name");
        //the Url we will be using and where in this case the variable needs to be placed
        let queryURL = "https://api.iextrading.com/1.0/stock/" + stock + "/batch?types=quote,news"
        //check it works!
        // console.log(queryURL);
        //template ajax call.
        $.ajax({
            url: queryURL,
            //defining wht method we are doing in this case we are GETting information
            method: 'GET'
        })
            //promise function that takes in all the information above and gathers the whole query into a variable
            // that we make into an argument
            .done(function (response) {
                //check the JSONP data and to see object path to data we need
                // console.log(response)
                // $('#stockView').empty();
                let result = response;
                // console.log(result);
                //create a div for all info to go into and give it a class fos css purposes
                let stockDiv = $('<div>');
                stockDiv.addClass('stockDiv');
                //check path of JsonP
                // console.log(result.quote.companyName)

                //creating paragraphs of the values we want from the JSONP object
                let stockName = $('<p>').text('Company Name: ' + result.quote.companyName);
                let stockPriceHigh = $('<p>').text('Stock Price High: ' + result.quote.high);
                let stockPriceLow = $('<p>').text('Stock Price Low: ' + result.quote.low);

                //appending each new para to the div we made above
                stockDiv.append(stockName);
                stockDiv.append(stockPriceHigh);
                stockDiv.append(stockPriceLow);
                //appending new div with 3 paragraphs to HTMl Div that already exists
                $('#stockView').append(stockDiv);
            });
    };

    function displayLogo() {
        let logo = $(this).attr('data-name')
        let queryURL = "https://api.iextrading.com/1.0/stock/" + logo + "/logo";
        // console.log(queryURL);
        $.ajax({
            url: queryURL,
            //defining wht method we are doing in this case we are GETting information
            method: 'GET'
        })
            .done(function (response) {
                // console.log(response);
                // $("#stockView").empty(); // erasing anything in this div id so that it doesnt keep any from the previous click
                let results = response.url; //shows results of stock
                console.log(results)
                let stockLogo = $('<img>');
                stockLogo.attr("src", results);
                stockLogo.addClass('image')
                $("#stockView").prepend(stockLogo);

            });
    };

    function nyNews (){
        let stock = $(this).attr('data-name');
        var queryUrl = "https://newsapi.org/v2/everything?q=" + stock + "&language=en&pageSize=10&sortBY=relevancy&apiKey=cd225c64e7e444f8ae8da4c61d6720bb";
        $.ajax({
            url: queryUrl,
            method: 'GET'
        }).then(function(response){
            console.log(response)
            $('#stockView').empty();
            $('#newsView').empty();
            var results = response.articles;

            for (let i = 0; i < results.length; i++) {
                let cardDiv = $('<div>');
                cardDiv.attr('class', 'card-deck');
                let cardBod = $('<div>').attr('class', 'card-body');
                let cardNews = $('<div>');
                cardNews.attr('id', 'cardNews');
                cardNews.attr('class', 'card');
                cardNews.attr('style', 'display: none')
        
                let articleTitle = $('<h5>').text(results[i].title);
                articleTitle.attr('class', 'card-title');
                let articleImage = $('<img>').attr('src', results[i].urlToImage);
                articleImage.attr('class', 'crops');
                let articleURL = $('<a>').text("View Whole Article Here")
                articleURL.attr('class', 'card-text');
                articleURL.attr('href',results[i].url);
                articleURL.attr('target', '_blank');
                let articleDescr = $('<p>').text(results[i].description);
                articleDescr.attr('class', 'card-text');
                cardBod.append(articleTitle);
                cardBod.append(articleImage);
                cardBod.append(articleDescr);
                cardBod.append(articleURL);
        
                cardDiv.append(cardBod);
        
                $('#newsView').append(cardDiv);               
            }
        })
    }


    //doc event listeners
    //when any of the buttons with the class stock is clicked run this function
    $(document).on("click", ".stock", displayStock);
    $(document).on('click', '.stock', displayLogo);
    $(document).on('click', '.stock', nyNews);
    // $(document).on('click', '.valid', validStock);


    // $(document).on('click', '#validStock', validStock);
})







