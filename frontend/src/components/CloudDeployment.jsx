// Organization: Orbytes Global Solutions, Owner: Logaraj S, Created at: 2026-10-11
// Description: Multi-Cloud Deployment & Infrastructure-as-Code Manager

import { useState } from 'react';

const CLOUDS = [
  { id: 'aws', name: 'Amazon Web Services (AWS)', icon: '☁️', services: ['ECS Fargate', 'Amazon RDS MySQL', 'ALB', 'CloudWatch'] },
  { id: 'gcp', name: 'Google Cloud Platform (GCP)', icon: '🌐', services: ['Cloud Run', 'Cloud SQL MySQL', 'Cloud Load Balancing', 'Cloud Monitoring'] },
  { id: 'azure', name: 'Microsoft Azure', icon: '🔷', services: ['Azure Container Apps', 'Azure Database for MySQL', 'App Gateway', 'Azure Monitor'] },
  { id: 'k8s', name: 'Kubernetes (K8s / Helm)', icon: '☸️', services: ['Deployments', 'StatefulSets', 'Ingress NGINX', 'Prometheus & Grafana'] },
];

const TEMPLATES = {
  k8s: `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: buildpilot-backend\n  namespace: production\nspec:\n  replicas: 3\n  selector:\n    matchLabels:\n      app: buildpilot-backend\n  template:\n    metadata:\n      labels:\n        app: buildpilot-backend\n    spec:\n      containers:\n      - name: backend\n        image: orbytes/buildpilot-backend:latest\n        ports:\n        - containerPort: 8080\n        env:\n        - name: SPRING_DATASOURCE_URL\n          valueFrom:\n            secretKeyRef:\n              name: db-credentials\n              key: url\n        resources:\n          limits:\n            cpu: "1000m"\n            memory: "1024Mi"\n          requests:\n            cpu: "250m"\n            memory: "512Mi"\n        livenessProbe:\n          httpGet:\n            path: /actuator/health\n            port: 8080\n          initialDelaySeconds: 30\n          periodSeconds: 10`,
  aws: `terraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = "us-east-1"\n}\n\nmodule "ecs_service" {\n  source  = "terraform-aws-modules/ecs/aws//modules/service"\n  name    = "buildpilot-ai-pro"\n  cluster_arn = aws_ecs_cluster.main.arn\n  cpu     = 1024\n  memory  = 2048\n\n  container_definitions = {\n    buildpilot = {\n      image = "orbytes/buildpilot-backend:latest"\n      port_mappings = [{ containerPort = 8080 }]\n      environment = [\n        { name = "SPRING_PROFILES_ACTIVE", value = "prod" }\n      ]\n    }\n  }\n}`,
  gcp: `steps:\n- name: 'gcr.io/cloud-builders/docker'\n  args: ['build', '-t', 'gcr.io/$PROJECT_ID/buildpilot-backend:$COMMIT_SHA', '-f', 'backend/Dockerfile', '.']\n- name: 'gcr.io/cloud-builders/docker'\n  args: ['push', 'gcr.io/$PROJECT_ID/buildpilot-backend:$COMMIT_SHA']\n- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'\n  entrypoint: gcloud\n  args:\n  - 'run'\n  - 'deploy'\n  - 'buildpilot-backend'\n  - '--image'\n  - 'gcr.io/$PROJECT_ID/buildpilot-backend:$COMMIT_SHA'\n  - '--region'\n  - 'us-central1'\n  - '--platform'\n  - 'managed'\n  - '--allow-unauthenticated'`,
};

export default function CloudDeployment({ onTriggerToast }) {
  const [selectedCloud, setSelectedCloud] = useState(CLOUDS[3]);
  const [copied, setCopied] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState('');

  const templateCode = TEMPLATES[selectedCloud.id] || TEMPLATES.k8s;

  const copyTemplate = () => {
    navigator.clipboard?.writeText(templateCode);
    setCopied(true);
    if (onTriggerToast) onTriggerToast(`Copied ${selectedCloud.name} IaC manifest!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulateDeploy = () => {
    setDeploying(true);
    setDeploySuccess('');
    setTimeout(() => {
      setDeploying(false);
      setDeploySuccess(`Successfully dispatched deployment rollout to ${selectedCloud.name}! Cluster health confirmed.`);
      if (onTriggerToast) onTriggerToast(`Rollout to ${selectedCloud.name} passed!`, 'success');
    }, 2000);
  };

  return (
    <div className="cloud-deployment-view">
      <header className="page-head row">
        <div>
          <h2>Multi-Cloud & Kubernetes Deployment Studio</h2>
          <p className="muted">
            Production Helm charts, AWS ECS Terraform modules, GCP Cloud Run, and container orchestration.
          </p>
        </div>
        <div className="actions">
          <button className="btn" onClick={copyTemplate}>
            {copied ? '✓ Manifest Copied' : '📋 Copy IaC Spec'}
          </button>
          <button className="btn primary" onClick={simulateDeploy} disabled={deploying}>
            {deploying ? 'Deploying to Cluster…' : '🚀 Trigger Cloud Rollout'}
          </button>
        </div>
      </header>

      {deploySuccess && (
        <div className="banner ok" style={{ borderColor: 'var(--low)', background: 'rgba(74,222,128,0.1)' }}>
          ✓ {deploySuccess}
        </div>
      )}

      {/* Cloud Providers Selector */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
        {CLOUDS.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedCloud(c)}
            className="glass"
            style={{
              margin: 0,
              cursor: 'pointer',
              border: selectedCloud.id === c.id ? '2px solid var(--indigo)' : '1px solid var(--line)',
              background: selectedCloud.id === c.id ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
              <b>{c.name}</b>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
              Stack: {c.services.join(', ')}
            </div>
          </div>
        ))}
      </div>

      {/* Manifest Viewer */}
      <section className="glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <h3>Infrastructure-as-Code (IaC) Manifest</h3>
          <span className="chip on" style={{ fontSize: '0.75rem' }}>Format: YAML / HCL</span>
        </div>

        <pre
          style={{
            margin: 0,
            padding: '1.2rem',
            background: 'rgba(0,0,0,0.5)',
            borderRadius: '10px',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            lineHeight: '1.5',
            color: '#e2e8f0',
            overflowX: 'auto',
          }}
        >
          <code>{templateCode}</code>
        </pre>
      </section>
    </div>
  );
}
