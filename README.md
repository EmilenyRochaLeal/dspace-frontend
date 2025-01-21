# DSpace Angular Customization Project

Este projeto documenta os passos necessários para configurar, customizar e executar o frontend do DSpace Angular, além de corrigir os erros encontrados durante o processo.

## Pré-requisitos

Certifique-se de ter os seguintes softwares instalados no seu sistema:
- Node.js
- Yarn
- Docker e Docker Compose

## Etapas de Configuração

### 1. Atualização do sistema e instalação do Docker

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose -y
```

Verifique as instalações:

```bash
docker --version
docker-compose --version
```

Caso o `docker-compose` não funcione devido ao erro do módulo `distutils`, resolva com:

```bash
sudo apt remove docker-compose -y
sudo apt install docker-compose-plugin -y
docker-compose --version
```

### 2. Configuração do Projeto

1. Crie uma pasta para o projeto:

    ```bash
    mkdir ~/dspaceProject
    cd ~/dspaceProject
    ```

2. Clone o repositório do frontend:

    ```bash
    git clone https://github.com/DSpace/dspace-angular.git
    ```

### 3. Configuração de Variáveis de Ambiente

1. Crie o arquivo `config.dev.yml` na pasta `config`:

    ```yaml
    rest:
      ssl: false
      host: 'localhost'
      port: 8080
      nameSpace: /server
    ```

2. Certifique-se de que o tipo da chave `rest` está definido no arquivo `server-config.interface.ts` como:

    ```typescript
    export class ServerConfig implements Config {
      public ssl: boolean;
      public host: string;
      public port: number;
      public nameSpace: string;
      public baseUrl?: string;
    }
    ```

### 4. Instalação de Dependências e Inicialização do Projeto

1. Instale as dependências:

    ```bash
    yarn install
    ```

2. Inicialize o projeto:

    ```bash
    yarn start
    ```

### 5. Resolução do Erro de Memória Heap

Caso o erro **"JavaScript heap out of memory"** ocorra:

1. Verifique a memória disponível:

    ```bash
    free -h
    ```

2. Aumente o limite de memória heap:

    ```bash
    NODE_OPTIONS="--max-old-space-size=4096" yarn start
    ```

3. Se o problema persistir, remova os módulos e reinstale:

    ```bash
    rm -rf node_modules package-lock.json yarn.lock
    yarn install
    NODE_OPTIONS="--max-old-space-size=4096" yarn start
    ```

### 6. Envio para o GitHub

1. Inicialize o repositório:

    ```bash
    git init
    ```

2. Verifique o repositório remoto:

    ```bash
    git remote -v
    ```

3. Caso o repositório esteja vinculado ao oficial, remova e adicione o seu:

    ```bash
    git remote remove origin
    git remote add origin <URL>
    git remote -v
    ```

4. Adicione e envie as alterações:

    ```bash
    git add .
    git commit -m "first commit"
    git branch -M main
    git push -u origin main
    ```

## Estrutura de Pastas

- **config**: Arquivos de configuração para desenvolvimento e produção. Inclui a configuração do backend na chave `rest` e o tema do sistema.
- **app**: Componentes e páginas do projeto.
- **shared**: Configuração de alertas, animações, seletores e formulários.
- **assets**: Imagens e ícones utilizados no projeto.
- **environments**: Variáveis de ambiente.
- **themes**: Pacotes visuais do DSpace.

## Customização

### 1. Alteração no Tema

1. Modifiquei os arquivos `home-news.component.html` e `home-news.component.scss` na pasta `theme/dspace` para alterar o layout da página inicial.

### 2. Adição de um Novo Componente

1. Copiei a pasta do componente `footer` para a pasta `custom`.
2. Configurei o arquivo `eager-theme.module.ts`:

    - Importe o componente:

      ```typescript
      import { FooterComponent } from './footer/footer.component';
      ```

    - Adicione o componente em `declarations`:

      ```typescript
      declarations: [FooterComponent]
      ```

3. No arquivo `footer.component.ts`, configurei o seletor e os arquivos para alta prioridade:

    ```typescript
    selector: 'ds-themed-footer',
    // styleUrls: ['./footer.component.scss'],
    styleUrls: ['../../../../app/footer/footer.component.scss'],
    // templateUrl: './footer.component.html'
    ```

4. Para configurações de prioridade menor, utilize o arquivo `lazy-theme.module.ts`.
