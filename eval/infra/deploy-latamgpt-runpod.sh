#!/bin/bash
# Deploy LatamGPT-SFT-1.0 on RunPod with vLLM (OpenAI-compatible :8000).
# Usage:
#   RUNPOD_API_KEY=... bash deploy-latamgpt-runpod.sh up
#   RUNPOD_API_KEY=... bash deploy-latamgpt-runpod.sh status <POD_ID>
#   RUNPOD_API_KEY=... bash deploy-latamgpt-runpod.sh down <POD_ID>
set -euo pipefail

API="https://rest.runpod.io/v1"
AUTH="Authorization: Bearer ${RUNPOD_API_KEY:?falta RUNPOD_API_KEY}"
MODEL="latam-gpt/Llama-3.1-70B-LatamGPT-SFT-1.0"

case "${1:?uso: up|status|down}" in
  up)
    curl -sf -X POST "$API/pods" -H "$AUTH" -H "Content-Type: application/json" -d '{
      "name": "latambench-latamgpt-v4",
      "imageName": "vllm/vllm-openai:latest",
      "gpuTypeIds": ["NVIDIA A100 80GB PCIe"],
      "gpuCount": 2,
      "containerDiskInGb": 200,
      "ports": ["8000/http"],
      "dockerEntrypoint": [],
      "dockerStartCmd": ["--model", "'"$MODEL"'", "--tensor-parallel-size", "2", "--max-model-len", "8192", "--host", "0.0.0.0", "--port", "8000"]
    }' | python3 -c "import json,sys; d=json.load(sys.stdin); print('POD_ID:', d.get('id', d))"
    echo "espera ~20-30 min (descarga 140GB). chequea con: $0 status <POD_ID>"
    ;;
  status)
    POD="${2:?falta POD_ID}"
    curl -sf "$API/pods/$POD" -H "$AUTH" | python3 -c "import json,sys; d=json.load(sys.stdin); print('estado:', d.get('desiredStatus'), '| runtime:', bool(d.get('runtime')))"
    echo "health del endpoint:"
    curl -s --max-time 10 "https://${POD}-8000.proxy.runpod.net/v1/models" | head -c 200 || echo "(aun no responde)"
    ;;
  down)
    POD="${2:?falta POD_ID}"
    curl -sf -X DELETE "$API/pods/$POD" -H "$AUTH" && echo "pod $POD eliminado"
    ;;
esac
