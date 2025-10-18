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


-- Create the Sites table
CREATE TABLE Sites (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  name NVARCHAR(255) NOT NULL,
  address NVARCHAR(MAX) NOT NULL,
  clientId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Clients(id)
);


-- Create the Quotations table
CREATE TABLE Quotations (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  quotationNumber NVARCHAR(255) NOT NULL,
  quotationDate DATE NOT NULL,
  title NVARCHAR(255) NOT NULL,
  status NVARCHAR(50) CHECK (status IN ('Draft', 'Sent', 'Approved', 'Rejected')),
  siteId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Sites(id)
);


-- Create the QuotationItems table
CREATE TABLE QuotationItems (
  id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  quotationId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES Quotations(id),
  description NVARCHAR(MAX) NOT NULL,
  quantity FLOAT NOT NULL,
  unit NVARCHAR(50) NOT NULL,
  rate FLOAT NOT NULL,
  amount FLOAT NOT NULL,
  area FLOAT,
  material BIT NOT NULL
);
