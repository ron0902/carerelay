ALTER TABLE caregivers
    ADD COLUMN IF NOT EXISTS license_expiration_date DATE NULL AFTER license_number,
    ADD COLUMN IF NOT EXISTS certifications TEXT NULL AFTER specialization;

CREATE TABLE IF NOT EXISTS skill_sets (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_skill_sets_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS caregiver_skill_sets (
    caregiver_id INT NOT NULL,
    skill_set_id INT NOT NULL,
    PRIMARY KEY (caregiver_id, skill_set_id),
    CONSTRAINT fk_caregiver_skill_sets_caregiver FOREIGN KEY (caregiver_id) REFERENCES caregivers(id) ON DELETE CASCADE,
    CONSTRAINT fk_caregiver_skill_sets_skill FOREIGN KEY (skill_set_id) REFERENCES skill_sets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
