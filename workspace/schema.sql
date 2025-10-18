-- Run these queries in your 'ContractorBabuDB' database to create the necessary tables.

-- Create the Clients table
CREATE TABLE Clients (
  id NVARCHAR(50) PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  email NVARCHAR(255) NOT NULL UNIQUE,
  phone NVARCHAR(50),
  company NVARCHAR(255),
  avatarUrl NVARCHAR(MAX),
  status NVARCHAR(20) CHECK (status IN ('Active', 'Inactive'))
);
GO

-- Create the Projects table
-- NOTE: For simplicity, 'tasks' and 'updates' are stored as JSON strings.
-- In a more complex production environment, these would likely be their own tables.
CREATE TABLE Projects (
    id NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    startDate DATE,
    deadline DATE,
    cost FLOAT,
    status NVARCHAR(50),
    clientId NVARCHAR(50) FOREIGN KEY REFERENCES Clients(id),
    imageUrl NVARCHAR(MAX),
    tasks NVARCHAR(MAX) DEFAULT '[]',
    updates NVARCHAR(MAX) DEFAULT '[]',
    contractorIds NVARCHAR(MAX) DEFAULT '[]'
);
GO

-- Optional: You can uncomment and run the following statements to seed your database with initial data.
/*
-- Seed Clients
INSERT INTO Clients (id, name, email, phone, company, avatarUrl, status) VALUES
('cl1', 'Acme Corporation', 'contact@acme.com', '555-1234', 'Acme Corp', 'https://picsum.photos/seed/acme/100/100', 'Active'),
('cl2', 'Stark Industries', 'pepper@stark.com', '555-5678', 'Stark Ind.', 'https://picsum.photos/seed/stark/100/100', 'Active'),
('cl3', 'Wayne Enterprises', 'lucius@wayne.com', '555-9012', 'Wayne Ent.', 'https://picsum.photos/seed/wayne/100/100', 'Inactive');
GO

-- Seed Projects
INSERT INTO Projects (id, name, description, startDate, deadline, cost, status, clientId, imageUrl, tasks, updates, contractorIds) VALUES
(
    'p1',
    'Corporate Website Redesign',
    'A complete overhaul of the corporate website to improve user experience and modernize the design.',
    '2024-05-01',
    '2024-08-31',
    500000,
    'In Progress',
    'cl1',
    'https://picsum.photos/seed/project1/600/400',
    '[{"id":"t1-1","title":"Initial Design Mockups","description":"Create wireframes and high-fidelity mockups.","status":"Done"},{"id":"t1-2","title":"Frontend Development","description":"Implement the new design using React.","status":"In Progress"},{"id":"t1-3","title":"Backend API Integration","description":"Connect the frontend to the CMS.","status":"To-do"}]',
    '[{"id":"u1-1","date":"2024-07-20T10:00:00Z","author":"Rohan Verma","authorAvatar":"https://picsum.photos/seed/avatar2/100/100","content":"This week, I focused on building out the main components for the homepage...","summary":"Completed homepage components..."}]',
    '[]'
),
(
    'p2',
    'Mobile App Development',
    'A new cross-platform mobile application for task management.',
    '2024-06-15',
    '2024-12-15',
    1200000,
    'In Progress',
    'cl2',
    'https://picsum.photos/seed/project2/600/400',
    '[{"id":"t2-1","title":"Setup CI/CD Pipeline","description":"Configure automated build and deployment.","status":"Done"},{"id":"t2-2","title":"Implement User Authentication","description":"Build login and registration screens.","status":"In Progress"}]',
    '[]',
    '[]'
),
(
    'p3',
    'E-commerce Platform',
    'Building a scalable e-commerce platform with advanced features.',
    '2024-07-01',
    '2025-01-31',
    2500000,
    'Not Started',
    'cl1',
    'https://picsum.photos/seed/project3/600/400',
    '[]',
    '[]',
    '[]'
),
(
    'p4',
    'Internal CRM Tool',
    'An internal tool for customer relationship management.',
    '2024-03-01',
    '2024-07-30',
    800000,
    'Completed',
    'cl3',
    'https://picsum.photos/seed/project4/600/400',
    '[]',
    '[]',
    '[]'
);
GO
*/
