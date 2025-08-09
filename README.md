# BarberPro Frontend

Frontend moderno e responsivo para o sistema de gestão de barbearias BarberPro, desenvolvido com Next.js 15, TypeScript e Tailwind CSS.

## 🚀 Características

- **Interface Moderna**: Design limpo e profissional com Tailwind CSS
- **Responsivo**: Otimizado para desktop, tablet e mobile
- **TypeScript**: Tipagem estática para melhor desenvolvimento
- **Autenticação**: Sistema de login/logout com JWT
- **Navegação**: Menu lateral responsivo com navegação intuitiva
- **Dashboard**: Métricas em tempo real e visão geral do negócio
- **Adaptado para Angola**: Moeda local (AOA), mobile-first, otimizado para conexões lentas

## 🛠️ Tecnologias

- **Next.js 15**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utilitário
- **Lucide React**: Ícones modernos
- **Axios**: Cliente HTTP
- **React Hook Form**: Gerenciamento de formulários
- **Zod**: Validação de esquemas
- **date-fns**: Manipulação de datas

## 📦 Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd barberpro-frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env.local
   ```
   
   Edite o arquivo `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_APP_NAME=BarberPro
   NEXT_PUBLIC_APP_VERSION=1.0.0
   NEXT_PUBLIC_DEBUG=true
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   ```
   http://localhost:3000
   ```

## 🏗️ Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── (auth)/            # Rotas de autenticação
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Dashboard principal
│   ├── appointments/      # Gestão de agendamentos
│   ├── clients/          # Gestão de clientes
│   ├── barbers/          # Gestão de barbeiros
│   ├── services/         # Gestão de serviços
│   ├── inventory/        # Gestão de estoque
│   ├── reports/          # Relatórios
│   └── settings/         # Configurações
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes base (shadcn/ui)
│   ├── layout/          # Layouts da aplicação
│   ├── appointment/     # Componentes de agendamento
│   ├── dashboard/       # Componentes do dashboard
│   └── forms/           # Formulários
└── lib/                 # Utilitários e configurações
    ├── api.ts           # Cliente da API
    ├── auth-context.tsx # Contexto de autenticação
    └── utils.ts         # Funções utilitárias
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de linting
- `npm run lint:fix` - Correção automática de linting
- `npm run type-check` - Verificação de tipos TypeScript
- `npm run format` - Formatação de código
- `npm run format:check` - Verificação de formatação

## 🎨 Componentes UI

O projeto utiliza componentes baseados no [shadcn/ui](https://ui.shadcn.com/) com Tailwind CSS:

- **Button**: Botões com variantes e tamanhos
- **Card**: Cards para conteúdo
- **Input**: Campos de entrada
- **Label**: Rótulos para formulários
- **Badge**: Badges para status
- **Avatar**: Avatares de usuário
- **Select**: Seletores dropdown
- **Calendar**: Calendário para agendamentos

## 🔐 Autenticação

O sistema de autenticação utiliza:

- **JWT Tokens**: Access e refresh tokens
- **Context API**: Gerenciamento de estado global
- **Interceptors**: Adição automática de headers
- **Proteção de Rotas**: Redirecionamento automático

### Uso do Context de Autenticação

```typescript
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Usar os métodos de autenticação
}
```

## 📱 Responsividade

O frontend é totalmente responsivo com:

- **Mobile-First**: Design otimizado para smartphones
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Navegação Adaptativa**: Menu hambúrguer em mobile
- **Grid Flexível**: Layouts que se adaptam ao tamanho da tela

## 🌍 Adaptações para Angola

- **Moeda Local**: Preços em Kwanzas (AOA)
- **Formatação**: Números formatados para o padrão local
- **Mobile-First**: Considerando o alto uso de smartphones
- **Performance**: Otimizado para conexões 3G
- **Offline**: Funcionalidades básicas sem internet

## 🔌 Integração com Backend

O frontend se comunica com o backend através da API REST:

```typescript
import { apiService } from '@/lib/api';

// Exemplos de uso
const appointments = await apiService.getAppointments();
const newClient = await apiService.createClient(clientData);
const metrics = await apiService.getDashboardMetrics();
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outras Plataformas

- **Netlify**: Build command: `npm run build`, Publish directory: `out`
- **Railway**: Configuração automática
- **Docker**: Use o Dockerfile incluído

## 🧪 Testes

```bash
# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

## 📝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Documentação**: [docs.barberpro.ao](https://docs.barberpro.ao)
- **Email**: suporte@barberpro.ao
- **WhatsApp**: +244 123 456 789

## 🔄 Changelog

### v1.0.0 (2024-01-15)
- ✨ Lançamento inicial
- 🎨 Interface moderna com Tailwind CSS
- 🔐 Sistema de autenticação JWT
- 📱 Design responsivo mobile-first
- 🌍 Adaptações para o mercado angolano
- 📊 Dashboard com métricas em tempo real
- 🔧 Integração completa com backend multitenancy
