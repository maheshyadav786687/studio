
CREATE TABLE Statuses (
    Id TEXT PRIMARY KEY,
    Type TEXT NOT NULL,
    Name TEXT NOT NULL,
    Color TEXT,
    IsActive INTEGER DEFAULT 1,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT
);

CREATE TABLE Roles (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Permissions TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT
);

CREATE TABLE Plans (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    Price REAL NOT NULL,
    ProjectsLimit INTEGER,
    UsersLimit INTEGER,
    Features TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT
);

CREATE TABLE Companies (
    Id TEXT PRIMARY KEY,
    Name TEXT NOT NULL,
    GstNumber TEXT,
    Address TEXT,
    PlanId TEXT,
    StatusId TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT,
    FOREIGN KEY (PlanId) REFERENCES Plans(Id),
    FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
);

CREATE TABLE Users (
    Id TEXT PRIMARY KEY,
    CompanyId TEXT NOT NULL,
    Name TEXT NOT NULL,
    Email TEXT NOT NULL UNIQUE,
    Password TEXT NOT NULL,
    RoleId TEXT,
    StatusId TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (RoleId) REFERENCES Roles(Id),
    FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
);

CREATE TABLE ActivityLogs (
    Id TEXT PRIMARY KEY,
    CompanyId TEXT NOT NULL,
    UserId TEXT,
    Module TEXT NOT NULL,
    Action TEXT NOT NULL,
    RecordId TEXT,
    Changes TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

CREATE TABLE Units (
    Id TEXT PRIMARY KEY,
    CompanyId TEXT NOT NULL,
    Name TEXT NOT NULL,
    ShortCode TEXT NOT NULL,
    StatusId TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
);

CREATE TABLE Clients (
    Id TEXT PRIMARY KEY,
    CompanyId TEXT NOT NULL,
    Name TEXT NOT NULL,
    ContactPerson TEXT,
    Phone TEXT,
    Email TEXT,
    Address TEXT,
    StatusId TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
);

CREATE TABLE Sites (
    Id TEXT PRIMARY KEY,
    CompanyId TEXT NOT NULL,
    ClientId TEXT NOT NULL,
    Name TEXT NOT NULL,
    Location TEXT,
    StatusId TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (ClientId) REFERENCES Clients(Id),
    FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
);

CREATE TABLE Projects (
    Id TEXT PRIMARY KEY,
    CompanyId TEXT NOT NULL,
    ClientId TEXT,
    SiteId TEXT,
    Name TEXT NOT NULL,
    Description TEXT,
    StartDate TEXT,
    EndDate TEXT,
    StatusId TEXT,
    CreatedBy TEXT,
    CreatedOn TEXT DEFAULT CURRENT_TIMESTAMP,
    ModifiedBy TEXT,
    ModifiedOn TEXT,
    FOREIGN KEY (CompanyId) REFERENCES Companies(Id),
    FOREIGN KEY (ClientId) REFERENCES Clients(Id),
    FOREIGN KEY (SiteId) REFERENCES Sites(Id),
    FOREIGN KEY (StatusId) REFERENCES Statuses(Id)
);
