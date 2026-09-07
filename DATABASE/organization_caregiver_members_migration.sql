-- Run this migration if organization_members already exists.
-- Supports organizational leadership, admin staff, nursing/clinical roles, and patient/caregiver assignments.

ALTER TABLE users
    MODIFY role ENUM(
        'Admin',
        'System Admin',
        'Medical Director',
        'Nursing Director',
        'Executive Assistant',
        'Office Admin',
        'Nurse',
        'Caregiver',
        'Patient',
        'Organization'
    ) NOT NULL;

ALTER TABLE patients
    ADD COLUMN IF NOT EXISTS organization_id INT NULL AFTER user_id,
    ADD COLUMN IF NOT EXISTS medical_notes_public TINYINT(1) NOT NULL DEFAULT 0 AFTER medical_notes;

ALTER TABLE organization_members
    MODIFY member_role ENUM(
        'Owner',
        'Admin',
        'System Admin',
        'Medical Director',
        'Nursing Director',
        'Executive Assistant',
        'Office Admin',
        'Nurse',
        'Caregiver',
        'Patient',
        'Member',
        'Vendor',
        'Contact'
    ) NOT NULL DEFAULT 'Member';

UPDATE organization_members
SET member_role = 'Member'
WHERE member_role = 'Contact';

INSERT INTO organization_members (organization_id, user_id, member_role, status)
SELECT c.organization_id, c.user_id, 'Caregiver', 'Active'
FROM caregivers c
INNER JOIN users u ON u.id = c.user_id
WHERE c.organization_id IS NOT NULL
  AND u.role = 'Caregiver'
  AND NOT EXISTS (
      SELECT 1
      FROM organization_members members
      WHERE members.organization_id = c.organization_id
        AND members.user_id = c.user_id
  );
