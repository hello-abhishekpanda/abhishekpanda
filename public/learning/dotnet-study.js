/* Locally served product marks; generic concepts use neutral diagram symbols. */
(() => {
  const marks = {
    '.NET': ['dotnet.svg', 'https://dotnet.microsoft.com/'],
    'C#': ['csharp.svg', 'https://learn.microsoft.com/en-us/dotnet/csharp/'],
    Azure: ['microsoftazure.svg', 'https://azure.microsoft.com/'],
    GraphQL: ['graphql.svg', 'https://graphql.org/learn/'],
    gRPC: ['grpc.svg', 'https://grpc.io/docs/'],
    'Semantic Kernel': ['semantic-kernel.png', 'https://learn.microsoft.com/en-us/semantic-kernel/overview/'],
    Docker: ['docker.svg', 'https://docs.docker.com/'],
    Kubernetes: ['kubernetes.svg', 'https://kubernetes.io/docs/'],
    Grafana: ['grafana.svg', 'https://grafana.com/docs/'],
    'GitHub Actions': ['github-actions.svg', 'https://docs.github.com/en/actions']
  };
  const shapes = {
    client: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5"/>',
    server: '<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6h.01M7 17h.01m4-11h6m-6 11h6"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
    network: '<circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><path d="m10 8-4 8m8-8 4 8M8 19h8"/>',
    code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
    shield: '<path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6Zm-4 10 3 3 5-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
    activity: '<path d="M2 12h5l3-8 4 16 3-8h5"/>',
    stream: '<path d="M3 5h16m-4-3 4 3-4 3M21 12H5m4-3-4 3 4 3M3 19h16m-4-3 4 3-4 3"/>'
  };
  Object.assign(marks, {
    'PostgreSQL':['postgresql.svg','https://www.postgresql.org/docs/'],
    'SQL Server':['microsoftsqlserver.svg','https://learn.microsoft.com/en-us/sql/'],
    'Terraform':['terraform.svg','https://developer.hashicorp.com/terraform/docs'],
    'Bicep':['bicep.svg','https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/'],
    'Helm':['helm.svg','https://helm.sh/docs/'],
    'Dapr':['dapr.svg','https://docs.dapr.io/'],
    'RabbitMQ':['rabbitmq.svg','https://www.rabbitmq.com/docs'],
    'Kafka':['apachekafka.svg','https://kafka.apache.org/documentation/'],
    'Hugging Face':['huggingface.svg','https://huggingface.co/docs'],
    'Azure DevOps':['azuredevops.svg','https://learn.microsoft.com/en-us/azure/devops/'],
    'Azure Service Bus':['10836-icon-service-Azure-Service-Bus.svg','https://learn.microsoft.com/en-us/azure/service-bus-messaging/'],
    'API Management':['10042-icon-service-API-Management-Services.svg','https://learn.microsoft.com/en-us/azure/api-management/'],
    'Key Vault':['10245-icon-service-Key-Vaults.svg','https://learn.microsoft.com/en-us/azure/key-vault/'],
    'Application Insights':['00012-icon-service-Application-Insights.svg','https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview'],
    'AKS':['10023-icon-service-Kubernetes-Services.svg','https://learn.microsoft.com/en-us/azure/aks/'],
    'Functions':['10029-icon-service-Function-Apps.svg','https://learn.microsoft.com/en-us/azure/azure-functions/'],
    'App Service':['10035-icon-service-App-Services.svg','https://learn.microsoft.com/en-us/azure/app-service/']
  });
  function symbol(kind) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6'); svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = shapes[kind] || shapes.network;
    return svg;
  }
  function logo(name) {
    const img = new Image(); img.src = '/tech/' + marks[name][0]; img.alt = name;
    img.width = 32; img.height = 32; img.decoding = 'async';
    img.addEventListener('error', () => { img.replaceWith(symbol('code')); }, {once:true});
    return img;
  }
  const strip = document.createElement('nav'); strip.className = 'technology-strip';
  strip.setAttribute('aria-label', 'Technology documentation');
  Object.keys(marks).forEach(name => {
    const link = document.createElement('a'); link.href = marks[name][1];
    link.target = '_blank'; link.rel = 'noopener noreferrer'; link.append(logo(name));
    const text = document.createElement('span'); text.textContent = name; link.append(text); strip.append(link);
  });
  document.querySelector('.hero-grid').after(strip);
  document.querySelectorAll('.hero-flow-slide').forEach(slide => {
    const title = slide.dataset.title, mode = slide.dataset.mode;
    const kind = title.includes('Polling') || title.includes('polling') ? 'clock' : mode === 'guard' ? 'shield' : mode === 'stream' || mode === 'loop' ? 'stream' : mode === 'telemetry' ? 'activity' : slide.dataset.category === 'runtime' ? 'code' : 'network';
    slide.querySelector('.hero-flow-icon').replaceChildren(marks[title] ? logo(title) : symbol(kind));
    ['source','middle','target'].forEach((role, index) => {
      slide.querySelector('.hero-node.' + role + ' i').replaceChildren(symbol(index === 0 ? 'client' : index === 1 ? kind : /Data|Domain|Outbox|Broker/.test(slide.textContent) ? 'database' : 'server'));
    });
  });
  const direct = {
    'GraphQL':'https://graphql.org/learn/', 'DataLoader':'https://github.com/graphql/dataloader',
    'Docker':'https://docs.docker.com/', 'Helm':'https://helm.sh/docs/',
    'Terraform':'https://developer.hashicorp.com/terraform/docs',
    'YARP':'https://microsoft.github.io/reverse-proxy/',
    'ONNX Runtime':'https://onnxruntime.ai/docs/', 'ML.NET':'https://learn.microsoft.com/en-us/dotnet/machine-learning/',
    'Ollama':'https://docs.ollama.com/', 'Hugging Face':'https://huggingface.co/docs',
    'Semantic Kernel':'https://learn.microsoft.com/en-us/semantic-kernel/overview/',
    'IChatClient':'https://learn.microsoft.com/en-us/dotnet/api/microsoft.extensions.ai.ichatclient',
    'IEmbeddingGenerator':'https://learn.microsoft.com/en-us/dotnet/core/extensions/artificial-intelligence',
    'ActivitySource':'https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.activitysource',
    'Meter':'https://learn.microsoft.com/en-us/dotnet/api/system.diagnostics.metrics.meter',
    'ILogger':'https://learn.microsoft.com/en-us/dotnet/core/extensions/logging',
    'Protocol Buffers':'https://protobuf.dev/overview/',
    'Testcontainers':'https://dotnet.testcontainers.org/',
    'Grafana':'https://grafana.com/docs/', 'Prometheus':'https://prometheus.io/docs/introduction/overview/',
    'OTLP':'https://opentelemetry.io/docs/specs/otlp/',
    'OpenTelemetry':'https://opentelemetry.io/docs/languages/dotnet/'
  };
  const stageIcons=['code','server','network','server','stream','database','network','shield','activity','network'];
  document.querySelectorAll('.part').forEach((part,i)=>{
    const badge=document.createElement('span');badge.className='chapter-symbol';badge.append(symbol(stageIcons[i]));part.querySelector('.part-head h3').prepend(badge);
    part.querySelectorAll('.module-title').forEach(title=>{const icon=document.createElement('span');icon.className='module-symbol';icon.append(symbol(stageIcons[i]));title.prepend(icon)});
    const rail=document.querySelectorAll('#railNav a')[i];if(rail){rail.querySelector('b').replaceChildren(symbol(stageIcons[i]));}
  });
  document.querySelectorAll('.module').forEach(module => {
    const overview = module.querySelector('.module-link').href;
    const context = module.querySelector('.module-title').textContent;
    module.querySelectorAll('label.topic').forEach(label => {
      const topic = label.querySelector('span').textContent;
      const match=Object.keys(marks).sort((a,b)=>b.length-a.length).find(name=>topic===name || topic.startsWith(name+' ') || topic.includes('; '+name));
      const mark=document.createElement('span');mark.className='topic-symbol';mark.append(match?logo(match):symbol(/security|identity|auth|secret|TLS|JWT/i.test(topic)?'shield':/data|query|SQL|store|cache/i.test(topic)?'database':/metric|trace|log|profil/i.test(topic)?'activity':'code'));label.insertBefore(mark,label.querySelector('span'));
      const row = document.createElement('div'); row.className = 'topic study-topic';
      label.before(row); label.className = 'topic-check'; row.append(label);
      const links = document.createElement('div'); links.className = 'topic-resources';
      const read = document.createElement('a'); read.href = direct[topic] || overview;
      read.textContent = direct[topic] ? 'Topic documentation ↗' : 'Module reference ↗';
      read.setAttribute('aria-label', read.textContent.replace(' ↗','') + ': ' + topic);
      const search = document.createElement('a');
      search.href = 'https://learn.microsoft.com/en-us/search/?terms=' + encodeURIComponent(topic + ' ' + context + ' .NET');
      search.textContent = 'Find this topic on Learn ↗';
      search.setAttribute('aria-label', 'Search Microsoft Learn for ' + topic);
      [read, search].forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; links.append(a); });
      row.append(links);
    });
  });
})();
