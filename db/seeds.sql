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
  ('Electronics Engineer', 110000, 2),
  ('Electronics Technician', 80000, 3),
  ('Software Engineer', 115000, 4),
  ('Product Systems Engineer', 115000, 5),
  ('Marketing Executive', 90000, 6),
  ('Accountant', 85000, 7),
  ('HR Manager', 120000, 8);


-- Inserts employee information into employee table
INSERT INTO employee
  (first_name, last_name, role_id, manager_id)
VALUES
  ('Greg', 'Blake', 1, 3),
  ('Luke', 'Thomas', 2, 1),
  ('Keith', 'Smith', 3, 5),
  ('Russ', 'Jones', 4, 4),
  ('Stephanie', 'Williams', 5, 2),
  ('Cameroon', 'Taylor', 6, 4),
  ('Ryan', 'Lee', 7, 1),
  ('Kelly', 'Martin', 8, 4);