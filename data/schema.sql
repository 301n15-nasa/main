DROP TABLE IF EXISTS asteroid;

CREATE TABLE asteroid (
    id SERIAL PRIMARY KEY,
    date_to_earth text,
    nasa_jpl_url text,
    estimated_diameter_meters text,
    estimated_diameter_feet text,
    is_potentially_hazardous_asteroid boolean,
    close_approach_date text,
    relative_velocity_kmh text,
    relative_velocity_mph text
);

INSERT INTO asteroid (date_to_earth, nasa_jpl_url, estimated_diameter_meters, estimated_diameter_feet, is_potentially_hazardous_asteroid, close_approach_date, relative_velocity_kmh, relative_velocity_mph) VALUES('2019-12-04', 'https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=3893864;old=0;orb=1;cov=0;log=0;cad=0#orb', '33.4996275663', '109.90', false, '2019-12-04', '20154.84', '12523.43');