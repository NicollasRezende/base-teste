#!/bin/bash
# Script para corrigir avisos de "mixed declarations" em arquivos SCSS

# Lista de arquivos que precisam ser corrigidos
FILES_TO_FIX=(
    "scss/paginas/_sobre.scss"
    "scss/paginas/_quartos.scss"
    "scss/paginas/_servicos.scss" 
    "scss/paginas/_contato.scss"
)

# Função para aplicar a correção a um arquivo SCSS
fix_file() {
    local file=$1
    echo "Corrigindo $file..."
    
    # Faz backup do arquivo original
    cp "$file" "${file}.bak"
    
    # Busca pelo padrão @include m.container; e adiciona blocos & {} ao redor das declarações CSS subsequentes
    sed -i -E '
    # Para @include m.container; seguido por declarações
    /@include m\.container;/{
        # Procuramos por linhas que tenham declarações CSS após o @include
        n
        # Se for um espaço em branco, continue
        /^\s*$/n
        # Se for um comentário, continue
        /^\s*\/\//n
        /^\s*\/\*/n
        # Se for & { já existe o wrapper, pule
        /^\s*& {/n
        # Se for alguma outra coisa, deve ser uma declaração CSS
        s/^(\s*)([^@&{}]*;)/\1& {\n\1    \2/
        
        # Agora precisamos adicionar o fechamento do bloco
        # Vamos ler as próximas linhas até encontrar uma regra aninhada ou fim do bloco
        :a
        n
        # Se for um espaço em branco, continue
        /^\s*$/ba
        # Se for um comentário, continue
        /^\s*\/\//ba
        /^\s*\/\*/ba
        # Se for outra declaração CSS, mantenha-a dentro do bloco
        /^\s*[a-z-]+:/s/^(\s*)([^@&{}]*;)/\1    \2/
        /^\s*[a-z-]+:/ba
        # Se for uma regra aninhada ou outro bloco, feche o & {}
        s/^(\s*)(@|&|\.|[a-z])/\1}\n\n\1\2/
    }
    
    # Para @include m.respond-to ou outras funções que possam ter declarações depois
    # Esta parte não é perfeita e pode precisar de ajustes manuais
    /@include (m\.)?(respond-to|container|section-padding).*\{/,/\}/{
        # Após o fechamento da regra, procura por declarações
        /\}/{
            n
            # Se for um espaço em branco, continue
            /^\s*$/n
            # Se for um comentário, continue
            /^\s*\/\//n
            /^\s*\/\*/n
            # Se for & { já existe o wrapper, pule
            /^\s*& {/n
            # Se for outra regra aninhada, pule
            /^\s*@/n
            /^\s*&/n
            /^\s*\}/n
            # Se for alguma outra coisa, deve ser uma declaração CSS
            s/^(\s*)([^@&{};]*;)/\1& {\n\1    \2/
            
            # Agora precisamos adicionar o fechamento do bloco
            :b
            n
            # Se for um espaço em branco, continue
            /^\s*$/bb
            # Se for um comentário, continue
            /^\s*\/\//bb
            /^\s*\/\*/bb
            # Se for outra declaração CSS, mantenha-a dentro do bloco
            /^\s*[a-z-]+:/s/^(\s*)([^@&{}]*;)/\1    \2/
            /^\s*[a-z-]+:/bb
            # Se for uma regra aninhada ou outro bloco, feche o & {}
            s/^(\s*)(@|&|\.|[a-z])/\1}\n\n\1\2/
        }
    }
    ' "$file"
    
    echo "Correção finalizada para $file"
}

# Aplica a função para cada arquivo
for file in "${FILES_TO_FIX[@]}"; do
    if [ -f "$file" ]; then
        fix_file "$file"
    else
        echo "Arquivo não encontrado: $file"
    fi
done

echo "Correções concluídas. Compile o SCSS para verificar se os avisos foram resolvidos."
echo "Caso ainda existam avisos, pode ser necessário fazer ajustes manuais."