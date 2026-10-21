export const BLOG_CATEGORY_ORDER = [
  "MLOps",
  "Data & Analytics",
  "Machine Learning",
  "Deep Learning & Computer Vision",
  "Generative AI & RAG",
  "AI Agents & Automation",
  "Workflows & Automation",
  "Cloud & DevOps",
  ".NET & Software Engineering",
  "Python",
  "AI & Engineering",
] as const;

const categoryRules: Array<[string, RegExp]> = [
  ["MLOps", /\bmlops\b|mlflow|model (?:monitoring|deployment|serving)|experiment tracking|model lifecycle|feature store|drift detection|\bdvc\b|reproducible ml/i],
  ["Data & Analytics", /data analyst|data analytics|analytics|data analysis|\beda\b|feature engineering|power bi|excel|statistics|business intelligence|data visualization/i],
  ["Machine Learning", /machine learning|\bclassification\b|\bclassifier\b|\bregression\b|random forest|xgboost|adaboost|decision tree|clustering|scikit|supervised learning|unsupervised learning|model training|types? of artificial intelligence/i],
  ["Deep Learning & Computer Vision", /deep learning|computer vision|image generation|image recognition|\bcnn\b|convolutional|neural network|object detection|vision transformer/i],
  ["Generative AI & RAG", /generative ai|\bgenai\b|\bllms?\b|large language|foundational small language model|\bslm\b|\brag\b|retrieval augmented|prompt|embedding|vector (?:database|search)|openai|chatgpt|transformer|panda.?lm|foundational.*model/i],
  ["AI Agents & Automation", /\bagents?\b|langgraph|semantic kernel|\bmcp\b|autogen|agentic|tool calling|orchestrat/i],
  ["Workflows & Automation", /\bn8n\b|zapier|temporal|workflow|logic app|automation/i],
  ["Cloud & DevOps", /azure|\baws\b|\bgcp\b|cloud|kubernetes|docker|terraform|devops|ci\/cd|gitops|container|infrastructure|\bgit\b/i],
  [".NET & Software Engineering", /\.net|asp\.net|\bc#\b|design pattern|microservice|software engineering|api development|rest api|programming|architecture pattern|queues|topics|messaging/i],
  ["Python", /\bpython\b|\bnumpy\b|\bpandas\b|\bscipy\b/i],
];

const tagRules: Array<[string, RegExp]> = [
  [".NET", /\.net|asp\.net|\bc#\b/i],
  ["Python", /\bpython\b/i],
  ["NumPy", /\bnumpy\b/i],
  ["Pandas", /\bpandas\b/i],
  ["SQL", /\bsql\b/i],
  ["SQL Server", /sql server/i],
  ["PostgreSQL", /postgres(?:ql)?/i],
  ["Excel", /\bexcel\b/i],
  ["Power BI", /power bi/i],
  ["EDA", /\beda\b|exploratory data analysis/i],
  ["Feature Engineering", /feature engineering/i],
  ["Classification", /\bclassification\b|\bclassifier\b/i],
  ["Regression", /\bregression\b/i],
  ["Random Forest", /random forest/i],
  ["XGBoost", /xgboost/i],
  ["Machine Learning", /machine learning|\bml-\d+\b|\bml fundamentals\b/i],
  ["Deep Learning", /deep learning/i],
  ["Computer Vision", /computer vision|image recognition|object detection/i],
  ["Generative AI", /generative ai|\bgenai\b|panda.?lm|foundational small language model/i],
  ["LLMs", /\bllms?\b|large language model|\bslm\b/i],
  ["Prompt Engineering", /prompt/i],
  ["RAG", /\brag\b|retrieval augmented/i],
  ["Embeddings", /embedding/i],
  ["Vector Search", /vector (?:database|search)|vector db/i],
  ["MLOps", /\bmlops\b|mlflow|model (?:monitoring|deployment|serving)|experiment tracking|model lifecycle|feature store|drift detection/i],
  ["MLflow", /mlflow/i],
  ["DVC", /\bdvc\b/i],
  ["Azure", /azure/i],
  ["AWS", /\baws\b/i],
  ["GCP", /\bgcp\b|google cloud/i],
  ["Cloud", /cloud/i],
  ["Kubernetes", /kubernetes/i],
  ["Docker", /docker|container/i],
  ["Terraform", /terraform/i],
  ["CI/CD", /ci\/cd|continuous integration|continuous delivery/i],
  ["Git", /\bgit\b|gitops/i],
  ["AI Agents", /\bagents?\b|agentic|autogen|tool calling/i],
  ["LangGraph", /langgraph/i],
  ["Semantic Kernel", /semantic kernel/i],
  ["MCP", /\bmcp\b|model context protocol/i],
  ["n8n", /\bn8n\b/i],
  ["Zapier", /zapier/i],
  ["Temporal", /temporal/i],
  ["Logic Apps", /logic app/i],
  ["API Design", /api|rest api/i],
  ["Design Patterns", /design pattern/i],
  ["Microservices", /microservice/i],
  ["Data Engineering", /data engineer|data engineering|data pipeline/i],
  ["Data Analytics", /data analyst|data analytics|data analysis|analytics|business intelligence/i],
  ["Statistics", /statistics|statistical/i],
];

export function classifyPost(title: string, description = "") {
  const content = `${title} ${description}`;
  const categories = categoryRules
    .filter(([, pattern]) => pattern.test(content))
    .map(([name]) => name);
  const tags = tagRules
    .filter(([, pattern]) => pattern.test(content))
    .map(([name]) => name);

  return {
    categories: categories.length ? categories : ["AI & Engineering"],
    tags: tags.length ? tags : ["AI & Engineering"],
  };
}
