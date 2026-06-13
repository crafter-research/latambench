#!/bin/bash
# Deploy LatamGPT-SFT-1.0 on vast.ai with vLLM (OpenAI-compatible :8000).
# Requiere: vastai CLI autenticado (vastai set api-key ...).
# Uso:
#   bash deploy-latamgpt-vast.sh search          # ver ofertas candidatas
#   bash deploy-latamgpt-vast.sh up OFFER_ID     # rentar y servir
#   bash deploy-latamgpt-vast.sh status INSTANCE_ID
#   bash deploy-latamgpt-vast.sh endpoint INSTANCE_ID  # imprime la URL compat: para el harness
#   bash deploy-latamgpt-vast.sh down INSTANCE_ID
set -euo pipefail

VASTAI="${VASTAI_BIN:-$HOME/Library/Python/3.14/bin/vastai}"
MODEL="latam-gpt/Llama-3.1-70B-LatamGPT-SFT-1.0"
QUERY='num_gpus=2 gpu_name=A100_SXM4 inet_down>800 disk_space>250 reliability>0.99 verified=true rentable=true'

case "${1:?uso: search|up|status|endpoint|down}" in
  search)
    echo "== 2x A100 SXM4 =="
    $VASTAI search offers "$QUERY" -o 'dph' | head -8
    echo "== alternativa: 1x B200/H200 192GB+ =="
    $VASTAI search offers 'num_gpus=1 gpu_total_ram>180 inet_down>800 disk_space>250 reliability>0.99 verified=true rentable=true' -o 'dph' | head -8
    ;;
  up)
    OFFER="${2:?falta OFFER_ID (usa: search)}"
    NGPU="${3:-2}"  # 2 para A100s, 1 para B200
    $VASTAI create instance "$OFFER" \
      --image vllm/vllm-openai:latest \
      --disk 250 \
      --env '-p 8000:8000' \
      --args --model "$MODEL" --tensor-parallel-size "$NGPU" --max-model-len 4096 --host 0.0.0.0 --port 8000
    echo "Guarda el new_contract (INSTANCE_ID). El modelo tarda ~30-45 min en descargar+cargar."
    echo "Chequea con: $0 status INSTANCE_ID"
    ;;
  status)
    IID="${2:?falta INSTANCE_ID}"
    $VASTAI show instance "$IID" --raw | python3 -c "
import json,sys
d=json.load(sys.stdin)
print('estado:', d.get('actual_status'), '| intended:', d.get('intended_status'))
print('gpu:', d.get('gpu_name'), 'x', d.get('num_gpus'), '| \$/h:', d.get('dph_total'))
ip=d.get('public_ipaddr'); ports=(d.get('ports') or {}).get('8000/tcp')
if ip and ports: print('endpoint: http://%s:%s/v1' % (ip.strip(), ports[0]['HostPort']))
else: print('endpoint: aun no mapeado')
"
    ;;
  endpoint)
    IID="${2:?falta INSTANCE_ID}"
    $VASTAI show instance "$IID" --raw | python3 -c "
import json,sys
d=json.load(sys.stdin)
ip=d.get('public_ipaddr'); ports=(d.get('ports') or {}).get('8000/tcp')
if not (ip and ports): sys.exit('endpoint aun no disponible')
url='http://%s:%s/v1' % (ip.strip(), ports[0]['HostPort'])
print(url)
print()
print('# health check:')
print('curl -s %s/models | head -c 300' % url)
print()
print('# correr el eval:')
print('bun src/cli.ts run --model \"compat:%s|%s\" --benchmark trueque --seed 42' % (url, '$MODEL'))
" MODEL="$MODEL"
    ;;
  down)
    IID="${2:?falta INSTANCE_ID}"
    $VASTAI destroy instance "$IID" && echo "instancia $IID destruida (billing detenido)"
    ;;
esac
