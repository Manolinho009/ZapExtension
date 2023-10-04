var iterifyArr = function (arr) {
    var cur = 0;
    arr.next = (function () { return (++cur >= this.length) ? false : this[cur]; });
    arr.prev = (function () { return (--cur < 0) ? false : this[cur]; });
    arr.current = (function () { return this[cur]; });
    return arr;
};

// var fibonacci = [1, 1, 2, 3, 5, 8, 13];
// iterifyArr(fibonacci);


numberlist = []
iterifyArr(numberlist);


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
    console.log("Button found!");
    // script = 'console.log("Button found!");'
    // chrome.tabs.executeScript({
    //     code: script
    // });

    // var checkExist = setInterval(function() {
    //     var button = document.querySelector('[aria-label="Enviar"]');
    //     if (button) {
    //         console.log("Button found!");
    //         button.click();

    //         chrome.runtime.sendMessage({message: 'next'}, function(response) {
    //             console.log(response);
    //         });

    //         clearInterval(checkExist);
            

    //     }
    // }, 1000); // verifica a cada 1000ms
  }
  


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if(request.message == 'numeros') {
        numberlist = request.numbers
        console.log(numberlist);
        iterifyArr(numberlist);

        atual = 0
    }
    else if(request.message == 'msg') {
        msgP = request.msg
        console.log(msgP);
    }
    else if(request.message == 'next'){
        
        next = numberlist.next()

        if(next){
            openWhats(request.actab,next,msgP)
            
            console.log(next);
            console.log(numberlist.current());
        }

        sendResponse({message: 'Send','resp':next});

    }
    else if(request.message == 'current'){
        numberlist = request.numbers
        console.log(numberlist);
        iterifyArr(numberlist);

        msgP = request.msg
        console.log(msgP);
        
        current = numberlist.current()
        
        if(current){
            console.log(current);
            openWhats(request.actab,current,msgP)
        }

        sendResponse({message: 'Send','resp':current});

    }
    else if(request.message == 'Hello from popup!') {
        console.log('Message received from popup!');
        

        

        console.log('https://web.whatsapp.com/send/?phone='+request.number+'&text='+request.msg+'&type=phone_number&app_absent=0')
        
        openWhats(request.actab,request.number,request.msg)

        sendResponse({message: 'Send','resp':request});

    }
});



