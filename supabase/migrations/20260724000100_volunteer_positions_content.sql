-- Fill in full bilingual descriptions/criteria for the 5 volunteer positions
-- (the initial seed only had French placeholders for 4 of them, and no
-- English text at all for any of them).

UPDATE public.volunteer_positions SET
  description = 'Support with verifying administrative documents and safeguarding human rights across MUFO''s programs. Includes ongoing training and a certificate of volunteering.',
  description_fr = 'Appui à la vérification des documents administratifs et à la protection des droits humains au sein des programmes de MUFO. Formation continue et certificat de bénévolat à la clé.',
  criteria = 'Legal background. Rigor and a strong sense of confidentiality. Female candidates strongly encouraged.',
  criteria_fr = 'Formation juridique. Rigueur et sens de la confidentialité. Candidatures féminines fortement encouragées.'
WHERE title_fr = 'Conseiller(ère) Juridique & Institutionnel';

UPDATE public.volunteer_positions SET
  description = 'Responsible for MUFO''s visibility on social media and with partners: writing content, capturing photos/videos during field activities, and keeping the website and communication materials up to date. Includes ongoing training and a certificate of volunteering.',
  description_fr = 'Responsable de la visibilité de MUFO sur les réseaux sociaux et auprès des partenaires : rédaction de contenus, prises de vue lors des activités de terrain, mise à jour du site web et des supports de communication. Formation continue et certificat de bénévolat à la clé.',
  criteria = 'Strong writing skills. Comfortable with social media (Facebook, Instagram, LinkedIn). Creativity and an eye for visuals. Basic photo/video editing a plus. Female candidates strongly encouraged.',
  criteria_fr = 'Bon niveau rédactionnel. Maîtrise des réseaux sociaux (Facebook, Instagram, LinkedIn). Créativité et sens de l''image. Notions de montage photo/vidéo appréciées. Candidatures féminines fortement encouragées.'
WHERE title_fr = 'Chargé(e) de Communication & Visibilité';

UPDATE public.volunteer_positions SET
  description = 'Support the planning and execution of field activities (education, community health, development): logistics coordination, liaison with beneficiaries, and tracking of results. Includes ongoing training and a certificate of volunteering.',
  description_fr = 'Appui à la planification et à l''exécution des activités de terrain (éducation, santé communautaire, développement) : organisation logistique, coordination avec les bénéficiaires et suivi des résultats. Formation continue et certificat de bénévolat à la clé.',
  criteria = 'Organized and rigorous. Able to work on the ground in Kinshasa. Community or nonprofit experience a plus. Flexible availability. Female candidates strongly encouraged.',
  criteria_fr = 'Sens de l''organisation et rigueur. Capacité à travailler sur le terrain à Kinshasa. Expérience associative ou communautaire appréciée. Disponibilité flexible. Candidatures féminines fortement encouragées.'
WHERE title_fr = 'Chargé(e) de Programmes & Logistique';

UPDATE public.volunteer_positions SET
  description = 'Identify and maintain institutional, nonprofit, and private partnerships; support fundraising efforts and proposal writing. Includes ongoing training and a certificate of volunteering.',
  description_fr = 'Recherche et entretien de partenariats institutionnels, associatifs et privés ; appui à la recherche de financements et à la rédaction de propositions de projets. Formation continue et certificat de bénévolat à la clé.',
  criteria = 'Strong interpersonal and writing skills. Interest in international development or fundraising. Background in project management or international relations a plus. Female candidates strongly encouraged.',
  criteria_fr = 'Aisance relationnelle et rédactionnelle. Intérêt pour le développement international ou la levée de fonds. Formation en gestion de projet ou relations internationales appréciée. Candidatures féminines fortement encouragées.'
WHERE title_fr = 'Chargé(e) de Développement & Partenariats';

UPDATE public.volunteer_positions SET
  description = 'Day-to-day administrative management: tracking official documents, organizing meetings, and coordinating internally across MUFO''s teams. Includes ongoing training and a certificate of volunteering.',
  description_fr = 'Gestion administrative courante : suivi des documents officiels, organisation des réunions, et coordination interne entre les équipes de MUFO. Formation continue et certificat de bénévolat à la clé.',
  criteria = 'Organized and discreet. Comfortable with office tools (Word, Excel). Personable, punctual, and reliable. Female candidates strongly encouraged.',
  criteria_fr = 'Sens de l''organisation et discrétion. Maîtrise des outils bureautiques (Word, Excel). Bon relationnel, ponctualité et fiabilité. Candidatures féminines fortement encouragées.'
WHERE title_fr = 'Chargé(e) Administratif(ve) & Secrétariat';
