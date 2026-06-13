insert into public.subscription_plans (
  id, name, slug, description, price_monthly,
  monthly_sample_limit, monthly_instrumental_limit,
  includes_courses, is_active
)
values
  (
    '10000000-0000-4000-8000-000000000001',
    'Initiate',
    'initiate',
    'Primera llave al archivo. Escucha más. Descarga con precisión.',
    149,
    10,
    0,
    false,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'Inner Circle',
    'inner-circle',
    'Frecuencia privada para productores que ya conocen la señal.',
    349,
    50,
    5,
    false,
    true
  ),
  (
    '10000000-0000-4000-8000-000000000003',
    'Archivist',
    'archivist',
    'Acceso completo al archivo, las obras y el conocimiento.',
    649,
    null,
    null,
    true,
    true
  )
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  price_monthly = excluded.price_monthly,
  monthly_sample_limit = excluded.monthly_sample_limit,
  monthly_instrumental_limit = excluded.monthly_instrumental_limit,
  includes_courses = excluded.includes_courses,
  is_active = excluded.is_active;

insert into public.sample_packs (
  id, title, slug, description, genre, bpm, musical_key,
  pack_type, tags, file_path, status, published_at
)
values
  ('20000000-0000-4000-8000-000000000001', 'Obsidian Drums', 'obsidian-drums', 'Baterías secas y profundas para rituales nocturnos.', 'Hip Hop', 92, 'Dm', 'Drum Kit', array['drums','hip-hop','dark'], 'sample-packs/obsidian-drums.zip', 'published', now()),
  ('20000000-0000-4000-8000-000000000002', 'Midnight Ritual', 'midnight-ritual', 'Coros lejanos, cinta gastada y melodías ceremoniales.', 'Trap', 88, 'F#m', 'Texture Pack', array['melodic','dark','atmospheric'], 'sample-packs/midnight-ritual.zip', 'published', now()),
  ('20000000-0000-4000-8000-000000000003', 'Neon Brujería', 'neon-brujeria', 'Percusión latina mutada para frecuencias modernas.', 'Reggaetón', 96, 'Am', 'Drum Kit', array['reggaeton','latin','modern'], 'sample-packs/neon-brujeria.zip', 'published', now()),
  ('20000000-0000-4000-8000-000000000004', 'Archivo 909', 'archivo-909', 'Máquinas clásicas registradas en una habitación sin ventanas.', 'Techno', 100, 'C#m', 'Drum Kit', array['techno','90s','analog'], 'sample-packs/archivo-909.zip', 'published', now()),
  ('20000000-0000-4000-8000-000000000005', 'Ritual de Cinta', 'ritual-de-cinta', 'Texturas lo-fi rescatadas de grabaciones olvidadas.', 'Lo-Fi', 78, 'G', 'Texture Pack', array['lo-fi','texture','tape'], 'sample-packs/ritual-de-cinta.zip', 'published', now())
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  genre = excluded.genre,
  bpm = excluded.bpm,
  musical_key = excluded.musical_key,
  pack_type = excluded.pack_type,
  tags = excluded.tags,
  file_path = excluded.file_path,
  status = excluded.status;

insert into public.samples (
  id, sample_pack_id, title, slug, genre, bpm, musical_key,
  sample_type, tags, duration_seconds, file_path, status, published_at
)
values
  ('30000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000001','Kick_Obsidian_01.wav','kick-obsidian-01','Hip Hop',92,'Dm','Kick',array['drums','dark'],18,'samples/Kick_Obsidian_01.wav','published',now()),
  ('30000000-0000-4000-8000-000000000002','20000000-0000-4000-8000-000000000001','Snare_Dust_04.wav','snare-dust-04','Hip Hop',92,'Dm','Snare',array['drums','dusty'],20,'samples/Snare_Dust_04.wav','published',now()),
  ('30000000-0000-4000-8000-000000000003','20000000-0000-4000-8000-000000000002','MR_Atmos_DistantChoir.wav','mr-atmos-distantchoir','Trap',88,'F#m','Atmos',array['vocal','dark'],22,'samples/MR_Atmos_DistantChoir.wav','published',now()),
  ('30000000-0000-4000-8000-000000000004','20000000-0000-4000-8000-000000000002','MR_Texture_WornTape.wav','mr-texture-worntape','Trap',88,'F#m','Texture',array['tape','vinyl'],24,'samples/MR_Texture_WornTape.wav','published',now()),
  ('30000000-0000-4000-8000-000000000005','20000000-0000-4000-8000-000000000003','NB_Dembow_Shadow.wav','nb-dembow-shadow','Reggaetón',96,'Am','Loop',array['latin','drums'],26,'samples/NB_Dembow_Shadow.wav','published',now()),
  ('30000000-0000-4000-8000-000000000006','20000000-0000-4000-8000-000000000003','NB_Perc_Crystal.wav','nb-perc-crystal','Reggaetón',96,'Am','One Shot',array['perc','bright'],28,'samples/NB_Perc_Crystal.wav','published',now()),
  ('30000000-0000-4000-8000-000000000007','20000000-0000-4000-8000-000000000004','A909_Kick_Raw.wav','a909-kick-raw','Techno',100,'C#m','Kick',array['909','analog'],30,'samples/A909_Kick_Raw.wav','published',now()),
  ('30000000-0000-4000-8000-000000000008','20000000-0000-4000-8000-000000000004','A909_Hat_Closed.wav','a909-hat-closed','Techno',100,'C#m','Hi-Hat',array['909','club'],32,'samples/A909_Hat_Closed.wav','published',now()),
  ('30000000-0000-4000-8000-000000000009','20000000-0000-4000-8000-000000000005','RC_Noise_Hall.wav','rc-noise-hall','Lo-Fi',78,'G','Texture',array['tape','noise'],34,'samples/RC_Noise_Hall.wav','published',now()),
  ('30000000-0000-4000-8000-000000000010','20000000-0000-4000-8000-000000000005','RC_Keys_Forgotten.wav','rc-keys-forgotten','Lo-Fi',78,'G','Loop',array['keys','melodic'],36,'samples/RC_Keys_Forgotten.wav','published',now())
on conflict (id) do update set
  title = excluded.title,
  genre = excluded.genre,
  bpm = excluded.bpm,
  musical_key = excluded.musical_key,
  sample_type = excluded.sample_type,
  tags = excluded.tags,
  duration_seconds = excluded.duration_seconds,
  file_path = excluded.file_path,
  status = excluded.status;

insert into public.instrumentals (
  id, title, slug, description, genre, bpm, musical_key, mood,
  tags, file_path, license, price, status, published_at
)
values
  ('40000000-0000-4000-8000-000000000001','Eclipse Ritual','eclipse-ritual','Una transmisión original de la matriz sonora SSR.','Dark Trap',86,'F#m','Nocturno',array['dark trap','nocturno'],'instrumentals/eclipse-ritual.wav','Licencia básica SSR',1200,'published',now()),
  ('40000000-0000-4000-8000-000000000002','Eco del Abismo','eco-del-abismo','Una transmisión original de la matriz sonora SSR.','Hip Hop',92,'Dm','Introspectivo',array['hip hop','introspectivo'],'instrumentals/eco-del-abismo.wav','Licencia básica SSR',900,'published',now()),
  ('40000000-0000-4000-8000-000000000003','Voz de los Muertos','voz-de-los-muertos','Una transmisión original de la matriz sonora SSR.','Boom Bap',74,'Cm','Crudo',array['boom bap','crudo'],'instrumentals/voz-de-los-muertos.wav','Licencia básica SSR',1100,'published',now()),
  ('40000000-0000-4000-8000-000000000004','Clave Fantasma','clave-fantasma','Una transmisión original de la matriz sonora SSR.','R&B',98,'Bbm','Etéreo',array['r&b','etéreo'],'instrumentals/clave-fantasma.wav','Licencia básica SSR',1300,'published',now()),
  ('40000000-0000-4000-8000-000000000005','Circuito Rojo','circuito-rojo','Una transmisión original de la matriz sonora SSR.','Techno',128,'Am','Hipnótico',array['techno','hipnótico'],'instrumentals/circuito-rojo.wav','Licencia básica SSR',1500,'published',now())
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  genre = excluded.genre,
  bpm = excluded.bpm,
  musical_key = excluded.musical_key,
  mood = excluded.mood,
  tags = excluded.tags,
  file_path = excluded.file_path,
  license = excluded.license,
  price = excluded.price,
  status = excluded.status;

insert into public.courses (
  id, title, slug, description, instructor, status, published_at
)
values
  ('50000000-0000-4000-8000-000000000001','Arquitectura del Beat','arquitectura-del-beat','De la primera frecuencia al arreglo terminado.','Consejo SSR','published',now()),
  ('50000000-0000-4000-8000-000000000002','Texturas Prohibidas','texturas-prohibidas','Resampling, cinta, ruido y profundidad.','Consejo SSR','draft',null)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  instructor = excluded.instructor,
  status = excluded.status;

insert into public.course_modules (
  id, course_id, title, description, position
)
values
  ('51000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000001','Fundamentos de la frecuencia','Ritmo, intención y selección sonora.',1),
  ('51000000-0000-4000-8000-000000000002','50000000-0000-4000-8000-000000000001','Construcción del ritual','Arreglo, tensión y espacio.',2),
  ('51000000-0000-4000-8000-000000000003','50000000-0000-4000-8000-000000000002','Materia sonora','Fuentes, ruido y resampling.',1)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  position = excluded.position;

insert into public.course_lessons (
  id, module_id, title, description, position,
  duration_seconds, is_preview, status
)
values
  ('52000000-0000-4000-8000-000000000001','51000000-0000-4000-8000-000000000001','Escuchar antes de producir','Cómo reconocer el pulso central.',1,480,true,'published'),
  ('52000000-0000-4000-8000-000000000002','51000000-0000-4000-8000-000000000001','La batería como lenguaje','Peso, silencio y síncopa.',2,720,false,'published'),
  ('52000000-0000-4000-8000-000000000003','51000000-0000-4000-8000-000000000002','Arquitectura de ocho compases','Variación sin perder identidad.',1,840,false,'published'),
  ('52000000-0000-4000-8000-000000000004','51000000-0000-4000-8000-000000000003','Introducción al resampling','La señal como materia prima.',1,600,false,'draft')
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  position = excluded.position,
  duration_seconds = excluded.duration_seconds,
  is_preview = excluded.is_preview,
  status = excluded.status;
