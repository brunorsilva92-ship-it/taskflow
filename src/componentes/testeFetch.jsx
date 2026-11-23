
function TesteFetch() {
  const minhaPromise = new Promise((resolve, reject) => {
    // Simulando uma operação que demora 5 segundos
    setTimeout(() => {
      const operacaoDeuCerto = true;

      if (operacaoDeuCerto) {
        resolve("Dados chegaram!"); // → fulfilled
      } else {
        reject("Algo deu errado"); // → rejected
      }
    }, 5000);
  });

  function execPromise() {
    const minhaPromise = new Promise((resolve, reject) => {
      // Simulando uma operação que demora 2 segundos
      setTimeout(() => {
        const operacaoDeuCerto = true;

        if (operacaoDeuCerto) {
          resolve("Dados chegaram!"); // → fulfilled
        } else {
          reject("Algo deu errado"); // → rejected
        }
      }, 5000);
    });

    minhaPromise
      .then((mensagem) => {
        console.log("Sucesso:", mensagem);
      })
      .catch((erro) => {
        console.error("Erro:", erro);
      });
    console.log("Promise criada, aguardando resultado...");
  }

// async antes da função → ela passa a retornar uma Promise
async function buscarUsuario(id) {

  try {
    // await pausa a função até a Promise resolver
    // O JavaScript CONTINUA executando outras coisas enquanto espera
    const resposta = await fetch(
      'https://jsonplaceholder.typicode.com/users/' + id
    );
    
    const usuario = await resposta.json();
    console.log(usuario);
    console.log('Nome:', usuario.name);
    return usuario;

  } catch (erro) {
    // Qualquer erro dentro do try cai aqui
    // Exemplos: sem internet, URL inválida, JSON malformado
    console.log('Erro:', erro.message);
    return null; // retorna null para não quebrar quem chamou

  } finally {
    // Roda SEMPRE — com sucesso ou com erro
    // Útil para esconder spinner de loading, fechar conexões
    console.log('Finalizado');
  }
}


  return (
    <div>
      <button
        onClick={() => {
          minhaPromise
            .then((mensagem) => {
              console.log("Sucesso:", mensagem);
            })
            .catch((erro) => {
              console.error("Erro:", erro);
            });
          console.log("Promise criada, aguardando resultado...");
        }}
      >
        Testar Promise
      </button>
      <button onClick={execPromise}>Testar Promise (função)</button>
      <button onClick={() => buscarUsuario(1)}>Testar Async/Await</button>
    </div>
  );
}

export default TesteFetch;