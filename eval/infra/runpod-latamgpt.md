# V4: Servir LatamGPT en RunPod para el eval

Objetivo: exponer `latam-gpt/Llama-3.1-70B-LatamGPT-SFT-1.0` (fp16, sin quant) como endpoint OpenAI-compatible y correr Trueque-500 contra el via el provider `compat:` del harness.

## Specs

| Cosa | Valor |
|------|-------|
| GPU | 2x A100 80GB (tensor parallel 2) — 70B fp16 = ~140GB pesos |
| Serving | vLLM (`vllm/vllm-openai` imagen oficial) |
| Costo | ~$3.2-4.4/h en RunPod secure cloud; eval completo ~2-3h => **~$10-15** |
| Modelo HF | `latam-gpt/Llama-3.1-70B-LatamGPT-SFT-1.0` (publico, licencia Llama 3.1) |

## Pasos (una vez con RUNPOD_API_KEY en eval/.env)

1. Crear pod: `bash infra/deploy-latamgpt-runpod.sh up`
   - levanta 2xA100 con vLLM sirviendo el modelo en :8000, descarga ~140GB (~20-30 min)
2. Esperar health: el script poll-ea `/v1/models` hasta que responda
3. Correr eval desde esta maquina:
   ```bash
   bun src/cli.ts run --model "compat:https://<POD_ID>-8000.proxy.runpod.net/v1|latam-gpt/Llama-3.1-70B-LatamGPT-SFT-1.0" --benchmark trueque --seed 42
   bun src/cli.ts rescore --glob "<run-id>"
   ```
4. **Apagar el pod**: `bash infra/deploy-latamgpt-runpod.sh down <POD_ID>` (no olvidar — cobra por hora)

## Notas
- El proxy de RunPod expone :8000 como `https://<POD_ID>-8000.proxy.runpod.net` sin auth extra — el harness usa `COMPAT_API_KEY=none` por default.
- Mismo seed 42 => mismas 500 preguntas que el resto de la tabla.
- temperature 0 igual que todos los arms.
- Si la descarga del modelo es lenta, considerar volume con cache; para un one-shot no vale la pena.
