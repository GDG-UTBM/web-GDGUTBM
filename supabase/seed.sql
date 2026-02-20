-- Optional seed data for local testing

insert into public.events (title_fr, title_en, description_fr, description_en, date, location, image_url, partner, partners, type, status, video_url, highlights)
values
('AI & Robotique', 'AI & Robotics', 'Conférence sur l\'intelligence artificielle et la robotique avec des experts Google.',
 'Conference on artificial intelligence and robotics with Google experts.',
 now() + interval '14 days', 'UTBM, Belfort',
 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
 'Google', array['Google'], 'conference', 'upcoming', 'https://www.youtube.com/watch?v=DVLzQGPV8rI',
 array['Présentation des dernières avancées', 'Session Q&A', 'Démonstrations live']),
('Web & Cloud', 'Web & Cloud', 'Atelier de développement web et solutions cloud modernes.',
 'Workshop on web development and modern cloud solutions.',
 now() - interval '120 days', 'UTBM, Sevenans',
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
 'Capgemini', array['Capgemini'], 'workshop', 'past', null,
 array['Introduction à AWS', 'Serverless', 'Sécurité']);

insert into public.activities (title_fr, title_en, description_fr, description_en, icon, details_fr, details_en, display_order)
values
('Conférences & Ateliers', 'Talks & Workshops', 'Des sessions animées par des experts pour approfondir vos connaissances techniques.',
 'Sessions led by experts to deepen your technical knowledge.',
 '🎤', 'Nos conférences et ateliers couvrent les dernières tendances technologiques.',
 'Our talks and workshops cover the latest tech trends.', 0),
('Sessions de Coding', 'Coding Sessions', 'Pratique collaborative pour améliorer vos compétences en programmation.',
 'Collaborative practice to improve your programming skills.',
 '💻', 'Des sessions de codage en groupe pour résoudre des problèmes complexes.',
 'Group coding sessions to solve complex problems.', 1),
('Networking & Échanges', 'Networking & Exchanges', 'Rencontrez des professionnels et passionnés de la tech pour élargir votre réseau.',
 'Meet tech professionals and enthusiasts to expand your network.',
 '🤝', 'Des événements pour connecter étudiants, développeurs et entreprises.',
 'Events to connect students, developers and companies.', 2);
