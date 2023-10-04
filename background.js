

numberlist = []
msgP = ''
atual = 0


function openWhats(tab,fone,msg) {
    chrome.tabs.update(tab,
            {
                url: 'https://web.whatsapp.com/send/?phone='+fone+'&text='+msg+'&type=phone_number&app_absent=0' 
                ,active: true
            }
        );

}

function simulateButtonClick() {
    // Simula o clique em um botão com uma classe específica
    var buttonToClick = document.querySelector('.exemplo-button');
    if (buttonToClick) {
      buttonToClick.click();
    }
  }
  


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if(request.message == 'numeros') {
        numberlist = request.numbers
        console.log(numberlist);

        atual = 0
    }
    else if(request.message == 'msg') {
        msgP = request.msg
        console.log(msgP);
    }
    else if(request.message == 'next'){
        
        if(numberlist.length >= atual+1){
            console.log(atual);

            openWhats(request.actab,numberlist[atual],msgP)
            atual += 1

        }
        sendResponse({message: 'Send','resp':numberlist[atual]});

    }
    else if(request.message == 'Hello from popup!') {
        console.log('Message received from popup!');
        

        

        console.log('https://web.whatsapp.com/send/?phone='+request.number+'&text='+request.msg+'&type=phone_number&app_absent=0')
        
        openWhats(request.actab,request.number,request.msg)

        sendResponse({message: 'Send','resp':request});

    }
});



