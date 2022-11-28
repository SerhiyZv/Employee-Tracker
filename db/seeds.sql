USE employee_trackerDB;

INSERT INTO department (name)
VALUES ('Engineering'), ('Sales'), ('Finance'), ('Marketing'), ('Logistic');

INSERT INTO role (title, salary, department_id)
VALUES ("Manager Engineer", 222000, 1),
    ("Engineer", 194000, 1),
    ("Software Engineer", 199000, 1),
    ("Sales Manager", 240000, 2),
    ("Sales Engineer", 202000, 2),
    ("Accountant", 92000, 3),
    ("Marketing Manager", 140000, 4),
    ("Marketing Coordinator", 110000, 4),
    ("Logistic Manager", 132000, 5),
    ("Logistic Superviser", 111000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Gale", "Kubatzke", 1, null),
    ("Athena", "Durga", 2, 1),
    ("Philemon", "Berthold", 3, 1),
    ("Nitin", "Kibwe", 4, null),
    ("Houston", "Hippocrates", 5, 4),
    ("Štefan", "Ľuboš", 6, null),
    ("Ismaeel", "Leopold", 7, null),
    ("Ladislaus", "Lars", 8, 7),
    ("Terra", "Viktorija", 9, null),
    ("Milada", "Tihana", 10, 9),
    ("Hugo", "Angeliki", 2, 1);
