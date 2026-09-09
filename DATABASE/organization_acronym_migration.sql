-- Run once after organization_separation_migration.sql.
-- Adds a unique human-readable organization acronym.

ALTER TABLE organizations
    ADD COLUMN IF NOT EXISTS organization_code VARCHAR(30) NULL AFTER id;

UPDATE organizations
SET organization_code = UPPER(
    CONCAT(
        CASE
            WHEN organization_name NOT LIKE '% %' THEN LEFT(TRIM(organization_name), 4)
            ELSE LEFT(SUBSTRING_INDEX(TRIM(organization_name), ' ', 1), 1)
        END,
        CASE
            WHEN organization_name LIKE '% %' THEN LEFT(SUBSTRING_INDEX(SUBSTRING_INDEX(TRIM(organization_name), ' ', 2), ' ', -1), 1)
            ELSE ''
        END,
        CASE
            WHEN organization_name LIKE '% % %' THEN LEFT(SUBSTRING_INDEX(SUBSTRING_INDEX(TRIM(organization_name), ' ', 3), ' ', -1), 1)
            ELSE ''
        END
    )
)
WHERE organization_code IS NULL OR organization_code = '';

UPDATE organizations
SET organization_code = CONCAT(organization_code, '-', id)
WHERE organization_code IN (
    SELECT duplicate_code
    FROM (
        SELECT organization_code AS duplicate_code
        FROM organizations
        GROUP BY organization_code
        HAVING COUNT(*) > 1
    ) duplicates
);

CREATE UNIQUE INDEX uq_organization_code ON organizations (organization_code);
