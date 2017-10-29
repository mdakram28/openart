$(function(){
	$(".typed").typed({
        strings: [
            "SHARED AN ART ?",
            "PIRATED ?",
            "NEED CREDIBILITY ?",
            "WE HAVE YOUR BACK.^1000 OPENART"],
		stringsElement: null,
		typeSpeed: 30,
		startDelay: 1200,
		backSpeed: 50,
		backDelay: 1000,
		loop: false,
		loopCount: 5,
		showCursor: false,
		cursorChar: "|",
		attr: null,
		contentType: 'html',
		callback: function() {},
		preStringTyped: function() {},
		onStringTyped: function() {},
		resetCallback: function() {}
	});
});

// Dropzone.options.myAwesomeDropzone = {
//     paramName: "file", // The name that will be used to transfer the file
//     maxFilesize: 2, // MB
//     accept: function(file, done) {
//         console.log("Accepted file");
//         done();
//     }
// };

var ipfsHost = "http://localhost:8080";
var selectedFile = undefined;

function upload(){
    const reader = new FileReader();
    reader.onloadend = function() {
      const ipfs = window.IpfsApi('localhost', 5001) // Connect to IPFS
      const buf = buffer.Buffer(reader.result) // Convert data into buffer
      ipfs.files.add(buf, (err, result) => { // Upload buffer to IPFS
        if(err) {
          console.error(err)
          return
        }
        let url = `${ipfsHost}/ipfs/${result[0].hash}`
        console.log(`Url --> ${url}`)
        uploadHash(result[0].hash,document.getElementById("valueInput").value) ;
        document.getElementById("downloadUrl").innerHTML= url
        document.getElementById("downloadUrl").href= url
        document.getElementById("fbShare").href += url
        $(".hashBox").css({"display":"flex"});
        $(".fileInputForm").css({"display":"none"});
      })
    }
    // const file = document.getElementById("file");
    // reader.readAsArrayBuffer(file.files[0]); // Read Provided File
    reader.readAsArrayBuffer(selectedFile);
}

function download() {
  var hash = downloadHash(
    $("#buyerAccount").val(),
    $("#address").val()
  );

  downloadURI(`${ipfsHost}/ipfs/${hash}`);
}

function abort() {
  var hash = abortHash(
    $("#aborterAccount").val(),
    $("#aborterAddress").val()
  );
}

function downloadURI(uri, name) 
{
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    link.click();
}

function changeSelectedFile(event){
    selectedFile = document.getElementById("hiddenFileField").files[0];
    $("#fileName").html(selectedFile.name);
}

function copyToClipboard(){
    var copyTextarea = document.querySelector('#hashKey');
    copyTextarea.select();
  
    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Copying text command was ' + msg);
    } catch (err) {
      console.log('Oops, unable to copy');
    }
}

function drop_handler(ev) {
    console.log("Drop");
    ev.preventDefault();
    // If dropped items aren't files, reject them
    var dt = ev.dataTransfer;
    var files = [];
    if (dt.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i=0; i < dt.items.length; i++) {
        if (dt.items[i].kind == "file") {
          var f = dt.items[i].getAsFile();
          console.log("... file[" + i + "].name = " + f.name);
          files.push(f);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i=0; i < dt.files.length; i++) {
        console.log("... file[" + i + "].name = " + dt.files[i].name);
        files.push(dt.files[i]);
      }  
    }
    if(files.length != 1)return;

    selectedFile = files[0];
    $("#fileName").html(selectedFile.name);
  }

  function dragover_handler(ev) {
    console.log("dragOver");
    // Prevent default select and drag behavior
    ev.preventDefault();
  }

  function dragend_handler(ev) {
    console.log("dragEnd");
    // Remove all of the drag data
    var dt = ev.dataTransfer;
    if (dt.items) {
      // Use DataTransferItemList interface to remove the drag data
      for (var i = 0; i < dt.items.length; i++) {
        dt.items.remove(i);
      }
    } else {
      // Use DataTransfer interface to remove the drag data
      ev.dataTransfer.clearData();
    }
  }

 var web3;

 if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  } else {
    // set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  var source = `
  contract Purchase {
    address public seller;
    address public buyer;
    string public hash;
    uint public value;
    
    function Purchase(string thash,uint tvalue) {
        seller = msg.sender;
        hash = thash;
        value = tvalue;
    }
}
  `;

  var myContract;
  var address;

  var Contract = [{"constant":true,"inputs":[],"name":"seller","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"buyer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"getHash","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"thash","type":"string"},{"name":"tvalue","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];

  function uploadHash(thash,tvalue){
       web3.eth.defaultAccount = web3.eth.coinbase;
       var browser_mycontract_sol_purchaseContract = web3.eth.contract(Contract);
       var browser_mycontract_sol_purchase = browser_mycontract_sol_purchaseContract.new(
          thash,
          tvalue,
          {
            from: web3.eth.accounts[0], 
            data: '0x6060604052341561000f57600080fd5b60405161058838038061058883398101604052808051820191906020018051906020019091905050336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550816002908051906020019061008d92919061009c565b50806003819055505050610141565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100dd57805160ff191683800117855561010b565b8280016001018555821561010b579182015b8281111561010a5782518255916020019190600101906100ef565b5b509050610118919061011c565b5090565b61013e91905b8082111561013a576000816000905550600101610122565b5090565b90565b610438806101506000396000f30060606040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806308551a531461007257806309bd5a60146100c75780633fa4f245146101555780637150d8ae1461017e578063d13319c4146101d3575b600080fd5b341561007d57600080fd5b610085610261565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100d257600080fd5b6100da610286565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561011a5780820151818401526020810190506100ff565b50505050905090810190601f1680156101475780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561016057600080fd5b610168610324565b6040518082815260200191505060405180910390f35b341561018957600080fd5b61019161032a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101de57600080fd5b6101e6610350565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561022657808201518184015260208101905061020b565b50505050905090810190601f1680156102535780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561031c5780601f106102f15761010080835404028352916020019161031c565b820191906000526020600020905b8154815290600101906020018083116102ff57829003601f168201915b505050505081565b60035481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6103586103f8565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103ee5780601f106103c3576101008083540402835291602001916103ee565b820191906000526020600020905b8154815290600101906020018083116103d157829003601f168201915b5050505050905090565b6020604051908101604052806000815250905600a165627a7a7230582075df2e8285ff2267318b73c7abb960fdb1e46047f75f4984fea001efe490e9320029', 
            gas: '4700000'
          }, function (e, contract){
           console.log(e, contract);
           if (typeof contract.address !== 'undefined') {
                console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                $("#hashKey").val(contract.address);
           }
        })
  }
  
  function downloadHash(account,address){
    var myContract = web3.eth.contract(Contract);
     var contract = myContract.at(address);
     console.log(contract);
     var result = contract.getHash.call();
     console.log("Result : ",result);
     return result;
  }

  function abortHash(account, address){
    var myContract = web3.eth.contract(Contract);
    var contract = myContract.at(address);
    web3.eth.defaultAccount = account;
    contract.abort.call();
  }