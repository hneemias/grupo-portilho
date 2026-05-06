const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://supabase.hneemias.cloud";
const supabaseKey = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc3NjM2NDE0MCwiZXhwIjo0OTMyMDM3NzQwLCJyb2xlIjoiYW5vbiJ9.NDAON4Sxn9uay4CMJRLSIZ6kMWnJYBxNgj2ezE9-9Rs";
const supabase = createClient(supabaseUrl, supabaseKey);

const kpis = [
    { label: "+41 MIL", valor: "Hectares Operados", unidade: "Área Total", ordem: 1 },
    { label: "16.800", valor: "Hectares no Paraguai", unidade: "Operação Internacional", ordem: 2 },
    { label: "7.925", valor: "Hectares em Pium-TO", label_kpi: "Expansão Regional", unidade: "Expansão Regional", ordem: 3 },
    { label: "6.165", valor: "Hectares em Gurupi", unidade: "Hub Logístico", ordem: 4 },
    { label: "2038", valor: "Segurança Contratual", unidade: "Operações Garantidas", ordem: 5 },
    { label: "2.226", valor: "Hectares Sucupira", unidade: "Produção Ativa", ordem: 6 }
];

async function run() {
    console.log('--- Iniciando Sincronização de KPIs ---');
    
    // 1. Limpar tabela atual
    const { error: deleteError } = await supabase.from('gp_kpis').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.error('Erro ao limpar KPIs:', deleteError);
        return;
    }
    console.log('✔ KPIs antigos removidos.');

    // 2. Inserir novos KPIs
    // Ajustando os nomes das colunas conforme o mapeamento do DB
    const finalKpis = kpis.map(k => ({
        label: k.label,
        valor: k.valor,
        unidade: k.unidade,
        ordem: k.ordem
    }));

    const { error: insertError } = await supabase.from('gp_kpis').insert(finalKpis);
    if (insertError) {
        console.error('Erro ao inserir novos KPIs:', insertError);
        return;
    }
    console.log('✔ Novos KPIs reais inseridos com sucesso.');
    console.log('--- Sincronização Concluída ---');
}

run();
