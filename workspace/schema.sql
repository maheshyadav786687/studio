-- Run these queries in your 'ContractorBabuDB' database to create the necessary tables.

-- Create the Clients table
CREATE TABLE Clients (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
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
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    startDate DATE,
    deadline DATE,
    cost FLOAT,
    status NVARCHAR(50),
    clientId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Clients(id),
    imageUrl NVARCHAR(MAX),
    tasks NVARCHAR(MAX) DEFAULT '[]',
    updates NVARCHAR(MAX) DEFAULT '[]',
    contractorIds NVARCHAR(MAX) DEFAULT '[]'
);
GO

-- Create the Sites table
CREATE TABLE Sites (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  name NVARCHAR(255) NOT NULL,
  address NVARCHAR(MAX) NOT NULL,
  clientId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Clients(id)
);
GO