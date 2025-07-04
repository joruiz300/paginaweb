# FLUJO CALOR - Lead Magnet
# FLUJO CALOR: Tu Sistema de Respuesta a Leads en <2 Minutos

## La Plantilla N8N + Prompts de IA para Automatización Completa

---

**🚀 Por Math AI Agency | Sistema de Automatización Profesional**

Gracias por descargar el sistema "FLUJO CALOR". Si estás aquí, es porque sabes que cada minuto que tardas en responder a un lead es una venta potencial que se enfría.

### ✅ Lo que recibes en este kit:

1. **Diagrama estratégico completo** del flujo de trabajo
2. **Archivo .json del flujo N8N** listo para importar
3. **3 Prompts de IA optimizados** para cualificación automática
4. **Checklist de implementación** paso a paso
5. **BONUS:** Templates de email personalizados

---

## 🎯 **PARTE 1: LA ESTRATEGIA - De Lead Frío a Cita Caliente**

Antes de importar el flujo, es crucial que entiendas la lógica estratégica. Un buen sistema de automatización no son solo nodos conectados; es una **estrategia de negocio** operativa.

### **Las 5 Etapas del FLUJO CALOR:**

#### **🎣 Etapa 1: Captura y Disparo Inmediato**
- **Trigger:** Webhook/Cal.com/Formulario web
- **Velocidad:** <30 segundos desde captura
- **Objetivo:** Activación instantánea del flujo

#### **🧠 Etapa 2: Enriquecimiento Inteligente**  
- **Proceso:** Análisis de IA de la información capturada
- **Output:** Puntuación, categorización y contexto del lead
- **Herramienta:** OpenAI + prompts específicos

#### **🚦 Etapa 3: Decisión Automatizada**
- **Logic:** Segmentación basada en puntuación de IA
- **Caminos:** Lead Caliente | Lead Tibio | Lead Frío
- **Criterio:** ICP matching + urgencia detectada

#### **⚡ Etapa 4: Acción Personalizada**
- **CRM Update:** Datos estructurados + scoring
- **Team Alert:** Notificación con contexto inteligente  
- **Lead Response:** Email personalizado automático

#### **🗓️ Etapa 5: Seguimiento Proactivo**
- **Recordatorios:** Para citas agendadas
- **Nurturing:** Para leads no listos aún
- **Analytics:** Tracking completo del funnel

---

## 🧠 **PARTE 2: EL CEREBRO DEL SISTEMA - 3 Prompts de IA**

Estos prompts son el componente más valioso. Son el "software" que se ejecuta dentro del nodo de OpenAI en tu flujo N8N.

### **🔍 Prompt 1: Cualificación General y Puntuación**

```
## ROL
Eres un Asistente de Ventas B2B experto en cualificar leads para una agencia de automatización llamada Math AI Agency.

## TAREA
Analiza la siguiente información de un nuevo lead. Tu objetivo es:
1. Asignar una puntuación de "Calidad del Lead" de 1 a 10 (1=Baja, 10=Perfecta)
2. Identificar la necesidad principal del prospecto
3. Extraer el nombre de la empresa
4. Generar un resumen de 20 palabras para notificar al equipo de ventas
5. Responder únicamente con un objeto JSON

## CONTEXTO
- **Mi empresa:** Math AI Agency, especializada en automatización para PYMES de servicios B2B
- **Cliente Ideal (ICP):** Empresas de servicios con equipos de ventas que sufren por procesos manuales y lentos
- **Información del Lead:**
    - Nombre: {{$json.body.payload.attendee.name}}
    - Email: {{$json.body.payload.attendee.email}}
    - Empresa: {{$json.body.payload.responses.company.value}}
    - Cargo: {{$json.body.payload.responses.role.value}}
    - Necesidad descrita: {{$json.body.payload.responses.need.value}}

## OUTPUT (Solo responde con este formato JSON)
{
  "puntuacion_lead": <número_del_1_al_10>,
  "necesidad_principal": "<resumen_de_la_necesidad>",
  "nombre_empresa": "<nombre_de_la_empresa>",
  "resumen_slack": "<resumen_de_20_palabras_para_el_equipo>"
}
```

### **⏱️ Prompt 2: Detección de Urgencia**

```
## ROL
Eres un analista de ventas especializado en detectar la intención de compra y la urgencia en las comunicaciones de un prospecto.

## TAREA
Analiza la descripción de la necesidad del lead y clasifica su nivel de urgencia. Busca palabras clave como "ahora", "urgente", "inmediato", "estamos evaluando proveedores", vs. "a futuro", "explorando", "solo curiosidad". Responde únicamente con un objeto JSON.

## CONTEXTO
- **Información del Lead:**
    - Necesidad descrita: {{$json.body.payload.responses.need.value}}

## OUTPUT (Solo responde con este formato JSON)
{
  "nivel_urgencia": "<Alta|Media|Baja>",
  "señal_detectada": "<frase_o_palabra_clave_que_justifica_el_nivel>"
}
```

### **🎯 Prompt 3: Análisis de Encaje con el ICP**

```
## ROL
Eres un Director de Estrategia que debe decidir si un nuevo lead encaja con el perfil de cliente ideal de la agencia.

## TAREA
Evalúa los datos del lead contra nuestro ICP y determina el nivel de "encaje". Nuestro ICP son PYMES (5-50 empleados) de servicios B2B (consultoría, agencias, software). Responde únicamente con un objeto JSON.

## CONTEXTO
- **Datos del Lead:**
    - Empresa: {{$json.body.payload.responses.company.value}}
    - Cargo: {{$json.body.payload.responses.role.value}}
    - Industria/Necesidad: {{$json.body.payload.responses.need.value}}

## OUTPUT (Solo responde con este formato JSON)
{
  "encaje_icp": "<Ideal|Bueno|Bajo>",
  "justificacion": "<breve_explicación_de_por_qué_encaja_o_no>"
}
```

---

## ⚙️ **PARTE 3: LA HERRAMIENTA - Tu Flujo N8N Descargable**

### **📥 Instrucciones de Implementación:**

1. **Descarga el archivo JSON** (se proporcionará tras la configuración)
2. **Importa en N8N:** Workflows → Import → From File
3. **Configura credenciales:** OpenAI, Slack, CRM, etc.
4. **Personaliza los prompts** con tu información específica
5. **Prueba con un lead de ejemplo**

### **⚠️ Importante:**
Este flujo es una plantilla conceptual poderosa, no una solución "plug-and-play". Para que funcione necesitarás:

- ✅ Configurar tus propias credenciales API
- ✅ Adaptar los prompts a tu negocio específico  
- ✅ Conectar tus herramientas (CRM, Slack, etc.)
- ✅ Personalizar las variables del flujo

---

## 📋 **PARTE 4: CHECKLIST DE IMPLEMENTACIÓN**

### **✅ Pre-Implementación**
- [ ] N8N instalado y funcionando
- [ ] API Keys obtenidas (OpenAI, CRM, Slack)
- [ ] Formulario web o Cal.com configurado
- [ ] Webhook endpoint definido

### **✅ Durante la Implementación**  
- [ ] Flujo importado correctamente
- [ ] Credenciales configuradas
- [ ] Prompts personalizados
- [ ] Variables editadas
- [ ] Prueba completada

### **✅ Post-Implementación**
- [ ] Equipo entrenado en el nuevo proceso
- [ ] Métricas de seguimiento configuradas
- [ ] Documentación creada
- [ ] Plan de optimización establecido

---

## 🚀 **El Siguiente Paso: De la Plantilla a la Realidad**

Ya tienes la arquitectura y las herramientas para construir un sistema de captación de leads de élite.

Si al ver esto piensas: **"Entiendo el poder de esto, pero no tengo el tiempo o la experiencia para implementarlo y mantenerlo a la perfección..."**

...entonces estás en el lugar correcto.

### **En Math AI Agency, ese es nuestro trabajo.**

Tomamos esta arquitectura y la convertimos en un sistema robusto, a medida y totalmente gestionado para tu negocio, permitiéndote centrarte en lo que mejor sabes hacer: construir relaciones y cerrar ventas con clientes perfectamente cualificados.

### **🗓️ ¿Listo para el Siguiente Nivel?**

Si estás preparado para dejar de perder leads y transformar tu proceso de ventas, agenda tu **Diagnóstico Gratuito de 15 minutos**.

Sin compromiso. Solo valor puro.

**[🚀 AGENDAR MI DIAGNÓSTICO GRATUITO AHORA](https://cal.com/math-ai/diagnostico-gratuito)**

---

**© 2025 Math AI Agency | https://math-aiagency.com**  
*Automatización Inteligente para Empresas que Crecen*
