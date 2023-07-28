<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Como rodar o projeto

OBS: É necessário ter o docker e docker-compose instalado na máquina.

Ao abrir o projeto na pasta raiz, crie um arquivo .env com base no arquivo .env.example e adicione as variáveis de ambiente.

Então rode o comando abaixo para subir o banco de dados e o servidor.

```bash
docker-compose up -d
```
ou
```bash
docker-compose up -d --build
```

Para testar as rotas, importe o arquivo nestjs-authentication-example.postman_collection.json pelo [postman](https://postman.com)

## Visualizando os e-mails

Se o projeto for inicializado utilizando o servidor SMTP do mailgun, só será possível enviar e-mails para os endereços cadastrados dentro da plataforma. 
Portanto utilize o e-mail amanda-frizzera@tuamaeaquelaursa.com e visualize os envios através desse [link](https://tuamaeaquelaursa.com/amanda-frizzera)
