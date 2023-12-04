DROP TABLE IF EXISTS country;
DROP TABLE IF EXISTS avatar;
DROP TABLE IF EXISTS profile;

CREATE TABLE IF NOT EXISTS country (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    country_code INTEGER NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO country (name, country_code) VALUES
('United States', 1),
('United Kingdom', 44),
('Australia', 61),
('Germany', 49),
('France', 33),
('Japan', 81),
('Brazil', 55),
('India', 91),
('China', 86),
('South Africa', 27),
('Mexico', 52),
('Russia', 7),
('Italy', 39),
('Spain', 34),
('Argentina', 54),
('Nigeria', 234),
('Sweden', 46),
('Turkey', 90),
('South Korea', 82);


Create table avatar (
    id INTEGER PRIMARY KEY,
    system_user_id INTEGER NOT NULL,
    image TEXT NOT NULL,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Create table profile (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    introduction TEXT,
    social_account_urls JSON,
    country_location_id INTERGER,
    -- birthday DATE,
    email JSON,
    mobile JSON,
    created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO profile (user_id, user_name, introduction, mobile, country_location_id) VALUES (
  'arc_buwei',
  '🔥Buwei廖',
  "I'm a full-stack developer, blockchain enthusiast, and a lifelong learner. Also, I'm hamburger master, able to make delicious 🍔🍔🍔!",
  '{
    "country_code": 49,
    "phone_number": "01785727202"
  }',
  49
)