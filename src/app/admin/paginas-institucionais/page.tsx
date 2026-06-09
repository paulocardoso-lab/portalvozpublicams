import { getSiteSettings } from '@/app/actions/settings';
import { requireAdmin } from '@/lib/auth-guard';
import { InstitucionalClient } from './InstitucionalClient';

export const dynamic = 'force-dynamic';

const D = {
  emailContato:        'redacao@vozpublicams.com.br',
  emailPublicidade:    'publicidade@vozpublicams.com.br',
  emailRedacao:        'redacao@vozpublicams.com.br',
  emailDenuncia:       'denuncia@vozpublicams.com.br',
  quemSomosIntro:
    'O Voz Pública MS nasceu em 2024 com uma convicção simples e cada vez mais rara: jornalismo de qualidade só existe quando é livre. Livre de patrocinadoras que ditam pautas, livre de grupos políticos que exigem silêncio, livre de interesses que não sejam os do leitor.',
  quemSomosMissao:
    'Investigar, apurar e publicar fatos que importam para os cidadãos sul-mato-grossenses. Fiscalizar o poder público, dar voz a quem não tem microfone e oferecer contexto em um mundo onde a desinformação avança mais rápido que a checagem.',
  quemSomosFinanciamento:
    'O Voz Pública MS é financiado por seus leitores. Não temos acionistas nem grupos empresariais por trás. Quem mantém este portal funcionando são as pessoas que reconhecem o valor de um jornalismo independente e escolhem apoiá-lo diretamente.',
  quemSomosTransparencia:
    'Publicamos nossa política editorial, nossos critérios de correção e nossas fontes de receita. Erros são corrigidos publicamente, com nota de correção visível no próprio texto.',
  quemSomosEquipe:
    'Somos jornalistas, editores e colaboradores que escolheram Mato Grosso do Sul como pauta permanente. Nosso time cresce à medida que nossos leitores crescem.',
  principiosIntro:
    'O jornalismo do Voz Pública MS é orientado por princípios que não negociamos, independentemente de quem esteja no poder ou de qual seja o custo comercial da publicação.',
  correcoesIntro:
    'Errar é inevitável. Esconder o erro não é tolerável. Esta política define como o Voz Pública MS reconhece, corrige e comunica falhas em suas publicações.',
  anuncieIntro:
    'O Voz Pública MS reúne o público mais engajado e crítico de Mato Grosso do Sul: leitores que valorizam informação de qualidade e têm alto nível de atenção ao que consomem.',
  anuncieCompromisso:
    'Todo conteúdo patrocinado é identificado claramente como publicidade. Não aceitamos anunciantes de partidos políticos, de empresas com histórico de violações ambientais graves ou de produtos que conflitem com nossa linha editorial.',
  trabalheIntro:
    'O Voz Pública MS é construído por pessoas que acreditam que jornalismo independente ainda é possível — e necessário. Se você pensa assim também, queremos te conhecer.',
  trabalhePerfil:
    'Valorizamos mais a curiosidade, o comprometimento com a verdade e a capacidade de apuração do que diplomas ou experiência em grandes veículos.',
  trabalheRemuneracao:
    'Trabalhamos com regime de colaboração (PJ) e, à medida que crescemos, expandimos a equipe fixa. Pagamos o que podemos, explicamos por quê, e crescemos juntos conforme o portal cresce.',
  trabalheCandidatura:
    'Envie um e-mail com o assunto "Quero fazer parte". Inclua uma apresentação curta, links para trabalhos publicados e o que você gostaria de fazer no Voz Pública MS.',
};

export default async function PaginasInstitucionaisPage() {
  await requireAdmin();
  const settings = await getSiteSettings();

  const val = (key: string, fallback: string) =>
    (settings[key] as string | undefined)?.trim() || fallback;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-[24px] font-display font-bold">Páginas institucionais</h1>
        <p className="text-vp-text-3 text-[13px] mt-1">
          Edite os textos e dados de contato exibidos nas páginas públicas institucionais do portal.
        </p>
      </div>

      <InstitucionalClient
        emailContato={val('institucional.email_contato', D.emailContato)}
        emailPublicidade={val('institucional.email_publicidade', D.emailPublicidade)}
        emailRedacao={val('institucional.email_redacao', D.emailRedacao)}
        emailDenuncia={val('institucional.email_denuncia', D.emailDenuncia)}
        quemSomosIntro={val('institucional.quem_somos_intro', D.quemSomosIntro)}
        quemSomosMissao={val('institucional.quem_somos_missao', D.quemSomosMissao)}
        quemSomosFinanciamento={val('institucional.quem_somos_financ', D.quemSomosFinanciamento)}
        quemSomosTransparencia={val('institucional.quem_somos_transp', D.quemSomosTransparencia)}
        quemSomosEquipe={val('institucional.quem_somos_equipe', D.quemSomosEquipe)}
        principiosIntro={val('institucional.principios_intro', D.principiosIntro)}
        correcoesIntro={val('institucional.correcoes_intro', D.correcoesIntro)}
        anuncieIntro={val('institucional.anuncie_intro', D.anuncieIntro)}
        anuncieCompromisso={val('institucional.anuncie_compromisso', D.anuncieCompromisso)}
        trabalheIntro={val('institucional.trabalhe_intro', D.trabalheIntro)}
        trabalhePerfil={val('institucional.trabalhe_perfil', D.trabalhePerfil)}
        trabalheRemuneracao={val('institucional.trabalhe_remuneracao', D.trabalheRemuneracao)}
        trabalheCandidatura={val('institucional.trabalhe_candidatura', D.trabalheCandidatura)}
      />
    </div>
  );
}
