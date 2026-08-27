ALTER TABLE usuarios
ADD CONSTRAINT usuarios_email_unique UNIQUE (email);