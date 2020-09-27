DROP DATABASE IF EXISTS employee_DB;
CREATE database employee_DB;

USE employee_DB;

CREATE TABLE department
(
    id INT NOT NULL
    AUTO_INCREMENT,
Ename VARCHAR
    (20) NOT NULL,
PRIMARY KEY
    (id)
);


    CREATE TABLE role
    (
        id INT NOT NULL
        AUTO_INCREMENT,
    TITLE VARCHAR
        (20) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    PRIMARY KEY
        (id)
);

        CREATE TABLE employee
        (
            id INT NOT NULL
            AUTO_INCREMENT,
    first_name VARCHAR
            (20) NOT NULL,
    last_name VARCHAR
            (20) NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY
            (id)
);

