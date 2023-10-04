

areaCode = '55'
tamanho = 0

contador = 0



mensagemGlobal = ''

numerosGlobal = []


function formater(number) {

    if(number.length > 13){
        return number.replace(' ','').trim();
    }
    else{
        return  areaCode+number.replace(' ','').trim();

    }
}

function clickEnviar(cont,msg) {

    var script = ''
    console.log(cont);
    console.log(tamanho);
    console.log(numerosGlobal[cont]);

    if(cont < tamanho && numerosGlobal[cont]){
        number = numerosGlobal[cont]
        script = `
            console.log("LA ele");
    
            var checkExist = setInterval(function() {
                var button = document.querySelector('[aria-label="Enviar"]');
                if (button) {
                    console.log("Button found!");
                    button.click();
                    clearInterval(checkExist);
                    
                    chrome.runtime.sendMessage({message: 'Hello from popup!','number':'`+number+`','msg':'`+msg+`','actab':`+activeTab.id+`}, function(response) {
                        console.log(response);
                    });
    
                }
            }, 10); // verifica a cada 1000ms
        `
        contador += 1
    }
    else{
        script = `
            console.log("LA ele");
    
            var checkExist = setInterval(function() {
                var button = document.querySelector('[aria-label="Enviar"]');
                if (button) {
                    console.log("Button found!");
                    button.click();
                    clearInterval(checkExist);
    
                }
            }, 10); // verifica a cada 1000ms
        `
        contador = 0
    }

    
    chrome.tabs.executeScript({
        code: script
      });
      
}



function proximo(numero,msg) {
    console.log("PRIMEIRO ");
    console.log(contador);
    console.log(tamanho);
    console.log(numerosGlobal[contador]);
    console.log("--------------------");

    chrome.runtime.sendMessage({message: 'Hello from popup!','number':numero,'msg':msg,'actab':activeTab.id}, function(response) {
        console.log(response);
    });
}


var activeTab = null


chrome.tabs.onUpdated.addListener(function (tabId, info) {
    
    if (info.status === 'complete') {

        script = `
        console.log("LA ele");
    
            var checkExist = setInterval(function() {
                var button = document.querySelector('[aria-label="Enviar"]');
                if (button) {
                    console.log("Button found!");
                    button.click();

                    chrome.runtime.sendMessage({message: 'next'}, function(response) {
                        console.log(response);
                    });

                    clearInterval(checkExist);
                    

                }
            }, 1000); // verifica a cada 1000ms

        `

        chrome.tabs.executeScript({
            code: script
        });
        // clickEnviar(contador,mensagemGlobal)
    }

});

document.addEventListener('DOMContentLoaded', function() {
   
      
document.getElementById('butao').addEventListener('click', function() {
        
        numero = document.getElementById('numero').value;
        numerosCru = numero.split(',')
        numerosF = []

        mensagem = document.getElementById('mensagem').value;

        numerosCru.forEach(element => {
            numerosF.push(formater(element))
        });
        //  formater(numero);

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            activeTab = tabs[0];
            

            tamanho = numerosF.length
            contador = 0
            numerosGlobal = numerosF
            mensagemGlobal = mensagem
            

            send_number()
            send_msg()

            chrome.runtime.sendMessage({message: 'next'}, function(response) {
                console.log(response);
            });
            // proximo(numerosGlobal[contador],mensagemGlobal)

          });


    });
});


function send_number() {
    numero = document.getElementById('numero').value;
    numerosCru = numero.split(',')
    numerosF = []

    mensagem = document.getElementById('mensagem').value;

    numerosCru.forEach(element => {
        numerosF.push(formater(element))
    });
    //  formater(numero);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        activeTab = tabs[0];
        
        chrome.runtime.sendMessage({message: 'numeros','numbers':numerosF,'actab':activeTab.id}, function(response) {
            console.log(response);
        });


      });
}


function send_msg() {
    numero = document.getElementById('numero').value;
    numerosCru = numero.split(',')
    numerosF = []

    mensagem = document.getElementById('mensagem').value;

    numerosCru.forEach(element => {
        numerosF.push(formater(element))
    });
    //  formater(numero);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        activeTab = tabs[0];
        
        chrome.runtime.sendMessage({message: 'msg','msg':mensagem,'actab':activeTab.id}, function(response) {
            console.log(response);
        });


      });
}