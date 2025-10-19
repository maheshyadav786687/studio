
-- Statuses
INSERT INTO Statuses (Id, Type, Name, Color) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'General', 'Active', '#28a745'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'General', 'Inactive', '#dc3545'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Project', 'Not Started', '#6c757d'),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', 'Project', 'In Progress', '#17a2b8'),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', 'Project', 'Completed', '#28a745'),
('f6a7b8c9-d0e1-2345-6789-0abcdef01234', 'Project', 'On Hold', '#ffc107'),
('a7b8c9d0-e1f2-3456-7890-1abcdef012345', 'Quotation', 'Draft', '#6c757d'),
('b8c9d0e1-f2a3-4567-8901-bcdef0123456', 'Quotation', 'Sent', '#17a2b8'),
('c9d0e1f2-a3b4-5678-9012-cdef01234567', 'Quotation', 'Accepted', '#28a745'),
('d0e1f2a3-b4c5-6789-0123-def012345678', 'Quotation', 'Rejected', '#dc3545');

-- Roles
INSERT INTO Roles (Id, Name, Permissions) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Admin', '{"users": {"create": true, "read": true, "update": true, "delete": true}, "projects": {"create": true, "read": true, "update": true, "delete": true}, "clients": {"create": true, "read": true, "update": true, "delete": true}, "quotations": {"create": true, "read": true, "update": true, "delete": true}}'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'Project Manager', '{"projects": {"create": true, "read": true, "update": true, "delete": false}, "clients": {"read": true}, "quotations": {"read": true}}'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Team Member', '{"projects": {"read": true}, "clients": {"read": true}, "quotations": {"read": true}}');

-- Plans
INSERT INTO Plans (Id, Name, Price, ProjectsLimit, UsersLimit, Features) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'Basic', 29.99, 5, 10, 'Basic features'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', 'Pro', 59.99, 50, 50, 'Pro features'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', 'Enterprise', 99.99, -1, -1, 'Enterprise features');

-- Units
INSERT INTO Units (Id, CompanyId, Name, ShortCode) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', '00000000-0000-0000-0000-000000000000', 'Square Meter', 'sqm'),
('b2c3d4e5-f6a7-8901-2345-67890abcdef0', '00000000-0000-0000-0000-000000000000', 'Linear Meter', 'm'),
('c3d4e5f6-a7b8-9012-3456-7890abcdef01', '00000000-0000-0000-0000-000000000000', 'Numbers', 'nos'),
('d4e5f6a7-b8c9-0123-4567-890abcdef012', '00000000-0000-0000-0000-000000000000', 'Kilogram', 'kg'),
('e5f6a7b8-c9d0-1234-5678-90abcdef0123', '00000000-0000-0000-0000-000000000000', 'Litre', 'ltr');
