export const sidebarConfig = [
  {
    id: 'integrations',
    name: 'Integrações',
    icon: 'uiIconGraphic',
    subItems: [
      {
        id: 'erp',
        name: 'ERPs',
        route: '/integracoes/erp',
        children: [
          { id: 'all', name: 'Todos', route: '/integracoes/erp' },
          { id: 'sienge', name: 'Sienge', route: '/integracoes/erp/sienge' },
          { id: 'uau', name: 'UAU', route: '/integracoes/erp/uau' },
          { id: 'informakon', name: 'Informakon', route: '/integracoes/erp/informakon' },
          { id: 'mega', name: 'Mega', route: '/integracoes/erp/mega' },
        ],
      },
      {
        id: 'others',
        name: 'Outros',
        children: [
          { id: 'api', name: 'Configurações Gerais', route: '/integracoes/facilita/api' },
          { id: 'webhook', name: 'Notificações', route: '/integracoes/facilita/webhook' },
        ],
      },
    ],
  },
  {
    id: 'subscriptions',
    name: 'Assinaturas',
    icon: 'uiIconCalculator',
    subItems: [
      {
        id: 'plans',
        name: 'Planos',
        children: [
          { id: 'basic', name: 'Básico', route: '/assinaturas/planos/basico' },
          { id: 'premium', name: 'Premium', route: '/assinaturas/planos/premium' },
        ],
      },
      {
        id: 'billing',
        name: 'Faturamento',
        children: [
          { id: 'invoices', name: 'Faturas', route: '/assinaturas/faturamento/faturas' },
          { id: 'payments', name: 'Pagamentos', route: '/assinaturas/faturamento/pagamentos' },
        ],
      },
    ],
  },
  {
    id: 'reports',
    name: 'Relatórios',
    icon: 'uiIconSquareUser',
    subItems: [
      {
        id: 'sales',
        name: 'Vendas',
        children: [
          { id: 'daily', name: 'Relatório Diário', route: '/relatorios/vendas/diario' },
          { id: 'monthly', name: 'Relatório Mensal', route: '/relatorios/vendas/mensal' },
        ],
      },
    ],
  },
  {
    id: 'settings',
    name: 'Configurações',
    icon: 'uiIconBusiness',
    subItems: [
      {
        id: 'general',
        name: 'Geral',
        children: [
          { id: 'system', name: 'Sistema', route: '/configuracoes/geral/sistema' },
          { id: 'preferences', name: 'Preferências', route: '/configuracoes/geral/preferencias' },
        ],
      },
    ],
  },
  {
    id: 'users',
    name: 'Usuários',
    icon: 'uiIconBrush',
    subItems: [
      {
        id: 'management',
        name: 'Gerenciamento',
        children: [
          { id: 'list', name: 'Lista de Usuários', route: '/usuarios/lista' },
          { id: 'roles', name: 'Perfis', route: '/usuarios/perfis' },
        ],
      },
    ],
  },
  {
    id: 'help',
    name: 'Ajuda',
    icon: 'uiIconUsers',
    subItems: [
      {
        id: 'support',
        name: 'Suporte',
        children: [
          { id: 'tickets', name: 'Tickets', route: '/ajuda/suporte/tickets' },
          { id: 'faq', name: 'FAQ', route: '/ajuda/suporte/faq' },
        ],
      },
    ],
  },
]
