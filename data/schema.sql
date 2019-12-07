DROP TABLE IF EXISTS asteroid;

CREATE TABLE asteroid (
    id SERIAL PRIMARY KEY,
    name text,
    date text,
    link text,
    meters text,
    feet text,
    hazardous boolean,
    kmh text,
    mph text,
    miss_au text,
    miss_km text,
    miss_mi text
);
INSERT INTO asteroid (name, date, link, meters, feet, hazardous, kmh, mph) VALUES ('asteroid_name','asteroid_date', 'asteroid_link', 'asteroid_meters', 'asteroid_feet', true, 'asteroid_kmh', 'asteroid_mi','miss_au','miss_km','miss_mi');