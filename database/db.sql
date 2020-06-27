CREATE DATABASE db_abc;

USE db_abc;

-- Tabla de usuario. La encriptación de la contraseña usa SHA256
CREATE TABLE user (
  user_id VARCHAR(32) NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  name VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  birth_date DATETIME NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(64) NOT NULL,
  PRIMARY KEY (user_id)
);

DESCRIBE user;

SELECT * FROM user;

-- Tabla de transacciones
CREATE TABLE transaction (
  transaction_id INT(11) NOT NULL AUTO_INCREMENT,
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  value FLOAT NOT NULL,
  points INT(11) NOT NULL,
  status INT(1) NOT NULL,
  user_id VARCHAR(32),
  CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES user(user_id),
  PRIMARY KEY (transaction_id)
);

DESCRIBE transaction;