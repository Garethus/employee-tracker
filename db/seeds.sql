-- Inserts names of departments into department table
INSERT INTO department
  (name)
VALUES
  ('Engineering'),
  ('Product'),
  ('Marketing'),
  ('Finance'),
  ('Human Resources');

-- Inserts roles of employee into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Engineering Manager', 165000, 1),
  ('Electronics Engineer', 110000, 1),
  ('Electronics Technician', 80000, 1),
  ('Software Engineer', 115000, 1),
  ('Product Systems Engineer', 115000, 2),
  ('Marketing Executive', 90000, 3),
  ('Accountant', 85000, 4),
  ('HR Manager', 120000, 5);


-- Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Greg', 'Blake', 1, NULL),
  ('Luke', 'Thomas', 2, 1),
  ('Keith', 'Smith', 3, 1),
  ('Russ', 'Jones', 4, 1),
  ('Stephanie', 'Williams', 5, 1),
  ('Cameroon', 'Taylor', 6, 5),
  ('Ryan', 'Lee', 7, 5),
  ('Kelly', 'Martin', 8, 5);