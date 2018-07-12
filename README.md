# Sanitizer.js

O `Sanitizer.js` é uma biblioteca para realizar a limpeza de dados em objetos e
arrays de forma simplificada.

Sanitizers podem ser usados ​​para padronizar dados para facilitar a validação ou
fornecer consistência nos dados.

> **Atenção**: Esta biblioteca ainda está em desenvolvimento e ainda é apenas
> um protótipo

## Estudo de caso

Em aplicações SPA é muito comum que tenhamos que realizar tratamentos de dados
antes de realizar o envio para API, desmascarando valores, convertendo datas,
removendo campos nulos e coisa do gênero.

Esta biblioteca surgiu da necessidade de se fazer esse trabalho de forma mais
simplificada, baseada no caminho até a informação desejada ao invés de criarmos
loops, diminuindo significativamente a quantidade de código para realizar esta
tarefa, auxiliando na manutenibilidade do projeto.

O `Sanitizer.js` foi escrito baseado na "notação de ponto" existente na
[validação do framework Laravel](https://laravel.com/docs/5.6/validation#validating-arrays).

## Começando

Essas instruções farão com que você tenha uma cópia deste projeto em
execução na sua máquina local para fins de desenvolvimento e teste.

### Pré-requisitos

Até o momento o `Sanitizer.js` depende do `lodash` para funcionar, mas em versões
futuras essa dependência será removida.

### Como testar

Por se tratar ainda de um protótipo, até o momento não há uma forma elegante
de você adicionar esta biblioteca aos seus projetos. Por enquanto, ela funciona
apenas no ambiente de testes.

1. Instale as dependências com o comando `npm i`.
2. Execute os testes com o comando `npm run test`.

## Uso básico

Imagine uma situação bem comum em que você possui um objeto que contém um nome
e múltiplos telefones e você precisa enviar para sua API o nome em uppercase
e os telefones sem máscara.

É uma situação bem simples, que pode ser resolvida com um loop simples, algumas
funções  de manipulação de strings e expressões regulares. Porém, a ideia desta
biblioteca é abstrair o máximo possível a iteração sobre os dados, cabendo à você
apenas especificar o que deve ser modificado.

#### Com assim? Não Entendi foi é nada!

Vamos ao código.

Primeiro, vamos construir um objeto que precisa ser sanitizado de acordo com a
descrição anterior.

```JS
const data = {
  "name": "Adriano de Azevedo",
  "phones": [
    "(66) 9 9999-6666",
    "(66) 9 9999-7777",
    "(66) 9 9999-8888",
  ]
};
```
Vamos criar nossas regras de sanitização que irão modificar os dados.

```JS
const toUpper = text => text.toUpperCase();
const onlyNumbers = text => text.replace(/\D/g, '');
```

> **Atenção:** Vale lembrar que em uma aplicação real você não precisará criar
> estas funções toda vez que precisar realizar uma modificação nos dados. Basta
> você apenas importá-las ou adicioná-las ao escopo global da sua aplicação. Então
> o trecho de código acima é apenas um exemplo.


E agora vamos executar o sanitizer, informando os valores que deverão ser
alterados e as regras que serão aplicadas.

```JS
sanitizer(data, {
  name: toUpper,
  phones: onlyNumbers,
});
// << { name: 'ADRIANO DE AZEVEDO', phones: [ '66999996666', '66999997777', '66999998888'] }
```

Exemplo completo:

```JS
const toUpper = text => text.toUpperCase();
const onlyNumbers = text => text.replace(/\D/g, '');

const data = {
  "name": "Adriano de Azevedo",
  "phones": [
    "(66) 9 9999-6666",
    "(66) 9 9999-7777",
    "(66) 9 9999-8888",
  ]
};

sanitizer(data, {
  name: toUpper,
  phones: onlyNumbers,
});
// << { name: 'ADRIANO DE AZEVEDO', phones: [ '66999996666', '66999997777', '66999998888'] }
```

> Legal, mas não vi tanta utilidade assim! Daá pra ser melhor que isso, né? A
> resposta é sim!

## Iterando sobre dados complexos

Esta biblioteca possui um fluxo de código recursivo que irá te auxiliar quando precisar
realizar modificações em objetos mais complexos que no exemplo descrito acima.

### WTF?

Vamos a mais um cenário, um pouco mais complexo que o descrito anteriormente.

Supomos que agora, ao invés de você enviar somente o número do telefone sem máscara,
agora sua API passou a exigir que você realize o envio de uma informação extra, o tipo
do telefone (fixo, celular).

No cenário anterior, tínhamos uma string simples, agora serão enviados objetos contendo suas
duas informações: o telefone e o tipo do telefone.

### Notação de ponto

Podemos iterar sobre dados complexos utilizando a "notação de ponto" descrita no
início deste documento.

```JS
const data = {
  "name": "Adriano de Azevedo",
  "phones": [
    {
      "phone": "(66) 9 9999-6666",
      "type": "mobile"
    },
    {
      "phone": "(66) 3544-7800",
      "type": "landline"
    }
  ]
};

sanitizer(data, {
  name: toUpper,
  "phones.*.phone": onlyNumbers,
});
```

> Sem loops para você ter que dar manutenção, viu?

Por se tratar de uma função recursiva, você pode utilizar tantos níveis quanto forem
necessários. **Por exemplo:**

```JS
sanitizer(data, {
  name: toUpper,
  "example.*.very.*.long.*.object": aMagicFunction
});
```

### Múltiplos modificadores

Há situações ainda mais complexas que as descritas acima, onde precisamos aplicar diversos
modificadores à um valor.

Vamos supor que por algum motivo você precise em uma string, converter todos os caracteres
para uppercase, remover todos os valores numéricos e inverter a string.

```JS
const toUpper = text => text.toUpperCase();
const onlyNonNumbers = text => text.replace(/\d/g, '');
const reverseString = text => text.split('').reverse().join('').trim();

const data = {
  value: '123456789 O Sanitizer é legal 123456789',
};

sanitizer(data, {
  value: [
    toUpper,
    onlyNonNumbers,
    reverseString,
  ],
});
```

## O que o sanitizer faz?

Por se tratar apenas de um protótipo muito básico, não é muito viável escrever uma
documentação gigantesca. Mas já posso adiantar que ele também funciona com arrays
se você quiser ver um exemplo, basta dar uma olhada nos arquivos de testes.

## Próximas etapas

- [ ] Criar funcionalidade para remover valores indesejados. (Filtro pra arrays e delete para chaves em objetos)
- [ ] Remover dependência do lodash.
- [ ] Adicionar regras de sanitização padrões similares ao laravel.
- [ ] Adicionar regras de sanitização personalizadas similares ao ao laravel.
- [ ] Completar documentação.
- [ ] Publicar no npm.

## Contribuindo

Por favor leia o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes
sobre como enviar suas pull requests.

Encontrou algum problema? Possui alguma sugestão? Abra uma Issue!

## Versionamento

Usei [SemVer](http://semver.org/) para controle de versão. Para as versões disponíveis, veja as
[tags neste repositório](https://github.com/drianoaz/sanitizer.js/tags).

## Autores

- **Adriano de Azevedo** - _Trabalho inicial_ - [@drianoaz](https://twitter.com/drianoaz)

Veja também a lista de [contribuidores](https://github.com/drianoaz/sanitizer.js/contributors) que
participaram deste projeto.

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo
[LICENSE.md](LICENSE.md) para mais detalhes.

## Agradecimentos

- [Guilherme Pendezza](https://twitter.com/gui_sus)
