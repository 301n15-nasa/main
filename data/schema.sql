DROP TABLE IF EXISTS asteroid;

CREATE TABLE asteroid (
    id SERIAL PRIMARY KEY,
    date_to_earth DATE,
    nasa_jpl_url text,
    estimated_diameter_min bigint,
    is_potentially_hazardous_asteroid boolean,
    close_approach_date date,
    relative_velocity bigint,
    orbiting_body text
);