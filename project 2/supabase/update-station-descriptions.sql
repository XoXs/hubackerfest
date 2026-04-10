update public.stations as stations
set description = descriptions.description
from (
  values
    ('getraenkeausschank', 'Ausgabe von alkoholfreien Getränken und Organisation am Ausschank.'),
    ('kuchenzelt', 'Verkauf und Ausgabe von Kuchen und Kaffee.'),
    ('kuechenzelt', 'Zubereitung und Ausgabe der Speisen.'),
    ('springer', 'Flexible Unterstützung an wechselnden Stationen und an der Hüpfburg.'),
    ('spuelzelt', 'Reinigung von Geschirr, Besteck und Küchenutensilien.'),
    ('abbau', 'Abbau der Festinfrastruktur und gemeinsames Aufräumen nach dem Fest.'),
    ('ausschankwagen1', 'Bier- und Getränkeausgabe am ersten Ausschankwagen.'),
    ('ausschankwagen2', 'Bier- und Getränkeausgabe am zweiten Ausschankwagen.'),
    ('elektrik', 'Betreuung der Stromversorgung und technische Unterstützung.'),
    ('wasser', 'Versorgung der Stationen mit Wasser und Kontrolle der Anschlüsse.'),
    ('aufraeumen', 'Aufräumen des Festgeländes und Abschlussarbeiten am Abend.'),
    ('aufbau', 'Aufbau der Festinfrastruktur'),
    ('nachtwache', 'Überwachung des Festgeländes')
) as descriptions(id, description)
where stations.id = descriptions.id;
