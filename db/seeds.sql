USE employees_db;

INSERT INTO department(name)
VALUES ('it'),('engineering');

INSERT INTO role(title,salary,department_id)
VALUES ('it guy',60000,1),('engineer bro',70000,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ('Jon','Snow',1,NULL),('Rod','johnson',2,1);