-- Seed data for offers (run after schema.sql)
insert into public.offers
  (title, company, location, type, duration, start_date, start_label, mode, description, tags, logo_url, status)
values
  (
    'Stage Full-Stack JS',
    'Capgemini',
    'Belfort, FR',
    'Stage',
    '6 mois',
    '2026-03-01',
    'Mars 2026',
    'Hybride',
    'Développement de features web, API Node.js, UI Angular, tests et CI/CD.',
    array['Angular','Node.js','PostgreSQL'],
    'https://upload.wikimedia.org/wikipedia/commons/9/9d/Capgemini_201x_logo.svg',
    'open'
  ),
  (
    'Stage Data & IA',
    'Google',
    'Paris, FR',
    'Stage',
    '5 mois',
    '2026-04-01',
    'Avril 2026',
    'Présentiel',
    'Exploration de modèles ML, traitement de données et dashboards analytiques.',
    array['Python','ML','BigQuery'],
    'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
    'open'
  ),
  (
    'Stage Cloud & DevOps',
    'Thales',
    'Toulouse, FR',
    'Stage',
    '4-6 mois',
    '2026-02-01',
    'Février 2026',
    'Hybride',
    'Automatisation CI/CD, déploiement cloud, observabilité et sécurité.',
    array['Docker','Kubernetes','CI/CD'],
    'https://upload.wikimedia.org/wikipedia/commons/2/21/Thales_Logo.svg',
    'open'
  ),
  (
    'Stage Software Engineering',
    'Dassault Systèmes',
    'Vélizy-Villacoublay, FR',
    'Stage',
    '6 mois',
    '2026-05-01',
    'Mai 2026',
    'Hybride',
    'Développement de modules 3D et optimisation de pipelines de simulation.',
    array['C++','3D','Simulation'],
    'https://upload.wikimedia.org/wikipedia/commons/0/05/Dassault_systemes_logo.svg',
    'open'
  ),
  (
    'Stage Digital Consulting',
    'Sopra Steria',
    'Paris, FR',
    'Stage',
    '5 mois',
    '2026-04-01',
    'Avril 2026',
    'Hybride',
    'Accompagnement de projets data, cloud et modernisation d’applications.',
    array['Cloud','Data','UX'],
    'https://upload.wikimedia.org/wikipedia/commons/0/02/Sopra_Steria_logo.svg',
    'open'
  ),
  (
    'Stage Ingénierie Industrielle',
    'Forvia',
    'Montbéliard, FR',
    'Stage',
    '4 mois',
    '2026-02-15',
    'Février 2026',
    'Présentiel',
    'Optimisation de processus industriels et suivi qualité.',
    array['Lean','Qualité','Industriel'],
    'https://upload.wikimedia.org/wikipedia/commons/1/18/Faurecia_logo.svg',
    'open'
  );
