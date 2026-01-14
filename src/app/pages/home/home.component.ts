// home.component.ts
import { Component } from '@angular/core';
import { importBase } from 'src/app/shared/constant/import-base.constant';

type PlanName = 'FREE' | 'PRO';

type ToolStatus = 'ACTIVE' | 'SOON';

type ToolBadge = { label: string; type: 'recommended' | 'new' | 'popular' };

type Tool = {
  id: string;
  name: string;
  description: string;
  categoryKey: string;
  categoryLabel: string;
  planRequired: PlanName;
  status: ToolStatus;
  badges?: ToolBadge[];
  lastOpenedLabel?: string; // apenas para "recentes"
};

@Component({
  selector: 'app-home',
	imports: [importBase],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // Mock do perfil (resultado do questionário)
  profile = {
    name: 'Igor',
    primaryArea: 'LAWYER',
    primaryAreaLabel: 'Advocacia',
    primaryGoal: 'ORGANIZE_FINANCES',
    primaryGoalLabel: 'Organizar financeiro',
  };

  // Mock de plano do usuário
  plan = {
    name: 'FREE' as PlanName,
    canUpgrade: true,
    toolsAccessLabel: 'Ferramentas básicas',
    supportLabel: 'Padrão',
  };

  searchTerm = '';
  selectedCategory: 'ALL' | string = 'ALL';
  suggestion = '';

  onboardingSteps = [
    { label: 'Perfil cadastrado', done: true },
    { label: 'Completar dados (opcional)', done: false, cta: 'Completar', action: () => this.openProfile() },
    { label: 'Usar sua 1ª ferramenta', done: false, cta: 'Ver recomendadas', action: () => this.scrollToRecommended() },
  ];

  categories = [
    { key: 'FINANCE', label: 'Financeiro' },
    { key: 'CONTRACTS', label: 'Contratos' },
    { key: 'MARKETING', label: 'Marketing' },
    { key: 'PRODUCTIVITY', label: 'Produtividade' },
    { key: 'CUSTOMER', label: 'Atendimento' },
  ];

  // Mock de ferramentas (seed local)
  tools: Tool[] = [
    {
      id: 't1',
      name: 'Gerador de Contrato PJ',
      description: 'Crie contratos com templates e exporte em PDF.',
      categoryKey: 'CONTRACTS',
      categoryLabel: 'Contratos',
      planRequired: 'PRO',
      status: 'ACTIVE',
      badges: [{ label: 'Recomendado', type: 'recommended' }],
    },
    {
      id: 't2',
      name: 'Calculadora de Impostos',
      description: 'Estimativa rápida de impostos e pró-labore.',
      categoryKey: 'FINANCE',
      categoryLabel: 'Financeiro',
      planRequired: 'FREE',
      status: 'ACTIVE',
      badges: [{ label: 'Popular', type: 'popular' }],
    },
  ];

  recentTools: Tool[] = [
    { ...this.tools[1], lastOpenedLabel: 'Hoje • 15:20' },
    { ...this.tools[2], lastOpenedLabel: 'Ontem • 21:10' },
  ];

  get recommendedTools(): Tool[] {
    const score = (t: Tool) => {
      let s = 0;
      if (this.profile.primaryGoal === 'ORGANIZE_FINANCES' && t.categoryKey === 'FINANCE') s += 3;
      if (t.categoryKey === 'PRODUCTIVITY') s += 2;
      if (t.badges?.some(b => b.type === 'popular')) s += 1;
      if (t.badges?.some(b => b.type === 'new')) s += 1;
      return s;
    };

    return [...this.tools].sort((a, b) => score(b) - score(a)).slice(0, 6);
  }

  get filteredRecommendedTools(): Tool[] {
    return this.filterBySearch(this.recommendedTools);
  }

  get filteredToolsByCategory(): Tool[] {
    const base =
      this.selectedCategory === 'ALL'
        ? this.tools
        : this.tools.filter(t => t.categoryKey === this.selectedCategory);

    return this.filterBySearch(base);
  }

  filterBySearch(list: Tool[]): Tool[] {
    const q = (this.searchTerm || '').trim().toLowerCase();
    if (!q) return list;

    return list.filter(t =>
      (t.name + ' ' + t.description + ' ' + t.categoryLabel).toLowerCase().includes(q),
    );
  }

  isLocked(tool: Tool): boolean {
    if (tool.planRequired === 'FREE') return false;
    return this.plan.name !== 'PRO';
  }

  openTool(tool: Tool) {
    if (tool.status !== 'ACTIVE') return;
    if (this.isLocked(tool)) return this.upgrade();

    // depois: navegar para rota do tool ou abrir módulo
    console.log('Abrindo ferramenta', tool);
  }

  viewDetails(tool: Tool) {
    console.log('Detalhes', tool);
  }

  joinWaitlist(tool: Tool) {
    console.log('Entrou na lista de espera', tool);
  }

  openAllTools() {
    console.log('Ver todas');
  }

  upgrade() {
    console.log('Abrir tela de upgrade');
  }

  openProfile() {
    console.log('Abrir perfil');
  }

  scrollToRecommended() {
    console.log('Scroll recomendado');
  }

  sendSuggestion() {
    console.log('Sugestão enviada:', this.suggestion);
    this.suggestion = '';
  }
}
