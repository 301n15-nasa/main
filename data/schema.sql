DROP TABLE IF EXISTS asteroid;

CREATE TABLE asteroid (
    id SERIAL PRIMARY KEY,
    date text,
    link text,
    meters text,
    feet text,
    hazardous boolean,
    kmh text,
    mph text
);
INSERT INTO asteroid (date, link, meters, feet, hazardous, kmh, mph) VALUES ('qwe', '12', '123', 'asd', true, 'dsa', 'we');