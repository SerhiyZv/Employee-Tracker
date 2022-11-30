USE employee_trackerDB;

INSERT INTO department (name)
VALUES ('Engineering'), ('Finance'), ('Legal'), ('Sales'), ('Service');

INSERT INTO role (title, salary, department_id)
VALUES ("Manager Engineer", 222000, 1),
    ("Engineer", 194000, 1),
    ("Software Engineer", 199000, 1),
    ("Account Manager", 112000, 2),
    ("Accountant", 92000, 2),
    ("Legal Team Lead", 140000, 3),
    ("Lawyer", 100000, 3),
    ("Sales Manager", 240000, 4),
    ("Sales Engineer", 202000, 4),
    ("Custome service Manager", 140000, 5),
    ("Custome service", 99000, 5);
    
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gale", "Kubatzke", 1, null),
    ("Athena", "Durga", 2, 1),
    ("Philemon", "Berthold", 3, 1),
    ("Nitin", "Kibwe", 4, null),
    ("Houston", "Hippocrates", 5, 4),
    ("Štefan", "Ľuboš", 6, null),
    ("Ismaeel", "Leopold", 7, 6),
    ("Ladislaus", "Lars", 8, null),
    ("Terra", "Viktorija", 9, 8),
    ("Milada", "Tihana", 10, null),
    ("Hugo", "Angeliki", 11, 10);
