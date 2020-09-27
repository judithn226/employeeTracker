USE employee_db;

INSERT INTO department
    (id, eName)
VALUES
    (1, "Community Relations"),
    (2, "Management"),
    (3, "HR"),
    (4, "IT");

INSERT INTO role
    (id, title, salary, department_id)
VALUES
    (1, "CEO", 1300000, 1),
    (2, "Product manager", 95000, 1),
    (3, "Senior Engineer", 80000, 2),
    (4, "Junior Engineer", 75000, 2),
    (5, "Sales Lead", 70000, 3),
    (6, "Creative Director", 82000, 4),
    (7, "Social Media Manager", 60000, 4),
    (8, "Chief Quality Officer", 90000, 1);

INSERT INTO employee
    ( id, first_name, last_name, role_id)
VALUES
    (1, "Natalie", "Ramsey", 1),
    (2, "John", "Wick", 2),
    (3, "Gloria", "George", 3),
    (4, "Kimya", "Tyson", 4),
    (5, "Stan", "Smith", 5),
    (6, "Andre", "Igoudala", 6),
    (7, "Tamera", "Campbell", 7),
    (8, "Theodore", "Fredrick", 8);
