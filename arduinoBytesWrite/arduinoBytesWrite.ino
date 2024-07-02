uint8_t bufferIn[4]={0,0,0,0};
void setup() {
  // Inicia a comunicação serial a 9600 bits por segundo
  Serial.begin(9600);
}

void loop() {
  // Envia os bytes
  //Serial.write(random(25,30));
  //Serial.write(random(0,99));
  //Serial.write(random(0,20));
  ///----Recebimento de dados da porta Serial-----
  if(Serial.available()>0){
    delay(50);
    uint8_t idx=0;
    while(Serial.available()>0){
      bufferIn[idx++]=Serial.read();
    }
    Serial.write(bufferIn,4);
  }

  // Aguarda 3 segundos (3000 milissegundos)
  //delay(5000);
}