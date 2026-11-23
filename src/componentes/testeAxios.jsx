import axios from "axios";
import { useState } from "react";

function TesteAxios() {
  const [cep, setCep] = useState(""); 


  async function exemplo() {
    try {
      // axios.get() retorna um objeto de resposta
      const resposta = await axios.get(
        "https://jsonplaceholder.typicode.com/users/1",
      );

      // resposta.data ja e o objeto JavaScript
      // Nao precisa de .json() — Axios faz isso automaticamente
      console.log('Response', resposta); 
      console.log('Response Data', resposta.data); 
      console.log(resposta.data.name); // 'Leanne Graham'
      console.log(resposta.data.email); // 'Leanne Graham'
      console.log(resposta.status); // 200
    } catch (erro) {
      console.log(erro.message);
    }
  }

  async function consultaCEP(cep) {
    try {
      const resposta = await axios.get(
        `https://viacep.com.br/ws/${cep}/json/`,
      );
      console.log('CEP Data', resposta.data);
    } catch (erro) {
      console.log(erro.message);
    }
  }

  return(
    <div>
      <button onClick={exemplo}>Testar Axios</button>
        <br />
      <input 
        type="text" 
        placeholder="Digite o CEP" 
        value={cep}
        onChange={(e) => setCep(e.target.value)}
      />
      <button onClick={() => consultaCEP(cep)}>Consultar CEP</button>
    </div>
  );
}

export default TesteAxios;
