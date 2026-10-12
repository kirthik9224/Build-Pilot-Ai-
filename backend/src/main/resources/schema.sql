-- Organization: Orbytes Global Solutions, Owner: Kirthik, Created at: 2026-10-11
-- Description: MySQL Database Schema for BuildPilot AI Pro

CREATE TABLE IF NOT EXISTS users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(80)  NOT NULL,
    email         VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(40)  NOT NULL DEFAULT 'DEVELOPER',
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(120) NOT NULL,
    description VARCHAR(500),
    owner_id    BIGINT       NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issues (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id  BIGINT,
    title       VARCHAR(160)  NOT NULL,
    category    VARCHAR(40)   NOT NULL,
    severity    VARCHAR(20)   NOT NULL,
    file_name   VARCHAR(80)   NOT NULL,
    root_cause  VARCHAR(400)  NOT NULL,
    impact      VARCHAR(400)  NOT NULL,
    status      VARCHAR(20)   NOT NULL DEFAULT 'OPEN',
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
    setting_key   VARCHAR(60) PRIMARY KEY,
    setting_value VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS help_articles (
    id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    topic    VARCHAR(40)  NOT NULL,
    question VARCHAR(160) NOT NULL,
    answer   VARCHAR(800) NOT NULL
);
