# Spot-check Review — sweep 2026-06-11

Adjudicación asistida por LLM de los desacuerdos entre señales (nota de conflicto: el adjudicador es uno de los modelos evaluados; veredictos sujetos a revisión independiente). Para cada caso: el judge y las señales automáticas (F1/embeddings) discrepan. Cada caso marca una de:
- `judge` — el judge tiene razón
- `senales` — el judge se equivocó
- `dudoso` — ni idea / referencia ambigua

## 1/52 — meta_llama-3.1-70b — [trueque-78]

**Pregunta** (Brasil): Qual é a forma da formação rochosa de arenito mais famosa do Parque Vila Velha, no estado brasileiro chamado Paraná?

**Referencia**: A forma mais famosa da formação rochosa de arenito do Parque Vila Velha é a Taça, uma estrutura em formato de copa esculpida pela erosão natural.

**Respuesta del modelo**: A forma da formação rochosa de arenito mais famosa do Parque Vila Velha, no estado brasileiro chamado Paraná, é a "Furada da Boi".

**Señales**: f1=0.55 embSim=0.73 | **Judge**: incorrect — A candidata afirma que é a 'Furada da Boi', contradizendo o nome 'Taça' da referência.

**Veredicto humano**: `judge`

---

## 2/52 — meta_llama-3.1-70b — [trueque-176]

**Pregunta** (Costa Rica): ¿De qué planta específica se extrae la savia para producir el "Vino de Coyol", una bebida fermentada muy popular en Guanacaste?

**Referencia**: La savia para producir el "Vino de Coyol" se extrae de la palma coyol, cuyo nombre científico es Acrocomia vinifera, cortando su ápice para recolectar el líquido que luego se fermenta.

**Respuesta del modelo**: El "Vino de Coyol" se extrae de la planta de coyol (Acrocomia aculeata), que es una especie de palma.

**Señales**: f1=0.46 embSim=0.87 | **Judge**: incorrect — Contradice el nombre científico central (Acrocomia vinifera vs aculeata) y omite el método de extracción especificado.

**Veredicto humano**: `judge` — ref-issue: Acrocomia vinifera es sinonimo taxonomico de A. aculeata (nombre aceptado); candidato correcto en el mundo real, incorrecto vs referencia

---

## 3/52 — anthropic_claude-fable-5 — [trueque-293]

**Pregunta** (Latam): ¿Qué fenómeno climático se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú?

**Referencia**: El fenómeno climático que se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú es el Niño costero, un calentamiento anómalo de las aguas del Pacífico que afecta directamente a Perú y Ecuador, con intensas lluvias y cambios climáticos locales.

**Respuesta del modelo**: El fenómeno de **El Niño**. Se caracteriza por el calentamiento anormal de las aguas superficiales del océano Pacífico frente a la costa norte del Perú, lo que suele provocar intensas lluvias e inundaciones en esa región.

**Señales**: f1=0.52 embSim=0.83 | **Judge**: incorrect — La candidata nombra 'El Niño' en lugar del 'Niño costero' que define la referencia como el fenómeno específico.

**Veredicto humano**: `judge`

---

## 4/52 — anthropic_claude-fable-5 — [trueque-143]

**Pregunta** (Colombia): ¿Qué danza de la Costa Pacífica fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO?

**Referencia**: El currulao.

**Respuesta del modelo**: El **currulao**, como parte de las "Músicas de marimba y cantos y danzas tradicionales del Pacífico Sur colombiano y de la provincia de Esmeraldas (Ecuador)", fue inscrito por la UNESCO en la Lista del Patrimonio Cultural Inmaterial de la Humanidad en 2010 (con ampliación a Ecuador en 2015).

**Señales**: f1=0.07 embSim=0.49 | **Judge**: correct — La candidata nombra correctamente el currulao como la danza en cuestión, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 5/52 — anthropic_claude-fable-5 — [trueque-315]

**Pregunta** (México): ¿qué fechas abarcó el periodo conocido como el Maximato?

**Referencia**: De 1928 a 1934.

**Respuesta del modelo**: El Maximato abarcó de 1928 a 1934 en México. Comenzó tras el asesinato de Álvaro Obregón, cuando Plutarco Elías Calles —llamado el "Jefe Máximo de la Revolución"— ejerció el poder real detrás de tres presidentes: Emilio Portes Gil (1928-1930), Pascual Ortiz Rubio (1930-1932) y Abelardo L. Rodríguez (1932-1934). El periodo terminó con la llegada de Lázaro Cárdenas a la presidencia, quien expulsó a Calles del país en 1936, fecha que algunos historiadores consideran el cierre definitivo del Maximato.

**Señales**: f1=0.07 embSim=0.39 | **Judge**: correct — La candidata afirma explícitamente que el Maximato abarcó de 1928 a 1934, coincidiendo con el hecho clave de la referencia.

**Veredicto humano**: `judge`

---

## 6/52 — anthropic_claude-fable-5 — [trueque-50]

**Pregunta** (Bolivia): ¿Quién fue el primer presidente de Bolivia?

**Referencia**: El primer presidente de Bolivia fue Antonio José de Sucre, quien asumió el cargo el 29 de diciembre de 1825 tras la renuncia de Simón Bolívar, quien fue reconocido como Protector de la República pero no como presidente constitucional. José María Pérez de Urdininea fue el primer presidente nacido en el territorio boliviano, pero no el primero en ejercer el cargo.

**Respuesta del modelo**: El primer presidente de Bolivia fue **Simón Bolívar**, quien asumió el cargo en 1825, tras la independencia del país (que fue nombrado en su honor). Sin embargo, su mandato fue muy breve, y poco después le sucedió **Antonio José de Sucre**, considerado el primer presidente efectivo de Bolivia.

**Señales**: f1=0.46 embSim=0.88 | **Judge**: incorrect — La candidata afirma que Bolívar fue el primer presidente, contradiciendo directamente la referencia que establece a Sucre como tal y niega explícitamente que Bolívar lo fuera.

**Veredicto humano**: `judge` — ref toma posicion (Sucre, no Bolivar); juicio correcto por protocolo, hecho historicamente debatido

---

## 7/52 — anthropic_claude-fable-5 — [trueque-282]

**Pregunta** (Guatemala): El Lago de Atitlán en Guatemala tiene un viento fuerte característico que sopla a cierta hora del día. ¿Cómo se llama este viento?

**Referencia**: Xocomil.  

**Respuesta del modelo**: Se llama **Xocomil**. Es un viento fuerte que suele soplar en el Lago de Atitlán alrededor del mediodía y las primeras horas de la tarde, agitando considerablemente las aguas del lago. Su nombre proviene del kaqchikel y suele traducirse como "el viento que se lleva el pecado" o relacionado con el agua agitada.

**Señales**: f1=0.06 embSim=0.48 | **Judge**: correct — La candidata nombra correctamente Xocomil como el viento en cuestión.

**Veredicto humano**: `judge`

---

## 8/52 — openai_gpt-5.5 — [trueque-293]

**Pregunta** (Latam): ¿Qué fenómeno climático se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú?

**Referencia**: El fenómeno climático que se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú es el Niño costero, un calentamiento anómalo de las aguas del Pacífico que afecta directamente a Perú y Ecuador, con intensas lluvias y cambios climáticos locales.

**Respuesta del modelo**: El fenómeno climático es **El Niño**, caracterizado por el aumento anómalo de la temperatura del mar en la costa norte del Perú.

**Señales**: f1=0.59 embSim=0.89 | **Judge**: incorrect — Candidate names 'El Niño' instead of the reference's specific 'Niño costero'.

**Veredicto humano**: `judge`

---

## 9/52 — google_gemini-3.1-pro-preview — [trueque-178]

**Pregunta** (Costa Rica): En el contexto de la gastronomía y jerga de Costa Rica, ¿qué es exactamente una "cajeta"?

**Referencia**: En Costa Rica, una "cajeta" es un dulce tradicional compacto, similar al turrón o fudge, hecho principalmente con leche o coco, de textura densa y sabor dulce, consumido como postre y sin relación con significados coloquiales o vulgares de otros países.

**Respuesta del modelo**: En el contexto de Costa Rica, "cajeta" tiene dos significados principales:

1. **En gastronomía:** Es un dulce tradicional sólido o semisólido elaborado a base de leche, azúcar (o tapa de dulce) y frecuentemente coco, maní u otros ingredientes. A diferencia de otros países donde es un jarabe líquido, en Costa Rica se moldea y se corta en cuadros o bloques pequeños.
2. **En la jerga:** Se utiliza principalmente en la expresión "hablar cajeta", que significa decir mentiras, hablar tonterías, exagerar o alardear.

**Señales**: f1=0.29 embSim=0.87 | **Judge**: incorrect — La candidata contradice la referencia al añadir un significado jergal costarricense que la referencia niega explícitamente.

**Veredicto humano**: `senales` — definicion gastronomica correcta; la contradiccion es en acepcion secundaria -> partial, no incorrect

---

## 10/52 — google_gemini-3.1-pro-preview — [trueque-254]

**Pregunta** (El Salvador): ¿Qué expresa “alebrestado” en El Salvador?

**Referencia**: En El Salvador, “alebrestado” expresa que alguien está ligeramente ebrio o sexualmente excitado, y también puede referirse a quien está enfadado o muy inquieto.

**Respuesta del modelo**: En El Salvador, la palabra "alebrestado" expresa que una persona está agitada, inquieta, muy emocionada o alterada. También puede referirse a alguien que muestra una actitud rebelde, desafiante o a la defensiva.

**Señales**: f1=0.49 embSim=0.88 | **Judge**: incorrect — La candidata omite por completo los significados centrales de ebriedad leve y excitación sexual, y propone acepciones distintas (rebelde/defensivo) no presentes en la referencia.

**Veredicto humano**: `senales` — cubre inquieto/alterado parcialmente -> partial

---

## 11/52 — google_gemini-3.1-pro-preview — [trueque-143]

**Pregunta** (Colombia): ¿Qué danza de la Costa Pacífica fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO?

**Referencia**: El currulao.

**Respuesta del modelo**: La UNESCO declaró como Patrimonio Cultural Inmaterial de la Humanidad a la **música de marimba, los cantos y bailes tradicionales de la región del Pacífico Sur** (compartida entre Colombia y la provincia de Esmeraldas en Ecuador). 

Dentro de esta declaratoria, la danza principal y más representativa es el **Currulao**.

**Señales**: f1=0.06 embSim=0.37 | **Judge**: correct — La candidata afirma que el Currulao es la danza principal dentro de la declaratoria de la UNESCO, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 12/52 — google_gemini-3.1-pro-preview — [trueque-282]

**Pregunta** (Guatemala): El Lago de Atitlán en Guatemala tiene un viento fuerte característico que sopla a cierta hora del día. ¿Cómo se llama este viento?

**Referencia**: Xocomil.  

**Respuesta del modelo**: El viento fuerte característico del Lago de Atitlán se llama **Xocomil**. Generalmente comienza a soplar alrededor del mediodía o en las primeras horas de la tarde.

**Señales**: f1=0.12 embSim=0.34 | **Judge**: correct — La candidata nombra correctamente Xocomil como el viento, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 13/52 — google_gemini-3.1-pro-preview — [trueque-176]

**Pregunta** (Costa Rica): ¿De qué planta específica se extrae la savia para producir el "Vino de Coyol", una bebida fermentada muy popular en Guanacaste?

**Referencia**: La savia para producir el "Vino de Coyol" se extrae de la palma coyol, cuyo nombre científico es Acrocomia vinifera, cortando su ápice para recolectar el líquido que luego se fermenta.

**Respuesta del modelo**: El "Vino de Coyol" se extrae de la savia de la **palma de coyol**, cuyo nombre científico es *Acrocomia aculeata*.

**Señales**: f1=0.65 embSim=0.91 | **Judge**: incorrect — Contradice el nombre científico central de la referencia (Acrocomia vinifera vs. Acrocomia aculeata).

**Veredicto humano**: `judge` — ref-issue: mismo caso coyol vinifera/aculeata

---

## 14/52 — openai_gpt-5.4-mini — [trueque-178]

**Pregunta** (Costa Rica): En el contexto de la gastronomía y jerga de Costa Rica, ¿qué es exactamente una "cajeta"?

**Referencia**: En Costa Rica, una "cajeta" es un dulce tradicional compacto, similar al turrón o fudge, hecho principalmente con leche o coco, de textura densa y sabor dulce, consumido como postre y sin relación con significados coloquiales o vulgares de otros países.

**Respuesta del modelo**: En Costa Rica, una **cajeta** es un **dulce tradicional** hecho principalmente de **leche y azúcar**, cocinado hasta espesarse, parecido a un **fudge o dulce de leche firme**.  

En jerga costarricense, además, **“cajeta”** puede usarse de forma coloquial para referirse a **algo muy bueno, bonito o de buena calidad**, según el contexto.

**Señales**: f1=0.33 embSim=0.91 | **Judge**: incorrect — Contradice la referencia al añadir un significado coloquial costarricense que la referencia niega explícitamente.

**Veredicto humano**: `senales` — igual que caso 9 -> partial

---

## 15/52 — anthropic_claude-haiku-4.5 — [trueque-118]

**Pregunta** (Chile): ¿Qué es el arrollado de huaso?

**Referencia**: El arrollado de huaso es un plato típico chileno hecho con carne de cerdo aderezada con ajo, comino, sal, pimienta y otros condimentos, enrollada y amarrada con cordel, que se cocina lentamente para lograr una textura tierna, y se sirve en rodajas, acompañada frecuentemente de puré, ensalada o pebre.

**Respuesta del modelo**: El arrollado de huaso es un plato típico de la cocina chilena, especialmente de la zona central del país.

Se trata de un rollo de carne (generalmente de cerdo o vacuno) relleno de ingredientes como huevo duro, jamón, queso y verduras. La carne se enrolla, se amarra con cordel y se cuece en caldo o se asa.

Es un plato tradicional asociado a la cultura huasa (campesina) chilena y se sirve generalmente en rodajas, frío o caliente, acompañado de ensaladas o salsas.

**Señales**: f1=0.30 embSim=0.92 | **Judge**: incorrect — La candidata contradice la referencia al describir un rollo relleno con huevo, jamón y queso en vez de carne de cerdo aderezada enrollada.

**Veredicto humano**: `judge`

---

## 16/52 — anthropic_claude-haiku-4.5 — [trueque-143]

**Pregunta** (Colombia): ¿Qué danza de la Costa Pacífica fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO?

**Referencia**: El currulao.

**Respuesta del modelo**: La **Danza del Pacífico** que fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO es el **Currulao** (también conocido como Currulao o Currulao colombiano).

Esta danza tradicional de la costa Pacífica colombiana, especialmente de la región del Chocó y Nariño, fue reconocida por la UNESCO en 2015 como Patrimonio Cultural Inmaterial de la Humanidad. El Currulao es una expresión cultural que combina música, danza y ritmo, con raíces en las tradiciones africanas, indígenas y españolas.

**Señales**: f1=0.04 embSim=0.52 | **Judge**: correct — La candidata identifica el currulao como la danza declarada, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 17/52 — anthropic_claude-haiku-4.5 — [trueque-293]

**Pregunta** (Latam): ¿Qué fenómeno climático se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú?

**Referencia**: El fenómeno climático que se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú es el Niño costero, un calentamiento anómalo de las aguas del Pacífico que afecta directamente a Perú y Ecuador, con intensas lluvias y cambios climáticos locales.

**Respuesta del modelo**: El fenómeno climático que se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú es **El Niño** (o más formalmente, El Niño Oscilación del Sur - ENOS).

Este fenómeno ocurre cuando las aguas cálidas del océano Pacífico ecuatorial se desplazan hacia la costa peruana, reemplazando las aguas frías de la Corriente de Humboldt. Trae consigo cambios significativos en el clima, la fauna marina y la economía de la región.

**Señales**: f1=0.43 embSim=0.90 | **Judge**: incorrect — La candidata nombra El Niño/ENSO en lugar del Niño costero especificado en la referencia.

**Veredicto humano**: `judge`

---

## 18/52 — anthropic_claude-haiku-4.5 — [trueque-216]

**Pregunta** (Ecuador): ¿Qué institución fundó Benjamín Carrión para promover la cultura tras la crisis de 1941?

**Referencia**: Benjamín Carrión fundó la Casa de la Cultura Ecuatoriana en 1944 para promover la cultura tras la crisis de 1941, impulsando el pensamiento y el arte como pilares de la identidad nacional y proponiendo que Ecuador se convirtiera en una “potencia cultural” tras su derrota militar.

**Respuesta del modelo**: Benjamín Carrión fundó la **Casa de la Cultura Ecuatoriana** en 1944 (no exactamente en 1941, pero cercano a ese período de crisis) como institución dedicada a promover, preservar y difundir la cultura ecuatoriana.

Sin embargo, debo ser honesto: no tengo certeza absoluta sobre si esta fue la institución específica fundada inmediatamente después de la crisis de 1941 o si hubo otra. Te recomendaría verificar esta información en fuentes especializadas sobre la historia cultural ecuatoriana.

**Señales**: f1=0.30 embSim=0.87 | **Judge**: incorrect — Declara no tener certeza y recomienda verificar, contradiciendo la certeza de la referencia.

**Veredicto humano**: `senales` — dio la respuesta correcta (Casa de la Cultura, 1944) y el judge lo castigo por hedging -> partial o correct

---

## 19/52 — anthropic_claude-haiku-4.5 — [trueque-315]

**Pregunta** (México): ¿qué fechas abarcó el periodo conocido como el Maximato?

**Referencia**: De 1928 a 1934.

**Respuesta del modelo**: El Maximato abarcó de **1928 a 1934** en México.

Este período se caracterizó por el dominio político de Plutarco Elías Calles, quien aunque no ocupaba la presidencia, ejercía el poder real detrás de varios presidentes títeres (Emilio Portes Gil, Pascual Ortiz Rubio y Abelardo L. Rodríguez). El período terminó cuando Lázaro Cárdenas llegó a la presidencia en 1934 y logró consolidar su poder, expulsando a Calles del país.

**Señales**: f1=0.08 embSim=0.44 | **Judge**: correct — La candidata expresa exactamente las fechas clave de la referencia.

**Veredicto humano**: `judge`

---

## 20/52 — anthropic_claude-haiku-4.5 — [trueque-282]

**Pregunta** (Guatemala): El Lago de Atitlán en Guatemala tiene un viento fuerte característico que sopla a cierta hora del día. ¿Cómo se llama este viento?

**Referencia**: Xocomil.  

**Respuesta del modelo**: El viento característico del Lago de Atitlán se llama **Xocomil** (también escrito Xocomil o Xocomil). 

Es un viento fuerte que típicamente sopla por las tardes, especialmente entre las 10 de la mañana y las 4 de la tarde. El nombre proviene del idioma k'iche' y significa "viento que lleva el pecado" o "viento que destruye". Es bien conocido por los navegantes locales y afecta significativamente las condiciones del lago.

**Señales**: f1=0.04 embSim=0.40 | **Judge**: correct — La candidata identifica correctamente el nombre del viento como Xocomil, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 21/52 — google_gemini-3.5-flash — [trueque-254]

**Pregunta** (El Salvador): ¿Qué expresa “alebrestado” en El Salvador?

**Referencia**: En El Salvador, “alebrestado” expresa que alguien está ligeramente ebrio o sexualmente excitado, y también puede referirse a quien está enfadado o muy inquieto.

**Respuesta del modelo**: En El Salvador, la palabra **«alebrestado»** expresa que una persona está alborotada, agitada, inquieta o alterada. También puede referirse a alguien que está muy entusiasmado o rebelde.

**Señales**: f1=0.57 embSim=0.88 | **Judge**: incorrect — La candidata omite ebrio y excitado sexual, y usa significados distintos (entusiasmado/rebelde) en lugar de enfadado.

**Veredicto humano**: `senales` — igual que caso 10 -> partial

---

## 22/52 — google_gemini-3.5-flash — [trueque-315]

**Pregunta** (México): ¿qué fechas abarcó el periodo conocido como el Maximato?

**Referencia**: De 1928 a 1934.

**Respuesta del modelo**: El periodo conocido como el Maximato abarcó de **1928 a 1934** (desde la presidencia interina de Emilio Portes Gil hasta el inicio del mandato de Lázaro Cárdenas), aunque algunos historiadores extienden su fin hasta **1936**, año en que Plutarco Elías Calles fue expulsado del país.

**Señales**: f1=0.11 embSim=0.49 | **Judge**: correct — La candidata afirma el rango 1928-1934 como el periodo principal, coincidiendo con la referencia.

**Veredicto humano**: `judge`

---

## 23/52 — google_gemini-3.5-flash — [trueque-282]

**Pregunta** (Guatemala): El Lago de Atitlán en Guatemala tiene un viento fuerte característico que sopla a cierta hora del día. ¿Cómo se llama este viento?

**Referencia**: Xocomil.  

**Respuesta del modelo**: Este viento característico se llama **Xocomil** (o Chocomil). Suele soplar a partir del mediodía o en la tarde, produciendo un fuerte oleaje en las aguas del lago.

**Señales**: f1=0.11 embSim=0.44 | **Judge**: correct — Candidate names the wind Xocomil exactly as in the reference.

**Veredicto humano**: `judge`

---

## 24/52 — google_gemini-3.5-flash — [trueque-245]

**Pregunta** (El Salvador): ¿Qué expresa el adjetivo “ajolotado” en el Salvador?

**Referencia**: El adjetivo “ajolotado” en El Salvador describe a una persona atontada, distraída o atolondrada, por comparación con el guajolote.

**Respuesta del modelo**: En El Salvador, el adjetivo **"ajolotado"** se utiliza para describir a una persona que está **apresurada, inquieta, impaciente, ansiosa o atolondrada**. 

Proviene del verbo coloquial "ajolotarse", que significa agitarse, alarmarse o perder la calma ante una situación.

**Señales**: f1=0.27 embSim=0.85 | **Judge**: incorrect — La candidata contradice el significado central (atontada/distraída por comparación con guajolote) y da etimología y sinónimos distintos.

**Veredicto humano**: `senales` — comparte 'atolondrada' con la ref -> partial

---

## 25/52 — google_gemini-3.5-flash — [trueque-176]

**Pregunta** (Costa Rica): ¿De qué planta específica se extrae la savia para producir el "Vino de Coyol", una bebida fermentada muy popular en Guanacaste?

**Referencia**: La savia para producir el "Vino de Coyol" se extrae de la palma coyol, cuyo nombre científico es Acrocomia vinifera, cortando su ápice para recolectar el líquido que luego se fermenta.

**Respuesta del modelo**: El "Vino de Coyol" se extrae de la savia de la **palma de coyol** (cuyo nombre científico es ***Acrocomia aculeata***).

**Señales**: f1=0.65 embSim=0.91 | **Judge**: incorrect — La candidata contradice el nombre científico dado en la referencia (Acrocomia aculeata vs Acrocomia vinifera).

**Veredicto humano**: `judge` — ref-issue: coyol

---

## 26/52 — deepseek_deepseek-v4-pro — [trueque-368]

**Pregunta** (Panamá): ¿Que es el pan de La arena Panamá?

**Referencia**: El Pan de La Arena es un pan tradicional de Chitré, Panamá, elaborado desde 1947 en el corregimiento de La Arena con huevos de gallina de patio, siguiendo una receta artesanal heredada. Reconocido por su sabor único, textura y aroma, se ha convertido en un símbolo culinario nacional, asociado a la tradición familiar y la identidad cultural de la región de Azuero.  

**Respuesta del modelo**: El pan de La Arena es un pan tradicional panameño, originario del distrito de La Arena en la provincia de Herrera. Se elabora principalmente con harina de maíz, queso (a menudo queso blanco fresco) y, en algunas recetas, anís. Tiene una textura densa y un sabor característico, y suele cocinarse en horno de leña. Es un ícono de la gastronomía interiorana de Panamá.

**Señales**: f1=0.28 embSim=0.86 | **Judge**: incorrect — Candidate contradicts reference on origin details, ingredients (corn/cheese vs eggs), and preparation history.

**Veredicto humano**: `judge`

---

## 27/52 — deepseek_deepseek-v4-pro — [trueque-118]

**Pregunta** (Chile): ¿Qué es el arrollado de huaso?

**Referencia**: El arrollado de huaso es un plato típico chileno hecho con carne de cerdo aderezada con ajo, comino, sal, pimienta y otros condimentos, enrollada y amarrada con cordel, que se cocina lentamente para lograr una textura tierna, y se sirve en rodajas, acompañada frecuentemente de puré, ensalada o pebre.

**Respuesta del modelo**: El arrollado de huaso es un plato tradicional chileno que consiste en un trozo de carne de cerdo (generalmente lomo o pulpa) que se abre como un libro, se rellena con ingredientes como huevo duro, zanahoria, pimentón o ají, y a veces pasas o aceitunas, luego se enrolla firmemente, se amarra y se cuece lentamente en agua o caldo sazonado. Una vez cocido, se prensa para que tome consistencia y se sirve frío, cortado en rodajas, como aperitivo o acompañamiento. El nombre alude al "huaso" (campesino chileno), reflejando su origen rural.

**Señales**: f1=0.27 embSim=0.94 | **Judge**: incorrect — La candidata describe un plato relleno con huevo/zanahoria y servido frío, contradiciendo la referencia sobre carne solo aderezada y servida con puré/pebre.

**Veredicto humano**: `judge`

---

## 28/52 — deepseek_deepseek-v4-pro — [trueque-411]

**Pregunta** (Perú): ¿Qué es la Danza de los Shacshas?

**Referencia**: La Danza de los Shacshas es una tradición andina de Áncash, Perú, que se realiza durante la Fiesta del Señor de la Soledad; sus danzantes usan atuendos coloridos con cascabeles en las pantorrillas que producen el sonido característico, representan escenas de la vida campesina y cumplen promesas religiosas, expresando devoción y herencia cultural.

**Respuesta del modelo**: La Danza de los Shacshas es una danza tradicional de la región Huánuco, en el centro de Perú, asociada a festividades religiosas como la del Señor de Burgos. Los bailarines, llamados shacshas, visten trajes coloridos con máscaras de animales o personajes y cascabeles en las piernas, realizando movimientos rítmicos al compás de instrumentos como la flauta y el tambor.

**Señales**: f1=0.25 embSim=0.86 | **Judge**: incorrect — Contradice ubicación (Huánuco vs Áncash) y festividad (Señor de Burgos vs Señor de la Soledad) de la referencia.

**Veredicto humano**: `judge`

---

## 29/52 — deepseek_deepseek-v4-pro — [trueque-143]

**Pregunta** (Colombia): ¿Qué danza de la Costa Pacífica fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO?

**Referencia**: El currulao.

**Respuesta del modelo**: La danza de la Costa Pacífica colombiana declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO es el **currulao**, como parte de la manifestación "Música de marimba y cantos y bailes tradicionales de la región colombiana del Pacífico Sur", inscrita en 2010 (y ampliada posteriormente).

**Señales**: f1=0.07 embSim=0.48 | **Judge**: correct — La candidata identifica el currulao como la danza en cuestión, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 30/52 — deepseek_deepseek-v4-pro — [trueque-315]

**Pregunta** (México): ¿qué fechas abarcó el periodo conocido como el Maximato?

**Referencia**: De 1928 a 1934.

**Respuesta del modelo**: El Maximato fue el periodo entre **1928 y 1934**, durante el cual Plutarco Elías Calles ejerció una influencia dominante sobre los presidentes en turno (Emilio Portes Gil, Pascual Ortiz Rubio y Abelardo L. Rodríguez) sin ser él mismo presidente.

**Señales**: f1=0.12 embSim=0.43 | **Judge**: correct — La candidata expresa exactamente las fechas clave de la referencia (1928-1934).

**Veredicto humano**: `judge`

---

## 31/52 — deepseek_deepseek-v4-pro — [trueque-282]

**Pregunta** (Guatemala): El Lago de Atitlán en Guatemala tiene un viento fuerte característico que sopla a cierta hora del día. ¿Cómo se llama este viento?

**Referencia**: Xocomil.  

**Respuesta del modelo**: El viento fuerte y característico del Lago de Atitlán, que suele soplar durante la tarde, se llama **Xocomil** (del kaqchikel, que significa "viento que arranca el pecado" o "viento fuerte").

**Señales**: f1=0.10 embSim=0.40 | **Judge**: correct — La candidata nombra correctamente el viento como Xocomil, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 32/52 — deepseek_deepseek-v4-pro — [trueque-318]

**Pregunta** (México): ¿Cómo se autodenominan los Huicholes?

**Referencia**: Los Huicholes se autodenominan wixaritari.

**Respuesta del modelo**: Los huicholes se autodenominan **wixárika** (o wixarika).

**Señales**: f1=0.67 embSim=0.92 | **Judge**: incorrect — La candidata da un nombre distinto (wixárika) al de la referencia (wixaritari).

**Veredicto humano**: `senales` — wixarika es el singular de wixaritari: misma palabra, distinto numero gramatical -> correct

---

## 33/52 — alibaba_qwen3.7-max — [trueque-411]

**Pregunta** (Perú): ¿Qué es la Danza de los Shacshas?

**Referencia**: La Danza de los Shacshas es una tradición andina de Áncash, Perú, que se realiza durante la Fiesta del Señor de la Soledad; sus danzantes usan atuendos coloridos con cascabeles en las pantorrillas que producen el sonido característico, representan escenas de la vida campesina y cumplen promesas religiosas, expresando devoción y herencia cultural.

**Respuesta del modelo**: La Danza de los Shacshas es una danza tradicional y ritual de la sierra central del Perú, característica principalmente de la región Áncash. 

Su nombre se debe a las "shacshas" (vainas de semillas secas) que los bailarines atan a sus pantorrillas para producir un sonido rítmico al moverse. Es una danza estrechamente vinculada al ciclo agrícola que se realiza como ritual de agradecimiento a la Pachamama (Madre Tierra) por las cosechas y para pedir fertilidad, acompañándose de música de flautas y la *tinya* (un tambor pequeño andino).

**Señales**: f1=0.22 embSim=0.88 | **Judge**: incorrect — Contradice origen del sonido (shacshas vs cascabeles) y contexto ritual (agrícola-Pachamama vs Fiesta del Señor de la Soledad).

**Veredicto humano**: `senales` — region correcta (Ancash); sonido por semillas es defendible en el mundo real -> partial

---

## 34/52 — alibaba_qwen3.7-max — [trueque-143]

**Pregunta** (Colombia): ¿Qué danza de la Costa Pacífica fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO?

**Referencia**: El currulao.

**Respuesta del modelo**: El **currulao** (junto con otros bailes tradicionales asociados a la marimba). 

En 2015, la UNESCO hizo esta declaración bajo la denominación oficial de *"Música de marimba, cantos y bailes tradicionales de la región del Pacífico Sur colombiano y de la provincia de Esmeraldas de Ecuador"*.

**Señales**: f1=0.07 embSim=0.50 | **Judge**: correct — La candidata identifica el currulao como la danza en cuestión, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 35/52 — alibaba_qwen3.7-max — [trueque-109]

**Pregunta** (Chile): Qué es la "chupilca del diablo"?

**Referencia**: La "chupilca del diablo" es una criatura folclórica chilena que se dice chupa la sangre de animales por la noche, y también el nombre de una bebida legendaria supuestamente consumida por soldados en la Guerra del Pacífico, hecha con aguardiente, pólvora negra, harina tostada y azúcar, aunque su existencia real es dudosa y probablemente es un mito.

**Respuesta del modelo**: La "chupilca del diablo" es una bebida alcohólica tradicional del sur de Chile que se prepara mezclando chicha (generalmente de manzana) con pólvora negra. 

Es históricamente famosa por haber sido consumida por los soldados chilenos durante la Guerra del Pacífico (1879-1884) para infundirles valor, combatir el frío y adormecer el dolor antes de entrar en combate.

**Señales**: f1=0.37 embSim=0.88 | **Judge**: incorrect — Contradice ingredientes, afirma existencia real y omite la criatura folclórica central de la referencia.

**Veredicto humano**: `judge`

---

## 36/52 — alibaba_qwen3.7-max — [trueque-97]

**Pregunta** (Brasil): Qual é a origem da expressão "acabar em pizza"?

**Referencia**: A expressão "acabar em pizza" surgiu na década de 1960, quando uma longa reunião da diretoria do Palmeiras, após 14 horas de discussão sobre uma crise do clube, terminou com todos pedindo pizzas e esquecendo os problemas. Um jornalista cobriu o fato com a manchete “Crise do Palmeiras termina em pizza”, e a frase se popularizou para descrever situações onde algo sério acaba de forma banal.

**Respuesta del modelo**: A expressão "acabar em pizza" surgiu na década de 1960, em São Paulo, no meio esportivo. Durante uma crise administrativa no clube Palmeiras, dirigentes reuniram-se em uma pizzaria para resolver suas divergências. Após a refeição, chegaram a um acordo e o problema foi contornado sem que houvesse punições. A imprensa esportiva da época noticiou então que a crise havia "acabado em pizza". 

Anos mais tarde, a expressão foi adotada pelo vocabulário político brasileiro para descrever escândalos, investigações ou CPIs que terminam sem responsabilização e na mais completa impunidade.

**Señales**: f1=0.28 embSim=0.88 | **Judge**: incorrect — Candidate alters central origin details (meeting location, outcome) and contradicts reference facts.

**Veredicto humano**: `dudoso` — nucleo coincide (Palmeiras, anos 60, prensa, pizza) pero la mecanica del origen difiere

---

## 37/52 — alibaba_qwen3.7-max — [trueque-50]

**Pregunta** (Bolivia): ¿Quién fue el primer presidente de Bolivia?

**Referencia**: El primer presidente de Bolivia fue Antonio José de Sucre, quien asumió el cargo el 29 de diciembre de 1825 tras la renuncia de Simón Bolívar, quien fue reconocido como Protector de la República pero no como presidente constitucional. José María Pérez de Urdininea fue el primer presidente nacido en el territorio boliviano, pero no el primero en ejercer el cargo.

**Respuesta del modelo**: El primer presidente de Bolivia fue **Simón Bolívar**, quien asumió el cargo en agosto de 1825 tras la independencia del país. 

Poco después, en enero de 1826, le sucedió **Antonio José de Sucre**, quien es considerado el primer presidente en ejercer el gobierno de forma efectiva y constitucional.

**Señales**: f1=0.50 embSim=0.90 | **Judge**: incorrect — Contradice directamente quién fue el primer presidente constitucional (Bolívar vs. Sucre).

**Veredicto humano**: `judge`

---

## 38/52 — alibaba_qwen3.7-max — [trueque-376]

**Pregunta** (Paraguay): ¿Quién fue la única mujer reconocida como protagonista de la independencia de Paraguay?

**Referencia**: Juana María de Lara, también conocida como Juana María de Lara de Díaz de Bedoya, fue la única mujer reconocida como protagonista de la independencia de Paraguay, desempeñando un papel clave como mensajera secreta, transmitiendo la contraseña “Independencia o muerte” y facilitando la coordinación de los patriotas durante los hechos de mayo de 1811.

**Respuesta del modelo**: **Juana María de Lara**. Es reconocida históricamente como la única mujer prócer de la independencia del Paraguay por haber facilitado su casa para las reuniones secretas de los patriotas y brindar apoyo a la causa durante la revolución de mayo de 1811.

**Señales**: f1=0.41 embSim=0.88 | **Judge**: incorrect — La candidata atribuye un rol distinto (reuniones en su casa) al de mensajera secreta con la contraseña que define la referencia.

**Veredicto humano**: `senales` — nombra correctamente a Juana Maria de Lara (la pregunta es QUIEN); el rol difiere -> partial o correct

---

## 39/52 — alibaba_qwen3.7-max — [trueque-34]

**Pregunta** (Argentina): ¿Qué es el pericón argentino?

**Referencia**: El pericón es la danza nacional argentina, declarada así por ley en 2007, que se baila en parejas sueltas con pañuelos y ropa colonial, representando escenas simbólicas de la historia nacional en celebraciones patrias. Evolucionó de la contradanza europea y fue popularizado en el siglo XIX por los Hermanos Podestá.

**Respuesta del modelo**: El pericón es una danza y género musical folclórico tradicional de Argentina (compartido históricamente con Uruguay). Es una danza de conjunto o "cuadrilla" de origen rural y gauchesco, que se baila en parejas pero formando diversas figuras grupales dirigidas por un "bastonero". Se caracteriza por su ritmo alegre, festivo y de compás compuesto.

**Señales**: f1=0.27 embSim=0.85 | **Judge**: incorrect — La candidata contradice la referencia al describir una cuadrilla grupal con bastonero de origen gauchesco y compartida con Uruguay, omitiendo la declaración legal de 2007, parejas sueltas con pañuelos y su evolución desde la contradanza popularizada por los Podestá.

**Veredicto humano**: `dudoso` — ref-issue: el pericon real SI es danza de conjunto con bastonero y compartida con Uruguay; la ref describe otra cosa

---

## 40/52 — alibaba_qwen3.7-max — [trueque-230]

**Pregunta** (Ecuador): ¿Qué son los churos en ecuador?

**Referencia**: Los churos en Ecuador son caracoles terrestres comestibles, un manjar típico de la Sierra andina que se consume especialmente en mercados como los de Quito y Otavalo, preparados hervidos y acompañados de limón, ají o colada de tres granos, siendo un alimento de temporada que aparece con las lluvias.

**Respuesta del modelo**: En Ecuador, los **churos** son caracoles de agua dulce que se recolectan en ríos y lagunas de la región andina. Son un ingrediente tradicional en la gastronomía local, especialmente en la provincia del Azuay (Cuenca), donde se preparan en platos típicos como la sopa o locro de churos. 

Adicionalmente, en el habla cotidiana, la palabra "churo" también se utiliza para describir un rizo (de cabello) o una forma en espiral.

**Señales**: f1=0.21 embSim=0.86 | **Judge**: incorrect — Contradice el tipo de caracol (terrestre vs. agua dulce) y las ubicaciones/preparaciones principales de la referencia.

**Veredicto humano**: `judge`

---

## 41/52 — alibaba_qwen3.7-max — [trueque-245]

**Pregunta** (El Salvador): ¿Qué expresa el adjetivo “ajolotado” en el Salvador?

**Referencia**: El adjetivo “ajolotado” en El Salvador describe a una persona atontada, distraída o atolondrada, por comparación con el guajolote.

**Respuesta del modelo**: En El Salvador, el adjetivo **“ajolotado”** (derivado del sustantivo *ajolote*) se utiliza para describir a alguien que actúa de manera tonta, torpe, distraída o ridícula.

**Señales**: f1=0.28 embSim=0.91 | **Judge**: incorrect — Contradice la referencia al atribuir el origen a 'ajolote' en vez de la comparación con el guajolote y altera ligeramente los significados descritos.

**Veredicto humano**: `senales` — significado coincide (tonta/torpe/distraida vs atontada/distraida/atolondrada); solo difiere etimologia -> correct o partial

---

## 42/52 — alibaba_qwen3.7-max — [trueque-176]

**Pregunta** (Costa Rica): ¿De qué planta específica se extrae la savia para producir el "Vino de Coyol", una bebida fermentada muy popular en Guanacaste?

**Referencia**: La savia para producir el "Vino de Coyol" se extrae de la palma coyol, cuyo nombre científico es Acrocomia vinifera, cortando su ápice para recolectar el líquido que luego se fermenta.

**Respuesta del modelo**: Se extrae de la savia de la **palma de coyol** (cuyo nombre científico es *Acrocomia aculeata*).

**Señales**: f1=0.57 embSim=0.78 | **Judge**: incorrect — Contradice el nombre científico central (Acrocomia vinifera vs. aculeata) y omite el método de extracción.

**Veredicto humano**: `judge` — ref-issue: coyol

---

## 43/52 — meta_llama-4-maverick — [trueque-449]

**Pregunta** (República Dominicana): ¿Qué regiones fueron centros del desarrollo taíno clásico?

**Referencia**: Los centros del desarrollo taíno clásico fueron Puerto Rico y el sureste de La Española, especialmente el valle del Cibao y la región de Jaraguá, donde se desarrollaron las expresiones más complejas de su cultura, con plazas ceremoniales, cerámica especializada y estructuras sociales jerarquizadas.

**Respuesta del modelo**: Los centros del desarrollo taíno clásico se ubicaron en las regiones de Puerto Rico, La Española (actualmente dividida entre Haití y la República Dominicana) y el este de Cuba, así como en Jamaica. Estas áreas fueron fundamentales para la cultura y el desarrollo de los taínos.

**Señales**: f1=0.34 embSim=0.87 | **Judge**: incorrect — La candidata contradice la referencia al incluir Cuba oriental y Jamaica como centros y al no limitarse al sureste de La Española con sus valles específicos.

**Veredicto humano**: `judge`

---

## 44/52 — meta_llama-4-maverick — [trueque-439]

**Pregunta** (República Dominicana): ¿Cuál es el deporte más practicado en república dominicana?

**Referencia**: El béisbol es el deporte más practicado en la República Dominicana, con una tradición profunda y una presencia cotidiana en barrios y comunidades, aunque el baloncesto ha superado ligeramente en número de practicantes según encuestas recientes. Sin embargo, sigue siendo el deporte nacional por su impacto cultural y social.

**Respuesta del modelo**: El deporte más practicado en República Dominicana es el béisbol. Es considerado el deporte nacional y tiene una gran popularidad en el país.

**Señales**: f1=0.36 embSim=0.88 | **Judge**: incorrect — La candidata afirma que el béisbol es el más practicado, contradiciendo la referencia que indica que el baloncesto lo superó ligeramente en número de practicantes.

**Veredicto humano**: `senales` — la primera frase de la ref dice literalmente que el beisbol es el mas practicado; ref auto-contradictoria

---

## 45/52 — meta_llama-4-maverick — [trueque-293]

**Pregunta** (Latam): ¿Qué fenómeno climático se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú?

**Referencia**: El fenómeno climático que se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú es el Niño costero, un calentamiento anómalo de las aguas del Pacífico que afecta directamente a Perú y Ecuador, con intensas lluvias y cambios climáticos locales.

**Respuesta del modelo**: El fenómeno climático que se caracteriza por el aumento de la temperatura del mar en la costa norte del Perú es conocido como "El Niño".

**Señales**: f1=0.60 embSim=0.94 | **Judge**: incorrect — La candidata nombra "El Niño" en lugar de "Niño costero" como entidad central indicada en la referencia.

**Veredicto humano**: `judge`

---

## 46/52 — meta_llama-4-maverick — [trueque-143]

**Pregunta** (Colombia): ¿Qué danza de la Costa Pacífica fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO?

**Referencia**: El currulao.

**Respuesta del modelo**: La danza del currulao fue declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2015 (originalmente inscrita en la Lista Representativa del Patrimonio Cultural Inmaterial de la Humanidad en 2012 por Colombia).

**Señales**: f1=0.09 embSim=0.46 | **Judge**: correct — La candidata nombra correctamente el currulao como la danza en cuestión, coincidiendo con el hecho central de la referencia.

**Veredicto humano**: `judge`

---

## 47/52 — meta_llama-4-maverick — [trueque-139]

**Pregunta** (Colombia): Menciona los tres pisos térmicos más representativos de Colombia y un cultivo típico de cada uno.

**Referencia**: El piso cálido se caracteriza por el cultivo de caña de azúcar, el templado por el café y el frío por la papa. Estos tres pisos térmicos son los más representativos en la agricultura colombiana.

**Respuesta del modelo**: Los tres pisos térmicos más representativos de Colombia son:

1. Cálido: Café
2. Templado: Flores
3. Frío: Papa

**Señales**: f1=0.56 embSim=0.80 | **Judge**: incorrect — La candidata asigna cultivos incorrectos a los pisos cálido y templado, contradiciendo la referencia.

**Veredicto humano**: `judge`

---

## 48/52 — meta_llama-4-maverick — [trueque-315]

**Pregunta** (México): ¿qué fechas abarcó el periodo conocido como el Maximato?

**Referencia**: De 1928 a 1934.

**Respuesta del modelo**: El Maximato fue un periodo histórico y político de México que abarcó desde 1928, con el gobierno de Emilio Portes Gil como presidente interino del país, hasta 1934, con el inicio del gobierno de Lázaro Cárdenas. Este periodo se caracterizó por el influjo de Plutarco Elías Calles en la política mexicana, de cuyo apodo de "Jefe Máximo de la Revolución" deriva el nombre de Maximato. Durante este tiempo, tres presidentes (Emilio Portes Gil, Pascual Ortiz Rubio y Abelardo L. Rodríguez) ejercieron el cargo bajo la influencia de Calles.

**Señales**: f1=0.06 embSim=0.34 | **Judge**: correct — La candidata expresa exactamente las fechas 1928-1934 de la referencia.

**Veredicto humano**: `judge`

---

## 49/52 — meta_llama-4-maverick — [trueque-230]

**Pregunta** (Ecuador): ¿Qué son los churos en ecuador?

**Referencia**: Los churos en Ecuador son caracoles terrestres comestibles, un manjar típico de la Sierra andina que se consume especialmente en mercados como los de Quito y Otavalo, preparados hervidos y acompañados de limón, ají o colada de tres granos, siendo un alimento de temporada que aparece con las lluvias.

**Respuesta del modelo**: Los churo son un tipo de caracol de agua dulce que se consume en Ecuador, especialmente en la región de la Sierra. Se les considera un plato típico y nutritivo en la gastronomía ecuatoriana.

**Señales**: f1=0.27 embSim=0.86 | **Judge**: incorrect — Contradice el hecho central al definirlos como caracoles de agua dulce en lugar de terrestres.

**Veredicto humano**: `judge`

---

## 50/52 — meta_llama-4-maverick — [trueque-245]

**Pregunta** (El Salvador): ¿Qué expresa el adjetivo “ajolotado” en el Salvador?

**Referencia**: El adjetivo “ajolotado” en El Salvador describe a una persona atontada, distraída o atolondrada, por comparación con el guajolote.

**Respuesta del modelo**: En El Salvador, "ajolotado" se utiliza para describir a alguien que está atontado, aturdido o confundido. La palabra "ajolotado" deriva del náhuatl "axolotl", que se refiere a un tipo de salamandra. En el uso salvadoreño, se aplica metafóricamente para indicar que alguien está desorientado o no está actuando con claridad mental.

**Señales**: f1=0.12 embSim=0.85 | **Judge**: incorrect — Contradice la referencia al atribuir el origen a axolotl en vez de la comparación con el guajolote.

**Veredicto humano**: `senales` — significado coincide casi exacto (atontado/aturdido); solo etimologia difiere -> partial o correct

---

## 51/52 — meta_llama-4-maverick — [trueque-62]

**Pregunta** (Bolivia): ¿Qué es el pique macho en Bolivia?

**Referencia**: El pique macho es un plato típico de Cochabamba, Bolivia, que consiste en trozos de carne de res, chorizo, papas fritas, cebolla, tomate y locoto picante, acompañado a veces de huevo duro. Su nombre surgió por ser un plato contundente, “para machos”, y es conocido por su sabor intenso y porciones generosas.

**Respuesta del modelo**: El pique macho es un plato típico de Bolivia, consiste en una porción de papas fritas acompañadas de carne de charque (cecina), cubierto con salsa de tomate y mayonesa, y decorado con aceitunas y queso rallado.

**Señales**: f1=0.35 embSim=0.92 | **Judge**: incorrect — La candidata describe ingredientes y origen distintos a los de la referencia

**Veredicto humano**: `judge`

---

## 52/52 — meta_llama-4-maverick — [trueque-176]

**Pregunta** (Costa Rica): ¿De qué planta específica se extrae la savia para producir el "Vino de Coyol", una bebida fermentada muy popular en Guanacaste?

**Referencia**: La savia para producir el "Vino de Coyol" se extrae de la palma coyol, cuyo nombre científico es Acrocomia vinifera, cortando su ápice para recolectar el líquido que luego se fermenta.

**Respuesta del modelo**: La savia para producir el "Vino de Coyol" se extrae de la palma de coyol (Acrocomia aculeata).

**Señales**: f1=0.57 embSim=0.96 | **Judge**: incorrect — Contradice el nombre científico central de la referencia (Acrocomia vinifera vs. aculeata) y omite el método de extracción.

**Veredicto humano**: `judge` — ref-issue: coyol

---
