//////////////////////////////////////////////////////////
/////         LIBRARY JS API SERIAL       ///////////////
/////         DEV MATHIAS SOUZA 09/04/24  //////////////
/////         CHROME,OPERA,EDGE           /////////////
///////////////////////////////////////////////////////
let bufferSys={
	bytes:[],
	index:0
};
const SILENCE_RX=100; //ms silence after last byte

///------CLASS--------
class SerialPort {
    ///---CONSTRUCT--
	constructor() {
		this.port = "";
		this.timeoutRx;
	}
	///-----AVAILABLE PORT IS OPEN----
	portIsOpen(){
		return this.port;
	}
	 
	///------CHECK PLUGIN TO BROWNSER----
	check(){
		console.log(navigator);
	   if ('serial' in navigator) {
		   return true;
	   }
	   else{
		    const error = document.createElement('p');
			error.innerHTML = '<p>Support for Serial Web API not enabled. Please enable it using chrome://flags/ and enable Experimental Web Platform fetures</p>';
			return false;
	   }
	}
	
	///----OPEN PORT SERIAL----
	open(baudRate){
		this.baudRate=baudRate;
		if (this.port) {
			this.port.close();
			this.port = undefined;
			return false;
		}
		else {
			this.getReader();
			return true;
		}
	}
  
	///-------SET STREAM TO TIMEOUT SILENCE----
	setStream(){
	    console.log("%c---RX Timeout Class---","color:green");
		console.log(bufferSys.bytes);
		onReceivedSerial(bufferSys.bytes);
		//-----Clear buffer----
		bufferSys.index=0;
		bufferSys.bytes=[];
	}
	///-------FIFO BUFFER RECEIVED----
	bufferFiFoReceived(arrayBytes,silenceTimeout){
	    ///-----Processamento de lotes----
		for(let value of arrayBytes){
			bufferSys.bytes[bufferSys.index++]=value;
		}
		clearTimeout(this.timeoutRx);
		this.timeoutRx = setTimeout(this.setStream,silenceTimeout);
	}
   ///----------GET READER-----
   async getReader() {
		this.port = await navigator.serial.requestPort({});
		//console.log(this.baudRate);
		await this.port.open({ baudRate: [this.baudRate] });
		//---READ [BYTE] SERIAL-----
		if(this.port.readable){
			while (this.port.readable) {
				const reader = this.port.readable.getReader();
				try {
					while (true) {
						const { value, done } = await reader.read();
						if (done) {
							break;
						}
						//console.log("%c---RX Class---","color:green");
						//console.log(value);
						this.bufferFiFoReceived(value,SILENCE_RX); //100ms default silence serial byte interrupt
					}
				} catch (error) {
					console.error("Erro ao ler da this.porta serial: ", error);
				} finally {
					reader.releaseLock();
				}
			}
			
		}
	}
	
	///---WRITE [ASCII] SERIAL-----
	async print(data) {
		if(this.port){
			console.log("%c---TX Class---","color:violet");
			console.log(data);
			let encoder = new TextEncoder();
			const dataArrayBuffer = encoder.encode(data);
			if (this.port && this.port.writable) {
				const writer = this.port.writable.getWriter();
				writer.write(dataArrayBuffer);
				writer.releaseLock();
			}
		}
		else{
			alert("Porta está fechada!");
		}
	}
	
	///---WRITE [BYTE] SERIAL-----
	async write(buff) {
		if(this.port){
			console.log("%c---TX Class---","color:blue");
			console.log(buff);
			let data="";
			for(let i=0;i<buff.length;i++)data+="1";
			let encoder = new TextEncoder();
			const dataArrayBuffer = encoder.encode(data);
			if (this.port && this.port.writable) {
				const writer = this.port.writable.getWriter();
				for(let i=0;i<buff.length;i++){
					dataArrayBuffer[i]=buff[i];
				}
				writer.write(dataArrayBuffer);
				writer.releaseLock();
			}
		}
		else{
			alert("Porta está fechada!");
		}
	}
	
	
	
}