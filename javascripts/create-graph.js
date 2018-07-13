var Message = document.getElementById("Message");

var clearInputsAfterAdd = true;

var PIBsNominais = ["PIB Nominal"];
var PIBsReais = ["PIB Real"];
var deflatoresDoPIB = ["Deflator do PIB"];

var GraficoNominalXReal = c3.generate({
    size: {
        height: 240,
        width: 480
    },
    data: {
        columns: [
			PIBsNominais,
			PIBsReais
        ]
    },
		bindto: '#GraficoNominalXReal'
});

var GraficoDeflatores = c3.generate({
    size: {
        height: 240,
        width: 480
    },
    data: {
        columns: [
		    deflatoresDoPIB
        ],
        axes: {
            deflatoresDoPIB: 'y2'
        }
    },
    grid: {
        y:{
            lines:[
                {value: 100, text: ''}
            ]  
        }
    },
		bindto: '#GraficoDeflatores'
});

function calculaDeflatorDoPIB(PIBNominal, PIBReal){
	return 100 * (PIBNominal / PIBReal);
}

function reloadGraphs(){
    //setTimeout(function () {
        GraficoNominalXReal.load({
            columns: [
                PIBsNominais,
                PIBsReais
            ]
        });
    //}, 100);
    
    //setTimeout(function(){
        GraficoDeflatores.load({
            columns:[
                deflatoresDoPIB
            ]
           
        });
    //}, 100);
}

function flashText(message, typeOfMessage){
    if(typeOfMessage == "sucess"){
        document.getElementById("Message").style.color = "green";
    }
    else if(typeOfMessage == "error"){
        document.getElementById("Message").style.color = "red";
    }
    else{
        document.getElementById("Message").style.color = "black";
    }


    Message.innerHTML = message;
    $(Message).fadeIn(250);
    setTimeout(function(){
        $(Message).fadeOut(250);
    }, 2000);
    //Message.innerText = "";
    

}

function addNewPosition(valor_PIBNominal, valor_PIBReal, showMessage){
    // Test if the parameters are numbers
    if(isNaN(valor_PIBNominal) || isNaN(valor_PIBReal)){
        flashText("Error: Ambos os valores devem ser números", "error");
        return;
    }

    // Test if the parameters are negative
    if(valor_PIBNominal < 0 || valor_PIBReal < 0){
        flashText("Erro: Ambos os valores devem ser positivos", "error");
        return;
    }

    // If the only element in the array is an null object, remove this object
    // (Necessary for updating the graphs visually)
    if(PIBsNominais.length>1 && PIBsNominais[1] == null){
        PIBsNominais.pop(1);
    }
    if(PIBsReais.length>1 && PIBsReais[1] == null){
        PIBsReais.pop(1);
    }
    if(deflatoresDoPIB.length>1 && deflatoresDoPIB[1] == null){
        deflatoresDoPIB.pop(1);
    }

    // Add new values to the graphs
    PIBsNominais.push(valor_PIBNominal);
    PIBsReais.push(valor_PIBReal);
    deflatoresDoPIB.push(calculaDeflatorDoPIB(valor_PIBNominal, valor_PIBReal));

    // Clear fields after input (optional)
    if(clearInputsAfterAdd){
        // Create references for the input fields's objects
        var PIBNominalInput = document.getElementById('PIBNominalInput');
        var PIBRealInput = document.getElementById('PIBRealInput');

        PIBNominalInput.value = "";
        PIBRealInput.value = "";

        PIBNominalInput.focus();

    }

    if(showMessage){
        flashText("Valores adicionados!", "sucess")
    }

    reloadGraphs();
}

function removeAll(){
    PIBsNominais = ["PIB Nominal", null];
    PIBsReais = ["PIB Real", null];
    deflatoresDoPIB = ["Deflator do PIB", null];
    reloadGraphs();
    flashText("", "error")
}

document.getElementById("PIBRealInput")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("AddButton").click();
    }
});

document.getElementById("PIBNominalInput")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("AddButton").click();
    }
});

function makeExample(){
    removeAll();

    var mockup_PIBsNominais = [];
    var variation_range = 10;
    
    for(i=0; i<10; i++){
        mockup_PIBsNominais.push(4000 + Math.random()*variation_range - variation_range/2);
    }
    
    // Mockup
    for(i=0; i<mockup_PIBsNominais.length; i++){
        addNewPosition(mockup_PIBsNominais[i], mockup_PIBsNominais[i] + Math.random()*variation_range - variation_range/2, false);
    }
}


makeExample();
PIBNominalInput.focus();