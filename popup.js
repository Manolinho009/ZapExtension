

areaCode = '55'
tamanho = 0

contador = 0


var activeTab =null

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
            

            function next(){
                chrome.runtime.sendMessage({message: 'next','actab':`+activeTab.id+`}, function(response) {
                    console.log(response);
                    
                });
            }
            function verifyBtn() {

                setTimeout(()=>{

                    var button = document.querySelector('[aria-label="Enviar"]');
                    if (button) {
                        console.log("Button found!");
                        console.log("`+activeTab.id+`");
                    
                        try{
                            button.click();
                        

                            setTimeout(()=>{

                                var aTags = document.getElementsByTagName("span");
                                var searchText = "`+mensagemGlobal+`";
                                var found;
                                
                                for (var i = 0; i < aTags.length; i++) {
                                    if (aTags[i].textContent == searchText) {
                                        found = aTags[i];
                                        console.log(found)

                                        status = found.parentNode.parentNode.querySelector('[aria-label=" Entregue "]')
                                        console.log(status)

                                        if(status != null){
                                            next();
                                            break;
                                        }
                                        else{
                                            verifyBtn()
                                        }

                                    }else{
                                        verifyBtn()
                                    }
                                }
                            },1000)

                        }
                        catch(e){
                            console.log("erro");
                            verifyBtn()
                        }    
                    }
                    else{
                        verifyBtn()
                    }

                }, 1000);
            }

            verifyBtn()
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

        tamanho = numerosF.length
        contador = 0
        numerosGlobal = numerosF
        mensagemGlobal = mensagem
        

        // a = send_number()
        // b = send_msg()

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            activeTab = tabs[0];

            chrome.runtime.sendMessage({message: 'current','numbers':numerosF,'msg':mensagem,'actab':activeTab.id}, function(response) {
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
            return true
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
            return true

        });


      });
}