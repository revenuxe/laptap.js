-- Add models to existing series and create more comprehensive catalog

DO $$
DECLARE
  -- Series IDs lookup
  acer_aspire UUID;
  acer_predator UUID;
  acer_swift UUID;
  apple_air UUID;
  apple_pro UUID;
  asus_rog UUID;
  dell_xps UUID;
  hp_14 UUID;
  hp_15 UUID;
  hp_elite UUID;
  hp_envy UUID;
  hp_g UUID;
  hp_notebook UUID;
  hp_omen UUID;
  hp_pav UUID;
  hp_pav_gaming UUID;
  hp_probook UUID;
  hp_slate UUID;
  hp_spectre UUID;
  hp_stream UUID;
  hp_victus UUID;
  hp_zbook UUID;
  
  -- Brand IDs
  lenovo_id UUID;
  asus_id UUID;
  dell_id UUID;
  samsung_id UUID;
  microsoft_id UUID;
  msi_id UUID;
  lg_id UUID;
  
  -- New series
  lenovo_thinkpad UUID;
  lenovo_ideapad UUID;
  lenovo_legion UUID;
  asus_vivobook UUID;
  asus_zenbook UUID;
  dell_inspiron UUID;
  dell_latitude UUID;
  samsung_galaxy UUID;
  samsung_notebook UUID;
  microsoft_surface UUID;
  msi_katana UUID;
  msi_prestige UUID;
  lg_gram UUID;
BEGIN
  -- Look up or create brand IDs
  SELECT id INTO lenovo_id FROM brands WHERE lower(name) = 'lenovo' LIMIT 1;
  IF lenovo_id IS NULL THEN INSERT INTO brands (name) VALUES ('Lenovo') RETURNING id INTO lenovo_id; END IF;

  SELECT id INTO asus_id FROM brands WHERE lower(name) = 'asus' LIMIT 1;
  IF asus_id IS NULL THEN INSERT INTO brands (name) VALUES ('Asus') RETURNING id INTO asus_id; END IF;

  SELECT id INTO dell_id FROM brands WHERE lower(name) = 'dell' LIMIT 1;
  IF dell_id IS NULL THEN INSERT INTO brands (name) VALUES ('Dell') RETURNING id INTO dell_id; END IF;

  SELECT id INTO samsung_id FROM brands WHERE lower(name) = 'samsung' LIMIT 1;
  IF samsung_id IS NULL THEN INSERT INTO brands (name) VALUES ('Samsung') RETURNING id INTO samsung_id; END IF;

  SELECT id INTO microsoft_id FROM brands WHERE lower(name) = 'microsoft' LIMIT 1;
  IF microsoft_id IS NULL THEN INSERT INTO brands (name) VALUES ('Microsoft') RETURNING id INTO microsoft_id; END IF;

  SELECT id INTO msi_id FROM brands WHERE lower(name) = 'msi' LIMIT 1;
  IF msi_id IS NULL THEN INSERT INTO brands (name) VALUES ('MSI') RETURNING id INTO msi_id; END IF;

  SELECT id INTO lg_id FROM brands WHERE lower(name) = 'lg' LIMIT 1;
  IF lg_id IS NULL THEN INSERT INTO brands (name) VALUES ('LG') RETURNING id INTO lg_id; END IF;

  -- Look up existing series IDs
  SELECT id INTO dell_xps FROM series WHERE brand_id = dell_id AND lower(name) LIKE '%xps%' LIMIT 1;
  IF dell_xps IS NULL THEN INSERT INTO series (brand_id, name) VALUES (dell_id, 'XPS') RETURNING id INTO dell_xps; END IF;

  SELECT id INTO asus_rog FROM series WHERE brand_id = asus_id AND lower(name) LIKE '%rog%' LIMIT 1;
  IF asus_rog IS NULL THEN INSERT INTO series (brand_id, name) VALUES (asus_id, 'ROG') RETURNING id INTO asus_rog; END IF;

  -- Acer series
  SELECT s.id INTO acer_aspire FROM series s JOIN brands b ON s.brand_id = b.id WHERE lower(b.name) = 'acer' AND lower(s.name) LIKE '%aspire%' LIMIT 1;
  SELECT s.id INTO acer_predator FROM series s JOIN brands b ON s.brand_id = b.id WHERE lower(b.name) = 'acer' AND lower(s.name) LIKE '%predator%' LIMIT 1;
  SELECT s.id INTO acer_swift FROM series s JOIN brands b ON s.brand_id = b.id WHERE lower(b.name) = 'acer' AND lower(s.name) LIKE '%swift%' LIMIT 1;

  -- Apple series
  SELECT s.id INTO apple_air FROM series s JOIN brands b ON s.brand_id = b.id WHERE lower(b.name) = 'apple' AND lower(s.name) LIKE '%air%' LIMIT 1;
  SELECT s.id INTO apple_pro FROM series s JOIN brands b ON s.brand_id = b.id WHERE lower(b.name) = 'apple' AND lower(s.name) LIKE '%pro%' LIMIT 1;

  -- HP series
  DECLARE
    hp_brand_id UUID;
  BEGIN
    SELECT id INTO hp_brand_id FROM brands WHERE lower(name) = 'hp' LIMIT 1;
    IF hp_brand_id IS NULL THEN INSERT INTO brands (name) VALUES ('HP') RETURNING id INTO hp_brand_id; END IF;

    SELECT s.id INTO hp_14 FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) = 'hp 14' LIMIT 1;
    IF hp_14 IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'HP 14') RETURNING id INTO hp_14; END IF;

    SELECT s.id INTO hp_15 FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) = 'hp 15' LIMIT 1;
    IF hp_15 IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'HP 15') RETURNING id INTO hp_15; END IF;

    SELECT s.id INTO hp_elite FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%elite%' LIMIT 1;
    IF hp_elite IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'EliteBook') RETURNING id INTO hp_elite; END IF;

    SELECT s.id INTO hp_envy FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%envy%' LIMIT 1;
    IF hp_envy IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'Envy') RETURNING id INTO hp_envy; END IF;

    SELECT s.id INTO hp_g FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%g series%' LIMIT 1;
    IF hp_g IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'G Series') RETURNING id INTO hp_g; END IF;

    SELECT s.id INTO hp_notebook FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%notebook%' LIMIT 1;
    IF hp_notebook IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'Notebook') RETURNING id INTO hp_notebook; END IF;

    SELECT s.id INTO hp_omen FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%omen%' LIMIT 1;
    IF hp_omen IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'Omen') RETURNING id INTO hp_omen; END IF;

    SELECT s.id INTO hp_pav FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%pavilion%' AND lower(s.name) NOT LIKE '%gaming%' LIMIT 1;
    IF hp_pav IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'Pavilion') RETURNING id INTO hp_pav; END IF;

    SELECT s.id INTO hp_pav_gaming FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%pavilion gaming%' LIMIT 1;
    IF hp_pav_gaming IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'Pavilion Gaming') RETURNING id INTO hp_pav_gaming; END IF;

    SELECT s.id INTO hp_probook FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%probook%' LIMIT 1;
    IF hp_probook IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'ProBook') RETURNING id INTO hp_probook; END IF;

    SELECT s.id INTO hp_slate FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%slate%' LIMIT 1;
    IF hp_slate IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'SlateBook') RETURNING id INTO hp_slate; END IF;

    SELECT s.id INTO hp_spectre FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%spectre%' LIMIT 1;
    IF hp_spectre IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'Spectre') RETURNING id INTO hp_spectre; END IF;

    SELECT s.id INTO hp_stream FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%stream%' LIMIT 1;
    IF hp_stream IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'Stream') RETURNING id INTO hp_stream; END IF;

    SELECT s.id INTO hp_victus FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%victus%' LIMIT 1;
    IF hp_victus IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'Victus') RETURNING id INTO hp_victus; END IF;

    SELECT s.id INTO hp_zbook FROM series s WHERE s.brand_id = hp_brand_id AND lower(s.name) LIKE '%zbook%' LIMIT 1;
    IF hp_zbook IS NULL THEN INSERT INTO series (brand_id, name) VALUES (hp_brand_id, 'ZBook') RETURNING id INTO hp_zbook; END IF;
  END;



  -- DELL XPS MODELS (existing series)
  INSERT INTO models (series_id, name, base_price, active) VALUES
    (dell_xps, 'XPS 13 9310 (2020)', 42000, true),
    (dell_xps, 'XPS 13 9320 (2022)', 52000, true),
    (dell_xps, 'XPS 13 Plus (2022)', 58000, true),
    (dell_xps, 'XPS 15 9500 (2020)', 55000, true),
    (dell_xps, 'XPS 15 9520 (2022)', 68000, true),
    (dell_xps, 'XPS 15 9530 (2023)', 75000, true),
    (dell_xps, 'XPS 17 9700 (2020)', 85000, true),
    (dell_xps, 'XPS 17 9720 (2022)', 95000, true),
    (dell_xps, 'XPS 13 9343 (2015)', 22000, true),
    (dell_xps, 'XPS 13 9360 (2017)', 28000, true),
    (dell_xps, 'XPS 13 9370 (2018)', 32000, true),
    (dell_xps, 'XPS 15 9560 (2017)', 32000, true),
    (dell_xps, 'XPS 15 9570 (2018)', 38000, true)
  ON CONFLICT DO NOTHING;

  -- ASUS ROG MODELS (existing series)
  INSERT INTO models (series_id, name, base_price, active) VALUES
    (asus_rog, 'ROG Strix G15 (2020)', 55000, true),
    (asus_rog, 'ROG Strix G15 (2021)', 62000, true),
    (asus_rog, 'ROG Strix G15 (2022)', 72000, true),
    (asus_rog, 'ROG Strix G16 (2023)', 82000, true),
    (asus_rog, 'ROG Zephyrus G14 (2020)', 65000, true),
    (asus_rog, 'ROG Zephyrus G14 (2021)', 72000, true),
    (asus_rog, 'ROG Zephyrus G14 (2022)', 80000, true),
    (asus_rog, 'ROG Zephyrus G14 (2023)', 88000, true),
    (asus_rog, 'ROG Zephyrus M16 (2021)', 85000, true),
    (asus_rog, 'ROG Zephyrus M16 (2022)', 95000, true),
    (asus_rog, 'ROG Flow X13 (2021)', 72000, true),
    (asus_rog, 'ROG Flow X13 (2022)', 78000, true),
    (asus_rog, 'ROG Strix Scar 15 (2021)', 85000, true),
    (asus_rog, 'ROG Strix Scar 15 (2022)', 95000, true),
    (asus_rog, 'ROG Strix Scar 16 (2023)', 105000, true),
    (asus_rog, 'ROG Strix Scar 17 (2022)', 110000, true)
  ON CONFLICT DO NOTHING;

  -- HP MODELS for existing series
  INSERT INTO models (series_id, name, base_price, active) VALUES
    -- HP 14 Series
    (hp_14, 'HP 14s-dq2000 (2021)', 22000, true),
    (hp_14, 'HP 14s-fq1000 (2021)', 24000, true),
    (hp_14, 'HP 14s-dy2000 (2022)', 26000, true),
    (hp_14, 'HP 14s-fq1093AU (2021)', 23000, true),
    (hp_14, 'HP 14s-dy5000 (2023)', 28000, true),
    -- HP 15 Series
    (hp_15, 'HP 15s-du3000 (2021)', 24000, true),
    (hp_15, 'HP 15s-fq2000 (2021)', 26000, true),
    (hp_15, 'HP 15s-fy3000 (2022)', 28000, true),
    (hp_15, 'HP 15s-eq2000 (2021)', 25000, true),
    (hp_15, 'HP 15s-fy5000 (2023)', 30000, true),
    -- HP Elitebook
    (hp_elite, 'EliteBook 840 G7 (2020)', 35000, true),
    (hp_elite, 'EliteBook 840 G8 (2021)', 42000, true),
    (hp_elite, 'EliteBook 840 G9 (2022)', 48000, true),
    (hp_elite, 'EliteBook 840 G10 (2023)', 55000, true),
    (hp_elite, 'EliteBook 850 G7 (2020)', 38000, true),
    (hp_elite, 'EliteBook 850 G8 (2021)', 45000, true),
    (hp_elite, 'EliteBook 850 G9 (2022)', 52000, true),
    (hp_elite, 'EliteBook 1040 G7 (2020)', 48000, true),
    (hp_elite, 'EliteBook 1040 G8 (2021)', 55000, true),
    (hp_elite, 'EliteBook 1040 G9 (2022)', 62000, true),
    -- HP Envy
    (hp_envy, 'Envy 13-ba (2020)', 38000, true),
    (hp_envy, 'Envy 13-ba1000 (2021)', 42000, true),
    (hp_envy, 'Envy 14-eb (2021)', 45000, true),
    (hp_envy, 'Envy 15-ep (2020)', 48000, true),
    (hp_envy, 'Envy x360 13 (2021)', 40000, true),
    (hp_envy, 'Envy x360 15 (2021)', 45000, true),
    (hp_envy, 'Envy 16 (2022)', 52000, true),
    (hp_envy, 'Envy 17 (2021)', 55000, true),
    -- HP Omen
    (hp_omen, 'Omen 15-en (2020)', 52000, true),
    (hp_omen, 'Omen 15-ek (2020)', 55000, true),
    (hp_omen, 'Omen 16-b (2021)', 62000, true),
    (hp_omen, 'Omen 16-c (2021)', 65000, true),
    (hp_omen, 'Omen 17-ck (2021)', 72000, true),
    (hp_omen, 'Omen 16 (2022)', 68000, true),
    (hp_omen, 'Omen 17 (2022)', 78000, true),
    (hp_omen, 'Omen 16 (2023)', 75000, true),
    -- HP Pavillion (note: misspelled in DB)
    (hp_pav, 'Pavilion 14-dv (2021)', 28000, true),
    (hp_pav, 'Pavilion 15-eg (2021)', 30000, true),
    (hp_pav, 'Pavilion 15-eh (2021)', 32000, true),
    (hp_pav, 'Pavilion x360 14 (2021)', 32000, true),
    (hp_pav, 'Pavilion x360 15 (2021)', 35000, true),
    (hp_pav, 'Pavilion 14 (2022)', 30000, true),
    (hp_pav, 'Pavilion 15 (2022)', 33000, true),
    (hp_pav, 'Pavilion 14 (2023)', 32000, true),
    (hp_pav, 'Pavilion Plus 14 (2023)', 38000, true),
    -- HP Pavillion Gaming
    (hp_pav_gaming, 'Pavilion Gaming 15-ec (2020)', 38000, true),
    (hp_pav_gaming, 'Pavilion Gaming 15-dk (2020)', 40000, true),
    (hp_pav_gaming, 'Pavilion Gaming 16 (2021)', 45000, true),
    (hp_pav_gaming, 'Pavilion Gaming 15 (2022)', 42000, true),
    -- HP ProBook
    (hp_probook, 'ProBook 440 G7 (2020)', 28000, true),
    (hp_probook, 'ProBook 440 G8 (2021)', 32000, true),
    (hp_probook, 'ProBook 450 G8 (2021)', 35000, true),
    (hp_probook, 'ProBook 450 G9 (2022)', 38000, true),
    (hp_probook, 'ProBook 450 G10 (2023)', 42000, true),
    (hp_probook, 'ProBook 640 G8 (2021)', 38000, true),
    -- HP Spectre
    (hp_spectre, 'Spectre x360 13 (2020)', 55000, true),
    (hp_spectre, 'Spectre x360 14 (2021)', 62000, true),
    (hp_spectre, 'Spectre x360 16 (2021)', 72000, true),
    (hp_spectre, 'Spectre x360 13.5 (2022)', 65000, true),
    (hp_spectre, 'Spectre x360 16 (2022)', 78000, true),
    -- HP Victus
    (hp_victus, 'Victus 15-fa (2022)', 48000, true),
    (hp_victus, 'Victus 16-d (2021)', 52000, true),
    (hp_victus, 'Victus 16-e (2021)', 55000, true),
    (hp_victus, 'Victus 16 (2022)', 58000, true),
    (hp_victus, 'Victus 16 (2023)', 62000, true),
    -- HP ZBook
    (hp_zbook, 'ZBook Firefly 14 G7 (2020)', 55000, true),
    (hp_zbook, 'ZBook Firefly 14 G8 (2021)', 62000, true),
    (hp_zbook, 'ZBook Power G7 (2020)', 65000, true),
    (hp_zbook, 'ZBook Studio G7 (2020)', 85000, true),
    (hp_zbook, 'ZBook Fury 15 G7 (2020)', 95000, true),
    -- HP G Series
    (hp_g, 'HP 245 G7 (2019)', 18000, true),
    (hp_g, 'HP 245 G8 (2021)', 20000, true),
    (hp_g, 'HP 255 G8 (2021)', 22000, true),
    (hp_g, 'HP 250 G8 (2021)', 20000, true),
    -- HP Notebook
    (hp_notebook, 'HP Notebook 15-da (2018)', 16000, true),
    (hp_notebook, 'HP Notebook 15-db (2018)', 17000, true),
    (hp_notebook, 'HP Notebook 15-dw (2019)', 18000, true),
    -- HP Stream
    (hp_stream, 'Stream 11-ak (2019)', 10000, true),
    (hp_stream, 'Stream 14-cb (2019)', 12000, true),
    -- HP SlateBook
    (hp_slate, 'SlateBook 14-p (2014)', 8000, true)
  ON CONFLICT DO NOTHING;

  -- Create new series for other brands
  INSERT INTO series (brand_id, name) VALUES
    (lenovo_id, 'ThinkPad'),
    (lenovo_id, 'IdeaPad'),
    (lenovo_id, 'Legion'),
    (asus_id, 'VivoBook'),
    (asus_id, 'ZenBook'),
    (dell_id, 'Inspiron'),
    (dell_id, 'Latitude'),
    (samsung_id, 'Galaxy Book'),
    (samsung_id, 'Notebook'),
    (microsoft_id, 'Surface'),
    (msi_id, 'Katana'),
    (msi_id, 'Prestige'),
    (lg_id, 'Gram')
  ON CONFLICT DO NOTHING;

  -- Get new series IDs
  SELECT id INTO lenovo_thinkpad FROM series WHERE brand_id = lenovo_id AND name = 'ThinkPad';
  SELECT id INTO lenovo_ideapad FROM series WHERE brand_id = lenovo_id AND name = 'IdeaPad';
  SELECT id INTO lenovo_legion FROM series WHERE brand_id = lenovo_id AND name = 'Legion';
  SELECT id INTO asus_vivobook FROM series WHERE brand_id = asus_id AND name = 'VivoBook';
  SELECT id INTO asus_zenbook FROM series WHERE brand_id = asus_id AND name = 'ZenBook';
  SELECT id INTO dell_inspiron FROM series WHERE brand_id = dell_id AND name = 'Inspiron';
  SELECT id INTO dell_latitude FROM series WHERE brand_id = dell_id AND name = 'Latitude';
  SELECT id INTO samsung_galaxy FROM series WHERE brand_id = samsung_id AND name = 'Galaxy Book';
  SELECT id INTO samsung_notebook FROM series WHERE brand_id = samsung_id AND name = 'Notebook';
  SELECT id INTO microsoft_surface FROM series WHERE brand_id = microsoft_id AND name = 'Surface';
  SELECT id INTO msi_katana FROM series WHERE brand_id = msi_id AND name = 'Katana';
  SELECT id INTO msi_prestige FROM series WHERE brand_id = msi_id AND name = 'Prestige';
  SELECT id INTO lg_gram FROM series WHERE brand_id = lg_id AND name = 'Gram';

  -- LENOVO MODELS
  IF lenovo_thinkpad IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (lenovo_thinkpad, 'ThinkPad E14 Gen 2 (2020)', 28000, true),
      (lenovo_thinkpad, 'ThinkPad E14 Gen 3 (2021)', 32000, true),
      (lenovo_thinkpad, 'ThinkPad E14 Gen 4 (2022)', 35000, true),
      (lenovo_thinkpad, 'ThinkPad E15 Gen 2 (2020)', 30000, true),
      (lenovo_thinkpad, 'ThinkPad E15 Gen 3 (2021)', 34000, true),
      (lenovo_thinkpad, 'ThinkPad T14 Gen 1 (2020)', 38000, true),
      (lenovo_thinkpad, 'ThinkPad T14 Gen 2 (2021)', 42000, true),
      (lenovo_thinkpad, 'ThinkPad T14 Gen 3 (2022)', 48000, true),
      (lenovo_thinkpad, 'ThinkPad T14s Gen 2 (2021)', 45000, true),
      (lenovo_thinkpad, 'ThinkPad X1 Carbon Gen 8 (2020)', 55000, true),
      (lenovo_thinkpad, 'ThinkPad X1 Carbon Gen 9 (2021)', 65000, true),
      (lenovo_thinkpad, 'ThinkPad X1 Carbon Gen 10 (2022)', 75000, true),
      (lenovo_thinkpad, 'ThinkPad X1 Carbon Gen 11 (2023)', 85000, true),
      (lenovo_thinkpad, 'ThinkPad X13 Gen 2 (2021)', 42000, true),
      (lenovo_thinkpad, 'ThinkPad P14s Gen 2 (2021)', 48000, true),
      (lenovo_thinkpad, 'ThinkPad L14 Gen 2 (2021)', 32000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF lenovo_ideapad IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (lenovo_ideapad, 'IdeaPad 3 14" (2020)', 18000, true),
      (lenovo_ideapad, 'IdeaPad 3 15" (2020)', 20000, true),
      (lenovo_ideapad, 'IdeaPad 3 14" (2021)', 20000, true),
      (lenovo_ideapad, 'IdeaPad 3 15" (2021)', 22000, true),
      (lenovo_ideapad, 'IdeaPad 5 14" (2020)', 28000, true),
      (lenovo_ideapad, 'IdeaPad 5 15" (2020)', 32000, true),
      (lenovo_ideapad, 'IdeaPad 5 Pro 14" (2021)', 38000, true),
      (lenovo_ideapad, 'IdeaPad 5 Pro 16" (2021)', 42000, true),
      (lenovo_ideapad, 'IdeaPad Slim 5 (2022)', 35000, true),
      (lenovo_ideapad, 'IdeaPad Flex 5 (2021)', 32000, true),
      (lenovo_ideapad, 'IdeaPad Gaming 3 (2021)', 42000, true),
      (lenovo_ideapad, 'IdeaPad Gaming 3 (2022)', 45000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF lenovo_legion IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (lenovo_legion, 'Legion 5 15" (2020)', 48000, true),
      (lenovo_legion, 'Legion 5 15" (2021)', 55000, true),
      (lenovo_legion, 'Legion 5 15" (2022)', 62000, true),
      (lenovo_legion, 'Legion 5 Pro (2021)', 68000, true),
      (lenovo_legion, 'Legion 5 Pro (2022)', 75000, true),
      (lenovo_legion, 'Legion 7 (2021)', 85000, true),
      (lenovo_legion, 'Legion 7 (2022)', 95000, true),
      (lenovo_legion, 'Legion Slim 7 (2022)', 88000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- ASUS MODELS
  IF asus_vivobook IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (asus_vivobook, 'VivoBook 14 X412 (2019)', 20000, true),
      (asus_vivobook, 'VivoBook 15 X512 (2019)', 22000, true),
      (asus_vivobook, 'VivoBook 14 X415 (2020)', 22000, true),
      (asus_vivobook, 'VivoBook 15 X515 (2020)', 24000, true),
      (asus_vivobook, 'VivoBook 14 M415 (2021)', 24000, true),
      (asus_vivobook, 'VivoBook 15 OLED (2021)', 32000, true),
      (asus_vivobook, 'VivoBook 15 OLED (2022)', 35000, true),
      (asus_vivobook, 'VivoBook Pro 15 (2021)', 38000, true),
      (asus_vivobook, 'VivoBook S14 (2021)', 32000, true),
      (asus_vivobook, 'VivoBook S15 (2021)', 35000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF asus_zenbook IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (asus_zenbook, 'ZenBook 13 UX325 (2020)', 42000, true),
      (asus_zenbook, 'ZenBook 14 UX425 (2020)', 45000, true),
      (asus_zenbook, 'ZenBook 14 UX434 (2019)', 42000, true),
      (asus_zenbook, 'ZenBook 14 OLED (2021)', 52000, true),
      (asus_zenbook, 'ZenBook 14 OLED (2022)', 58000, true),
      (asus_zenbook, 'ZenBook 14 OLED (2023)', 65000, true),
      (asus_zenbook, 'ZenBook 14X OLED (2022)', 68000, true),
      (asus_zenbook, 'ZenBook Duo 14 (2021)', 65000, true),
      (asus_zenbook, 'ZenBook Pro 15 (2020)', 72000, true),
      (asus_zenbook, 'ZenBook Flip 13 (2021)', 58000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- DELL MODELS
  IF dell_inspiron IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (dell_inspiron, 'Inspiron 14 3000 (2020)', 18000, true),
      (dell_inspiron, 'Inspiron 15 3000 (2020)', 20000, true),
      (dell_inspiron, 'Inspiron 14 5000 (2021)', 25000, true),
      (dell_inspiron, 'Inspiron 15 5000 (2021)', 28000, true),
      (dell_inspiron, 'Inspiron 14 5000 (2022)', 28000, true),
      (dell_inspiron, 'Inspiron 15 5000 (2022)', 32000, true),
      (dell_inspiron, 'Inspiron 15 7000 (2021)', 38000, true),
      (dell_inspiron, 'Inspiron 16 Plus (2021)', 45000, true),
      (dell_inspiron, 'Inspiron 16 Plus (2022)', 48000, true),
      (dell_inspiron, 'Inspiron 14 Plus (2022)', 42000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF dell_latitude IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (dell_latitude, 'Latitude 3410 (2020)', 22000, true),
      (dell_latitude, 'Latitude 3420 (2021)', 25000, true),
      (dell_latitude, 'Latitude 3520 (2021)', 28000, true),
      (dell_latitude, 'Latitude 5410 (2020)', 28000, true),
      (dell_latitude, 'Latitude 5420 (2021)', 32000, true),
      (dell_latitude, 'Latitude 5520 (2021)', 35000, true),
      (dell_latitude, 'Latitude 7410 (2020)', 35000, true),
      (dell_latitude, 'Latitude 7420 (2021)', 42000, true),
      (dell_latitude, 'Latitude 7520 (2021)', 45000, true),
      (dell_latitude, 'Latitude 9420 (2021)', 65000, true),
      (dell_latitude, 'Latitude 9520 (2021)', 72000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- SAMSUNG MODELS
  IF samsung_galaxy IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (samsung_galaxy, 'Galaxy Book Pro (2021)', 58000, true),
      (samsung_galaxy, 'Galaxy Book Pro 360 (2021)', 65000, true),
      (samsung_galaxy, 'Galaxy Book2 Pro (2022)', 62000, true),
      (samsung_galaxy, 'Galaxy Book2 Pro 360 (2022)', 68000, true),
      (samsung_galaxy, 'Galaxy Book2 (2022)', 48000, true),
      (samsung_galaxy, 'Galaxy Book3 Pro (2023)', 72000, true),
      (samsung_galaxy, 'Galaxy Book3 (2023)', 52000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF samsung_notebook IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (samsung_notebook, 'Notebook 9 Pro (2018)', 35000, true),
      (samsung_notebook, 'Notebook Flash (2018)', 18000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- MICROSOFT MODELS
  IF microsoft_surface IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (microsoft_surface, 'Surface Laptop 3 (2019)', 42000, true),
      (microsoft_surface, 'Surface Laptop 4 (2021)', 52000, true),
      (microsoft_surface, 'Surface Laptop 5 (2022)', 62000, true),
      (microsoft_surface, 'Surface Laptop Go (2020)', 35000, true),
      (microsoft_surface, 'Surface Laptop Go 2 (2022)', 42000, true),
      (microsoft_surface, 'Surface Pro 7 (2019)', 38000, true),
      (microsoft_surface, 'Surface Pro 8 (2021)', 52000, true),
      (microsoft_surface, 'Surface Pro 9 (2022)', 58000, true),
      (microsoft_surface, 'Surface Book 3 (2020)', 75000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- MSI MODELS
  IF msi_katana IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (msi_katana, 'Katana GF66 (2021)', 52000, true),
      (msi_katana, 'Katana GF76 (2021)', 58000, true),
      (msi_katana, 'Katana 15 (2022)', 55000, true),
      (msi_katana, 'Katana 17 (2022)', 62000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  IF msi_prestige IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (msi_prestige, 'Prestige 14 (2020)', 55000, true),
      (msi_prestige, 'Prestige 14 Evo (2021)', 62000, true),
      (msi_prestige, 'Prestige 15 (2020)', 62000, true),
      (msi_prestige, 'Prestige 15 (2021)', 68000, true)
    ON CONFLICT DO NOTHING;
  END IF;

  -- LG MODELS
  IF lg_gram IS NOT NULL THEN
    INSERT INTO models (series_id, name, base_price, active) VALUES
      (lg_gram, 'Gram 14 (2020)', 48000, true),
      (lg_gram, 'Gram 14 (2021)', 52000, true),
      (lg_gram, 'Gram 14 (2022)', 58000, true),
      (lg_gram, 'Gram 15 (2020)', 52000, true),
      (lg_gram, 'Gram 15 (2021)', 58000, true),
      (lg_gram, 'Gram 16 (2021)', 62000, true),
      (lg_gram, 'Gram 16 (2022)', 68000, true),
      (lg_gram, 'Gram 17 (2020)', 65000, true),
      (lg_gram, 'Gram 17 (2021)', 72000, true)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;